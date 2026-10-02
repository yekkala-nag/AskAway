// ============================================================================
// PYTHON PERFORMANCE PROFILING ENGINE
// Methodology: Stop Guessing, Start Measuring
// cProfile, SnakeViz Call Trees, line_profiler, Scalene, and Vectorized Speedups
// ============================================================================

export const PROFILING_TOOL_TIERS = [
  {
    tool: "cProfile (Standard Library)",
    scope: "Function-Level Call Counts & Cumulative Time",
    overhead: "~5% CPU Overhead (Deterministic)",
    output: "Call stats table with ncalls, tottime, percall, cumtime",
    bestFor: "Global overview: finding which top 3 functions dominate 90% of execution time."
  },
  {
    tool: "SnakeViz (Browser Visualizer)",
    scope: "Interactive Sunburst & Icicle Call Trees",
    overhead: "Zero additional overhead (reads .prof files)",
    output: "Interactive Zoomable Call Stack Flame Chart",
    bestFor: "Visualizing nested call hierarchies and identifying hidden slow helper functions."
  },
  {
    tool: "line_profiler (@profile)",
    scope: "Line-by-Line Microsecond Execution Breakdown",
    overhead: "~15% Overhead (Tracing)",
    output: "% Time spent per physical line of Python code",
    bestFor: "Optimizing heavy numerical loops, string parsing, and inner algorithms."
  },
  {
    tool: "Scalene (AI-Assisted Profiler)",
    scope: "Separates Python vs C vs GPU vs Memory Allocation",
    overhead: "~10% Overhead",
    output: "Annotated source code with AI optimization suggestions",
    bestFor: "Detecting memory leaks, global interpreter lock (GIL) contention, and non-vectorized operations."
  }
];

export const OPTIMIZATION_BENCHMARK_CASES = [
  {
    id: "df_iteration",
    title: "1. DataFrame Row Iteration (100,000 Rows)",
    naiveMethod: "for index, row in df.iterrows(): row['a'] * row['b']",
    naiveTimeMs: 12400.0,
    optimizedMethod: "df['a'] * df['b']  # Native SIMD Vectorization",
    optimizedTimeMs: 4.2,
    speedup: "2,950x Faster",
    rootCause: "iterrows() creates a heavy Pandas Series object on every single row iteration."
  },
  {
    id: "list_membership",
    title: "2. Large Collection Lookup (1,000,000 Lookups)",
    naiveMethod: "if item in large_list:  # O(N) linear scan",
    naiveTimeMs: 4500.0,
    optimizedMethod: "if item in large_set:  # O(1) hash table lookup",
    optimizedTimeMs: 18.0,
    speedup: "250x Faster",
    rootCause: "Scanning unindexed Python lists requires walking up to 1M pointers per check."
  },
  {
    id: "string_concat",
    title: "3. Large String Accumulation (500,000 Strings)",
    naiveMethod: "s = ''; for w in words: s += w  # Quadratic reallocations",
    naiveTimeMs: 3800.0,
    optimizedMethod: "s = ''.join(words)  # Single buffer pre-allocation",
    optimizedTimeMs: 12.0,
    speedup: "316x Faster",
    rootCause: "String immutability forces Python to allocate a new buffer and copy previous text on every '+' operation."
  }
];

export const PYTHON_PROFILING_PIPELINE_SCRIPT = `# ============================================================================
# PRODUCTION PYTHON PROFILING RECIPES (cProfile + SnakeViz + line_profiler)
# Stop guessing: profile deterministically and visualize hot paths
# ============================================================================

import cProfile
import pstats
import io

def slow_data_transformation():
    data = [x * 2 for x in range(1000000)]
    filtered = [x for x in data if x % 5 == 0]
    return sum(filtered)

# 1. Deterministic Function-Level Profiling via cProfile
def profile_function():
    profiler = cProfile.Profile()
    profiler.enable()
    
    result = slow_data_transformation()
    
    profiler.disable()
    
    # Export for SnakeViz interactive visualization
    profiler.dump_stats("pipeline_performance.prof")
    
    # Print formatted stats table sorted by cumulative time
    s = io.StringIO()
    ps = pstats.Stats(profiler, stream=s).sort_stats('cumulative')
    ps.print_stats(10)
    print(s.getvalue())

# 2. CLI Command to Launch SnakeViz Browser Visualizer:
# $ snakeviz pipeline_performance.prof

if __name__ == '__main__':
    profile_function()
`;
