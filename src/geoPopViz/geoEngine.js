// ============================================================================
// GEO POPULATION VIZ ENGINE (WorldPop vs Facebook)
// GADM boundaries, raster vs vector, masking, choropleth, source comparison
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const DATASETS = [
  { src: "GADM boundaries", form: "Shapefiles L0–L3 (VN: 63 / 686 / 7658 units)", role: "Digital polygons to aggregate into" },
  { src: "WorldPop (raster)", form: "TIFF 100m, RF + micro-census, UN-adjusted, yearly", role: "Pixel people-per-pixel grids" },
  { src: "Facebook HRSL (vector)", form: "CSV lat/lon/pop, 30m, buildings-from-satellite", role: "Point estimates → geodataframe" }
];

export const PIPELINE_STEPS = [
  { step: "1 · GADM", detail: "geopandas.read_file → 63 L1 polygons", lib: "geopandas" },
  { step: "2 · WorldPop", detail: "rasterio.open → sum positives → mask by polygon", lib: "rasterio + numpy" },
  { step: "3 · Facebook", detail: "CSV → geodataframe → same mask", lib: "geopandas" },
  { step: "4 · Compare", detail: "Choropleths + scatter vs 45° line per level", lib: "plotly" }
];

export const RESULTS = [
  { level: "Vietnam total", wp: "97.34M", fb: "98.16M", read: "Close — both sane nationally" },
  { level: "L1 provinces (63)", wp: "≈ FB", fb: "≈ WP", read: "High correlation" },
  { level: "L2 districts (Binh Duong, HCMC…)", wp: "Higher", fb: "Lower", read: "Diverges where it matters — question decides source" }
];

export const RASTER_VS_VECTOR = [
  { q: "What is it?", raster: "Gridded pixels + geo metadata (extent, cell, CRS, bands)", vector: "Points/lines/polygons + attributes" },
  { q: "Strength", raster: "Continuous surfaces (density, elevation)", vector: "Exact boundaries + per-unit stats" },
  { q: "Join key", raster: "Mask pixels by polygon", vector: "Point-in-polygon, then aggregate" }
];

// ── Simulator: source agreement by admin level ──────────────────────────────
export const AGREEMENT = (level = "L1") => {
  const table = {
    L0: { corr: 0.99, gap: "0.8M (0.8%)", use: "Either — national totals agree", color: "#3A9B9F" },
    L1: { corr: 0.97, gap: "±3% typical", use: "Either, spot-check outliers", color: "#3A9B9F" },
    L2: { corr: 0.88, gap: "HCMC/Binh Duong diverge", use: "Question decides: recency→FB, stability→WP", color: "#F5A623" },
    L3: { corr: 0.72, gap: "Wide local gaps", use: "Field-validate; neither source is truth", color: "#ef4444" }
  };
  return { level, ...table[level], note: "45°-line test: identical only where it doesn't matter." };
};

export const PYTHON_GEO_CODE = `# ============================================================================
# GEO POPULATION: boundaries + raster + vector -> masked choropleth
# (WorldPop 100m TIFF vs Facebook 30m CSV, Vietnam demo)
# ============================================================================
import geopandas as gpd
import rasterio
import numpy as np
from rasterio.mask import mask

bounds = gpd.read_file("gadm36_VNM_3.shp")      # 63 / 686 / 7658 units
print("L1 units:", bounds["NAME_1"].nunique())

with rasterio.open("vnm_ppp_2020_UNadj.tif") as src:   # 1 band, people/px
    print("bands:", src.count)
    total = 0.0
    for _, poly in bounds[bounds["NAME_1"] == "Ho Chi Minh"].iterrows():
        out, _ = mask(src, [poly.geometry], crop=True)  # raster x polygon
        total += out[out > 0].sum()
print("HCMC (WorldPop):", round(float(total) / 1e6, 2), "million")

# Facebook CSV: lat/lon/pop -> GeoDataFrame -> same mask -> plotly choropleth
# Compare per level on a scatterplot vs the 45-degree line.
`;
