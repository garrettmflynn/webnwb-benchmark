type Benchmark = {
    rounds: number
    repeat: number
    params: any
    setup: (params) => void
    run: (params: any) => void
}