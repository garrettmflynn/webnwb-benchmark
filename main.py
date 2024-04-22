import asyncio
from pathlib import Path
from src.webnwb_benchmark.benchmark import WebNWBBenchmarks

TESTS = ["RemoteH5FileSliceBenchmark"]


async def run_benchmarks(tests):
    try:
        await benchmark_manager.start()
        await benchmark_manager.open()
        tests = await benchmark_manager.page.evaluate(
            f"Object.keys(globalThis.benchmarks)"
        )
        await benchmark_manager.run_all(tests)

        ## Locally Defined Test Cases
        # await benchmark_manager.run_all(TESTS)

    except KeyboardInterrupt:
        pass
    finally:
        await benchmark_manager.close()

    return benchmark_manager.results


if __name__ == "__main__":

    html_path = Path(__file__).parent / "dist" / "index.html"
    benchmark_manager = WebNWBBenchmarks(html_path)

    loop = asyncio.get_event_loop()
    results = loop.run_until_complete(run_benchmarks(TESTS))

    averaged_results = {}
    for test, results in results.items():
        averaged_results[test] = sum(results) / len(results)

    print("Averaged Results", averaged_results, end="\n\n")
