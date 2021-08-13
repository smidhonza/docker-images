import { ImageReadable } from './interfaces';
import {ImageInfo} from 'dockerode';

const get = (size: number, units: string[]): string => {
    const [head, ...rest] = units;
    if (size >= 1024) {
        return get(size / 1024, rest)
    }
    return `${size.toFixed(1)} ${head}`
}

export const readableFileSize = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    return get(size, units);
}


export const pad = (n: number) => (n < 10 ? '0' + n : n);

export const toStringDateTime = (miliseconds: number) => {
    const date = new Date(miliseconds * 1000)
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
};


export const toReadableDate = (datetime: string) => {
    const date = new Date(datetime)
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`

}



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

export const toReadableImages = (imageList: ImageInfo[]): ImageReadable[] =>
    extractAllTags(imageList)
        .filter(r => r.tag !== '<none>' || r.name !== '<none>')
        .reduce<ImageReadable[]>((all, current) => {
            if (all.findIndex(r => r.name === current.name) > -1) {
                return all.map(a => a.name === current.name ? {...a, tags: [...a.tags, toTag(current)]} : a)
            } else {
                return [...all, { name: current.name, id: current.id, tags: [toTag(current)]}]
            }
        }, [])
