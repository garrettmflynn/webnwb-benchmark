import asyncio
from pathlib import Path
from src.webnwb_benchmark.benchmark import WebNWBBenchmarks

TESTS = [
    'TestTimeSliceBenchmark'
]


async def run_benchmarks(tests):
    try:
        await benchmark_manager.start()
        await benchmark_manager.open()
        tests = await benchmark_manager.page.evaluate(f'Object.keys(globalThis.benchmarks)')
        await benchmark_manager.run_all(tests)

    except KeyboardInterrupt:
        pass
    finally:
        await benchmark_manager.close()

    return benchmark_manager.results

if __name__ == "__main__":
    
    html_path = Path(__file__).parent / 'dist' / 'index.html'
    benchmark_manager = WebNWBBenchmarks(html_path)

    loop = asyncio.get_event_loop()
    results = loop.run_until_complete(run_benchmarks(TESTS))
    print("Benchmark finished", results)