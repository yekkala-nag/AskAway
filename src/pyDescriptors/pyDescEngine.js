// ── Python descriptors engine — controlled attributes via the descriptor
// protocol (__get__/__set__/__delete__/__set_name__). Original teaching
// content; no external sources, URLs, or citations. Numbers are illustrative.

export const DESCRIPTOR_KINDS = [
  {
    id: 'validated', name: 'Validated attribute', icon: '🛡️',
    hooks: ['__set_name__', '__get__', '__set__'],
    job: 'Enforces type and range constraints every time the attribute is written.',
    without: 'A bad value sits silently in the object until it explodes somewhere far from the assignment.',
    example: 'tour.rating = 6.0 → ValueError before anything is stored',
  },
  {
    id: 'computed', name: 'Computed attribute', icon: '🧮',
    hooks: ['__set_name__', '__get__', '__set__ (raises)'],
    job: 'Derives a read-only value on the fly from other state on the same object.',
    without: 'You hand-write a method, forget to update a cached copy, and the two drift apart.',
    example: 'tour.price_usd recomputes from price_jpy on every access',
  },
  {
    id: 'lazy', name: 'Lazily loaded attribute', icon: '😴',
    hooks: ['__set_name__', '__get__'],
    job: 'Defers an expensive fetch until first access, then caches it on the instance.',
    without: 'Constructors eagerly pay for data the caller may never touch.',
    example: 'tour.itinerary queries once, then reads straight from __dict__',
  },
];

export const PROTOCOL_METHODS = [
  { method: '__get__(self, obj, objtype=None)', fires: 'Every attribute read', note: 'obj is None when accessed on the class — return the descriptor itself' },
  { method: '__set__(self, obj, value)', fires: 'Every attribute write', note: 'A descriptor with __set__ is a DATA descriptor — it outranks the instance dict' },
  { method: '__delete__(self, obj)', fires: 'Every del', note: 'Rarely needed; implement it if deletion must be controlled' },
  { method: '__set_name__(self, owner, name)', fires: 'Once, at class creation', note: 'Python 3.6+; receives the attribute name so you can build a private storage key' },
];

// The famous attribute lookup order for obj.name.
export const LOOKUP_CHAIN = [
  { n: 1, step: 'Data descriptors on the type', detail: 'Class dict entries defining __set__ or __delete__ — they win over everything' },
  { n: 2, step: 'Instance __dict__', detail: 'Plain values already stored on the object itself' },
  { n: 3, step: 'Non-data descriptors & functions', detail: 'Only __get__ defined — methods and lazy descriptors live here' },
  { n: 4, step: 'Class-level defaults', detail: 'Bare class attributes found in the MRO' },
];

export const VS_PROPERTY = [
  { axis: 'One attribute, one handler', property: 'A fresh decorator + two functions per attribute', descriptor: 'One reusable class attached to many attributes' },
  { axis: 'Reused across classes', property: 'Copy-paste the decorated pair', descriptor: 'Instantiate the same descriptor with different bounds/rates' },
  { axis: 'Runs at class creation', property: 'No hook for the attribute name', descriptor: '__set_name__ hands you owner and name' },
  { axis: 'Storage lives where?', property: "Whatever name you typed in the setter", descriptor: 'Convention: a private key derived from the public name' },
];

// ── Simulator math ──────────────────────────────────────────────────────────

export function validateRating(value, minVal = 1.0, maxVal = 5.0) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return { ok: false, kind: 'TypeError', message: 'rating must be a number.', stored: null };
  }
  if (value < minVal || value > maxVal) {
    return { ok: false, kind: 'ValueError', message: `rating must be between ${minVal} and ${maxVal}.`, stored: null };
  }
  return { ok: true, kind: null, message: null, stored: Math.round(value * 100) / 100 };
}

export const JPY_USD_RATE = 0.0067; // 1 JPY ≈ 0.0067 USD, illustrative

export function toUsd(jpy, rate = JPY_USD_RATE) {
  if (typeof jpy !== 'number' || Number.isNaN(jpy)) throw new TypeError('price_jpy must be a number');
  return Math.round(jpy * rate * 100) / 100;
}

