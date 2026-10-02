// ============================================================================
// FAST DATA I/O: GOODBYE CSV, HELLO PARQUET, ARROW & DUCKDB ENGINE
// Data engineering benchmarks:
// Serialized CSV Caveats, Columnar Compression, Predicate Pushdown, Zero-Copy IPC
// ============================================================================

export const IO_FORMATS_BENCHMARK = [
  {
    format: "CSV (pd.read_csv / pd.to_csv)",
    readTimeSec: 24.5,
    writeTimeSec: 35.2,
    fileSizeMb: 1250,
    memoryUsageMb: 2400,
    compressionRatio: "1.0x (Uncompressed Text)",
    predicatePushdown: "No (Full file must be parsed into memory)",
    schemaPreservation: "No (Infres data types dynamically, risking corruption)",
    notes: "Single-threaded string parsing bottleneck. 10x slower and 8x larger."
  },
  {
    format: "Apache Parquet (Snappy/ZSTD)",
    readTimeSec: 0.85,
    writeTimeSec: 1.90,
    fileSizeMb: 145,
    memoryUsageMb: 420,
    compressionRatio: "8.6x Compression",
    predicatePushdown: "Yes (Reads only target row groups & filtered columns)",
    schemaPreservation: "Yes (Strict binary metadata schema embedded)",
    notes: "Industry standard for analytics lakehouses; column-chunk dictionary encoding."
  },
  {
    format: "Apache Arrow / Feather",
    readTimeSec: 0.38,
    writeTimeSec: 0.95,
    fileSizeMb: 310,
    memoryUsageMb: 320,
    compressionRatio: "4.0x (Optimized for Memory IPC)",
    predicatePushdown: "Yes (Zero-copy memory mapping)",
    schemaPreservation: "Yes (Lossless memory layout identical to RAM)",
    notes: "Instantaneous memory-mapped reading between Python, R, and Rust with zero serialization cost."
  },
  {
    format: "DuckDB Direct Parquet Engine",
    readTimeSec: 0.12,
    writeTimeSec: 0.80,
    fileSizeMb: 145,
    memoryUsageMb: 85,
    compressionRatio: "8.6x Vectorized",
    predicatePushdown: "Yes (Vectorized SIMD filter execution)",
    schemaPreservation: "Yes (Full SQL types)",
    notes: "Queries Parquet files directly via SQL without loading into Python memory."
  }
];

export const CALCULATE_IO_SAVINGS = (datasetSizeGb = 10, queriesPerDay = 500) => {
  const csvReadTimeMin = (datasetSizeGb * 20 * queriesPerDay) / 60;
  const parquetReadTimeMin = (datasetSizeGb * 0.7 * queriesPerDay) / 60;
  const hoursSavedPerDay = (csvReadTimeMin - parquetReadTimeMin) / 60;

  const csvStorageGb = datasetSizeGb;
  const parquetStorageGb = datasetSizeGb * 0.12;
  const storageSavedGb = csvStorageGb - parquetStorageGb;

  return {
    hoursSavedPerDay: parseFloat(hoursSavedPerDay.toFixed(1)),
    storageSavedGb: parseFloat(storageSavedGb.toFixed(1)),
    speedupFactor: 28.5
  };
};

export const PYTHON_MODERN_IO_SCRIPT = `# ============================================================================
# MODERN HIGH-PERFORMANCE DATA I/O PIPELINE (PARQUET, POLARS & DUCKDB)
# Demonstrates 30x faster reads with predicate pushdown and schema safety
# ============================================================================

import polars as pl
import duckdb
import pyarrow.parquet as pq

# 1. High-Performance Columnar Parquet Writing (with Snappy compression)
df_polars = pl.DataFrame({
    "transaction_id": [f"TX_{i}" for i in range(1000000)],
    "amount": [19.99 * (i % 50) for i in range(1000000)],
    "status": ["COMPLETED" if i % 10 != 0 else "FAILED" for i in range(1000000)]
})
df_polars.write_parquet("transactions.parquet", compression="snappy")

# 2. Fast Predicate Pushdown with Polars (Reads ONLY required rows and columns)
filtered_df = (
    pl.scan_parquet("transactions.parquet")
    .filter(pl.col("amount") > 500.0)
    .select(["transaction_id", "amount"])
    .collect()  # Lazy execution executes filter directly on disk chunks
)

# 3. Direct SQL Querying via DuckDB (Zero-Memory Ingestion)
high_value_sum = duckdb.query("""
    SELECT status, count(*), sum(amount) as total_vol
    FROM 'transactions.parquet'
    WHERE amount > 500.0
    GROUP BY status
""").df()

print("DuckDB Aggregation Result:\\n", high_value_sum)
`;
