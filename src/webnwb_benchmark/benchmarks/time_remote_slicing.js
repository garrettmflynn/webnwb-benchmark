
// Time Remote Slicing Port 
const timeRemoteSlicingParams = {
    s3_url: 'test',
    object_name: ["ElectricalSeriesAp"],
    slice_range: [([0, 30_000], [0, 384])]
}

export class TestTimeSliceBenchmark {

    rounds = 1
    repeat = 3

    constructor() {
        this.params = timeRemoteSlicingParams
    }

    setup = () => {}

    run = ({ s3_url, object_name, slice_range } = this.params) => {
        console.log('Parameters', s3_url, object_name, slice_range)
    }
}