import * as benchmarks from './benchmarks'

const average = (arr) => arr.reduce((acc, time) => acc + time, 0) / arr.length

export const runBenchmark = async (name) => {
    const cls = benchmarks[name]
    const instance = new cls()

    const results: number[] = []

    // for (let _ in Array.from({ length: instance.rounds })) {
        for (let _ in Array.from({ length: instance.repeat ?? 1 })) {
            const params = instance.params
            await instance.setup(params)
            const start = performance.now()
            await instance.run(params)
            const end = performance.now()
            console.log(name, end - start)
            results.push(end - start)
        }
    // }

    return average(results)
};

  
export const runAllBenchmarks = async () => {
    const results = {}
    for (const name in benchmarks) results[name] = await runBenchmark(name)
    return results
}
