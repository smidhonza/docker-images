import { Left, Maybe, Right } from "fputils"
import { ImageReadable } from './modules/interfaces';

export interface IDockerService {
    images: () => Promise<Maybe<ImageReadable[]>>
}

export const dockerService = (url: string): IDockerService => {

    return {
        images: async () => {
            try {
                const raw = await fetch(`${url}/images`)
                const data = await raw.json()
                return Right(data)
            } catch (error) {
                console.log({error})
                return Left(error)

            }
        }
    }
}
