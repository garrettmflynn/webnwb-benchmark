import { Benchmark } from '../benchmark'
import { RemoteH5FileLindi } from '@fi-sci/remote-h5-file'
import { cacheBust } from '../utils'

type FileSliceParams = {
    lindi_url: string
    object_name: string
    slice: [number, number][] | undefined
}

export const params: FileSliceParams[] = [
    {
        lindi_url: 'https://lindi.neurosift.org/dandi/dandisets/000717/assets/3d12a902-139a-4c1a-8fd0-0a7faf2fb223/zarr.json',
        object_name: '/acquisition/ElectricalSeriesAp/data',
        slice: [[0, 20]]
    }
]

export class RemoteLindiFileSliceBenchmark extends Benchmark {

    rounds = 1
    repeat = 3

    file: RemoteH5FileLindi

    setup = async ({ lindi_url, object_name }: FileSliceParams ) => {
        this.file = await RemoteH5FileLindi.create(lindi_url + `?cb=${cacheBust()}`) // Clear the cache
        this.file._disableCache() // Clear the cache
        const ds = await this.file.getDataset(object_name)

        if (ds) {
            if ( ds.attrs["_EXTERNAL_ARRAY_LINK"] ) console.warn('Has fallen back to HDF5 reader.')
        }

        else throw new Error('Dataset not found.')
    }

    run = async ({ object_name, slice }: FileSliceParams ) => await this.file.getDatasetData(object_name, { slice })
}
