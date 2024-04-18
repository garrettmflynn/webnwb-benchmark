import { Benchmark } from '../types'
import { 
    getRemoteH5File, 
    RemoteH5File, 
    // cacheBust 
} from '@fi-sci/remote-h5-file'

const cacheBust = () => Math.random().toString(36).substring(7)

type FileSliceParams = {
    h5_url: string
    object_name: string
    slice: [number, number][] | undefined
}

const fileSliceParams: FileSliceParams = {
    h5_url: `https://api.dandiarchive.org/api/assets/37ca1798-b14c-4224-b8f0-037e27725336/download/?cb=${cacheBust()}`, // Clear the cache
    object_name: '/acquisition/ElectricalSeriesAp/data',
    slice: [[0, 20]]
}

export class RemoteH5FileSliceBenchmark implements Benchmark {

    rounds = 1
    repeat = 3

    #remoteFile: RemoteH5File
    params: FileSliceParams = fileSliceParams

    setup = async ({ h5_url, object_name }: FileSliceParams ) => {
        this.#remoteFile = await getRemoteH5File(h5_url)
        const ds = await this.#remoteFile.getDataset(object_name)
        if (!ds) throw new Error('Dataset not found.')
    }

    run = async ({ object_name, slice }: FileSliceParams ) => await this.#remoteFile.getDatasetData(object_name, { slice })
}