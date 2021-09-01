import express from "express";
import Docker, { ImageInfo } from 'dockerode';
import { ImageReadable } from './modules/interfaces';
import { readableFileSize, toStringDateTime } from './tools';


const toTag = (current: Extracted): ImageReadable['tags'][0] => ({
    tag: current.tag,
    size: current.size,
    sizeReadable: readableFileSize(current.size),
    created: current.created,
    createdReadable: toStringDateTime(current.created)
})

interface Extracted {
    name: string;
    id: string;
    tag: string;
    size: number;
    sizeVirtual: number;
    created: number;
}
const extractAllTags = (list: ImageInfo[]): Extracted[] => {
    return list.reduce((all, current) => {
        const versions = current.RepoTags.map(t => {
            const [name, tag] = t.split(':')
            return {name, tag, id: current.Id, size: current.Size, created: current.Created }
        })

        return [...all, ...versions]
    }, [])
}

const toReadableImages = (imageList: ImageInfo[]): ImageReadable[] =>
    extractAllTags(imageList)
        .filter(r => r.tag !== '<none>' || r.name !== '<none>')
        .reduce<ImageReadable[]>((all, current) => {
            if (all.findIndex(r => r.name === current.name) > -1) {
                return all.map(a => a.name === current.name ? {...a, tags: [...a.tags, toTag(current)]} : a)
            } else {
                return [...all, { name: current.name, id: current.id, tags: [toTag(current)]}]
            }
        }, [])


export const server = () => {

    const app = express();
    const docker = new Docker();

    app.use((req, res, next) => {
        console.log(`new ${req.method} request on ${req.originalUrl}`);
        next();
    });

    app.get('/images', (req, res) => {
        docker.listImages({ all: true }, (error, images) => {
            if (error) {
                console.error('imageList error', error);
                return res.status(500).json({ error: error.message })
            }
                return res.status(200).json(toReadableImages(images))
        });

    })


    return {
        listen: async (port: number) => {
            app.listen(port, () => new Promise((resolve) => {
                console.log('ok')
                //todo: try different port when {port} is busy
                resolve(port)
            }))
        }
    }
}
