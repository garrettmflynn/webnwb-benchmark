import asyncio
from src.webnwb_benchmark.benchmark import WebNWBBenchmarks

TESTS = [
    'test'
]

benchmark_manager = WebNWBBenchmarks()

async def run_benchmarks(tests):
    await benchmark_manager.start()
    await benchmark_manager.open()
    await benchmark_manager.run_all(tests)
    await benchmark_manager.close()
    return benchmark_manager.results

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    results = loop.run_until_complete(run_benchmarks(TESTS))
    print("Benchmark finished", results)