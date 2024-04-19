import * as benchmarks from './benchmarks'

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

    return results.map( (time) => time / 1000 ) // Convert to seconds
};

  
export const runAllBenchmarks = async () => {
    const results = {}
    for (const name in benchmarks) results[name] = await runBenchmark(name)
    return results
}
