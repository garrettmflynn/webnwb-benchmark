import { Benchmark } from '../types'
import { 
    getRemoteH5File, 
    RemoteH5File, 
} from '@fi-sci/remote-h5-file'
import { cacheBust } from '../utils'

type FileSliceParams = {
    h5_url: string
    object_name: string
    slice: [number, number][] | undefined
}

const fileSliceParams: FileSliceParams = {
    h5_url: `https://api.dandiarchive.org/api/assets/3d12a902-139a-4c1a-8fd0-0a7faf2fb223/download/`,
    object_name: '/acquisition/ElectricalSeriesAp/data',
    slice: [[0, 20]]
}

export class RemoteH5FileSliceBenchmark implements Benchmark {

    rounds = 1
    repeat = 3

    #remoteFile: RemoteH5File
    params: FileSliceParams = fileSliceParams

    setup = async ({ h5_url, object_name }: FileSliceParams ) => {
        this.#remoteFile = await getRemoteH5File(h5_url + `?cb=${cacheBust()}`) // Clear the cache
        const ds = await this.#remoteFile.getDataset(object_name)
        if (!ds) throw new Error('Dataset not found.')
    }

    run = async ({ object_name, slice }: FileSliceParams ) => await this.#remoteFile.getDatasetData(object_name, { slice })
}