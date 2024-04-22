type BenchmarkParams = {
    [key: string]: any
}

export class Benchmark {

    rounds: number
    repeat: number
    params: BenchmarkParams

    constructor(params: BenchmarkParams) {
        this.params = params
    }

    setup = async (params = this.params) => {}
    run = async (params = this.params) => {}

}
