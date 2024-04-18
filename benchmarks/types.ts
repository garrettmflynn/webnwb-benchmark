type BenchmarkParams = {
    [key: string]: any
}

type Benchmark = {
    rounds: number
    repeat: number
    params: BenchmarkParams
    setup: (params: BenchmarkParams) => void
    run: (params: BenchmarkParams) => void
}