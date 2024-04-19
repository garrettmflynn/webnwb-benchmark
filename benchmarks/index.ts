import * as lindi from './lindi/index.js'
import * as hdf5 from './hdf5/index.js'

const benchmarks = { lindi, hdf5 }

const organizedBenchmarks = {}
for (let type in benchmarks) {
    for (let benchmark in benchmarks[type]) {
        for (let name in benchmarks[type][benchmark]) {
            if (name === 'params') continue // Skip the params object
            const cls = benchmarks[type][benchmark][name]
            organizedBenchmarks[name] = new cls(benchmarks[type][benchmark].params)
        }
    }
}

export default organizedBenchmarks
