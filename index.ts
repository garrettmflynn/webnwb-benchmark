import benchmarks from './benchmarks'

type BenchmarkResults = number[]

export const runBenchmark = async (name) => {
    const instance = benchmarks[name]

    const allResults: BenchmarkResults[] = []

    for (let params of instance.params) {

        const results: number[] = []

        // for (let _ in Array.from({ length: instance.rounds })) {

            for (let _ in Array.from({ length: instance.repeat ?? 1 })) {
                await instance.setup(params)
                const start = performance.now()
                await instance.run(params)
                const end = performance.now()
                console.log(name, end - start)
                results.push(end - start)
            }
        // }

        allResults.push(results.map( (time) => time / 1000 )) // Convert to seconds
    }

    return allResults
};


export const runAllBenchmarks = async () => {
    const results = {}
    for (const name in benchmarks) results[name] = await runBenchmark(name)
    return results
}
