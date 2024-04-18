import { Benchmark } from '../types'
import { RemoteH5FileLindi, getRemoteH5FileLindi } from '@fi-sci/remote-h5-file'

type FileSliceParams = {
    lindi_url: string
    object_name: string
    slice: [number, number][] | undefined
}

const fileSliceParams: FileSliceParams = {
    lindi_url: 'https://lindi.neurosift.org/dandi/dandisets/000409/assets/37ca1798-b14c-4224-b8f0-037e27725336/zarr.json',
    object_name: '/acquisition/ElectricalSeriesAp/data',
    slice: [[0, 20]]
}

export class RemoteLindiFileSliceBenchmark implements Benchmark {

    rounds = 1
    repeat = 3

    #remoteFile: RemoteH5FileLindi
    params: FileSliceParams = fileSliceParams

    setup = async ({ lindi_url, object_name }: FileSliceParams ) => {
        this.#remoteFile = await getRemoteH5FileLindi(lindi_url)
        this.#remoteFile._disableCache() // Clear the cache
        const ds = await this.#remoteFile.getDataset(object_name)
        
        if (ds) {
            if ( ds.attrs["_EXTERNAL_ARRAY_LINK"] ) console.warn('Has fallen back to HDF5 reader.')
        } 
    
        else throw new Error('Dataset not found.')
    }

    run = async ({ object_name, slice }: FileSliceParams ) => await this.#remoteFile.getDatasetData(object_name, { slice })
}