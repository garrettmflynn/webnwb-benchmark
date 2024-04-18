/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRemoteH5File, RemoteH5File } from '@fi-sci/remote-h5-file'

type FileSliceParams = {
    h5_url: string
    object_name: string
    slice: [number, number][] | undefined
}

const fileSliceParams: FileSliceParams = {
    h5_url: 'https://api.dandiarchive.org/api/assets/c04f6b30-82bf-40e1-9210-34f0bcd8be24/download/',
    object_name: '/acquisition/ElectricalSeriesAp/data',
    slice: [[0, 20]]
}

export class RemoteH5FileSliceBenchmark {

    rounds = 1
    repeat = 3

    #remoteFile: RemoteH5File | undefined
    params: FileSliceParams = fileSliceParams

    async setup({ h5_url }: FileSliceParams ) {
        this.#remoteFile = await getRemoteH5File(h5_url)
    }

    async run({ object_name, slice }: FileSliceParams ) {

        if (this.#remoteFile === undefined) throw new Error("remote file not initialized")

        const data = await this.#remoteFile.getDatasetData(object_name, {slice})

        return data
    }
}