// Access log for a lazy descriptor: first read computes (expensive),
// every later read is a cache hit straight from the instance dict.
export function lazyAccessLog(accesses) {
  if (!Number.isInteger(accesses) || accesses < 0) throw new TypeError('accesses must be a non-negative integer');
  return Array.from({ length: accesses }, (_, i) => ({
    n: i + 1,
    path: i === 0 ? 'descriptor __get__ → compute → cache in __dict__' : 'instance __dict__ (descriptor bypassed)',
    cost: i === 0 ? 'expensive' : 'instant',
    hit: i > 0,
  }));
}

// Which lookup step wins for a given attribute shape.
export function lookupWinner({ hasSet, inInstanceDict }) {
  if (hasSet) return { winner: 1, label: 'Data descriptor wins — __set__ overrides the instance dict' };
  if (inInstanceDict) return { winner: 2, label: "Instance __dict__ wins — the descriptor can't intercept reads" };
  return { winner: 3, label: 'Non-data descriptor / method wins — nothing cached on the instance' };
}

export const DESC_CODE = `class ValidatedRating:
    def __init__(self, min_val=1.0, max_val=5.0):
        self.min_val, self.max_val = min_val, max_val

    def __set_name__(self, owner, name):
        self.public_name = name
        self.private_name = f"_{name}"          # collision-free storage key

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self                          # Class.rating → descriptor itself
        return getattr(obj, self.private_name)

    def __set__(self, obj, value):
        if not isinstance(value, (int, float)):
            raise TypeError(f"{self.public_name} must be a number.")
        if not (self.min_val <= value <= self.max_val):
            raise ValueError(
                f"{self.public_name} must be between {self.min_val} and {self.max_val}."
            )
        setattr(obj, self.private_name, float(value))


class ComputedUSDPrice:
    def __init__(self, exchange_rate=0.0067):
        self.exchange_rate = exchange_rate

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        jpy = getattr(obj, 'price_jpy', 0)
        return round(jpy * self.exchange_rate, 2)   # derived, never stored

    def __set__(self, obj, value):
        raise AttributeError(f"{self.name} is computed and read-only.")


class LazyItinerary:
    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        if self.name in obj.__dict__:               # already cached? bypass
            return obj.__dict__[self.name]
        itinerary = build_heavy_itinerary(obj.destination)  # expensive
        obj.__dict__[self.name] = itinerary         # future reads skip us
        return itinerary


class JapanTour:
    rating = ValidatedRating(min_val=1.0, max_val=5.0)   # validated
    price_usd = ComputedUSDPrice()                        # computed
    itinerary = LazyItinerary()                           # lazy

    def __init__(self, destination, price_jpy, rating):
        self.destination = destination
        self.price_jpy = price_jpy
        self.rating = rating      # triggers ValidatedRating.__set__ immediately`;

export const TAB_CODE_DEMO = `tour = JapanTour(destination="Kyoto", price_jpy=45000, rating=4.8)

tour.rating            # 4.8  (validated on the way in)
tour.price_usd         # 301.5 — recomputed from price_jpy every read
tour.itinerary         # expensive build the first time…
tour.itinerary         # …instant afterwards, read from __dict__

tour.rating = 6.0      # ValueError: rating must be between 1.0 and 5.0.
tour.price_usd = 10    # AttributeError: computed and read-only.`;

// ── Code execution trace (deterministic mirror of the demo) ─────────────────
export function demoTrace() {
  return [
    { line: 'JapanTour("Kyoto", 45000, 4.8)', effect: '__set_name__ already ran at class creation; constructor writes rating → ValidatedRating.__set__ validates and stores 4.8' },
    { line: 'tour.rating', effect: '__get__ → getattr(tour, "_rating") → 4.8' },
    { line: 'tour.rating = 6.0', effect: '__set__ raises ValueError — nothing stored' },
    { line: 'tour.price_usd', effect: '__get__ reads price_jpy × 0.0067 → 301.5, returns rounded float' },
    { line: 'tour.itinerary (1st)', effect: '__get__ misses __dict__, builds payload, caches under "itinerary"' },
    { line: 'tour.itinerary (2nd)', effect: 'found in instance __dict__ — descriptor never runs' },
  ];
}
