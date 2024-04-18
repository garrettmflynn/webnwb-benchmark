/* eslint-disable @typescript-eslint/no-explicit-any */
import { RemoteH5FileLindi, getRemoteH5FileLindi } from '@fi-sci/remote-h5-file'

type FileSliceParams = {
    lindi_url: string
    object_name: string
    slice: [number, number][] | undefined
}

const fileSliceParams: FileSliceParams = {
    lindi_url: 'https://lindi.neurosift.org/dandi/dandisets/000409/assets/c04f6b30-82bf-40e1-9210-34f0bcd8be24/zarr.json',
    object_name: '/acquisition/ElectricalSeriesAp/data',
    slice: [[0, 20]]
}

export class RemoteLindiFileSliceBenchmark {
    #remoteFile: RemoteH5FileLindi | undefined

    params: FileSliceParams = fileSliceParams

    async setup({ lindi_url, object_name, slice }: FileSliceParams ) {
        this.#remoteFile = await getRemoteH5FileLindi(lindi_url)
    }

    async run({ lindi_url, object_name, slice }: FileSliceParams ) {

        if (this.#remoteFile === undefined) throw new Error("remote file not initialized")

        const data = await this.#remoteFile.getDatasetData(object_name, {slice})

        return data
    }
}