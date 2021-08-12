import { ImageReadable } from './interfaces';
import * as React from 'react';
import Row from './Row';
import { readableFileSize, toStringDateTime } from './tools';
import * as Docker from 'dockerode';


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
const extractAllTags = (list: Docker.ImageInfo[]): Extracted[] => {
    return list.reduce((all, current) => {
        const versions = current.RepoTags.map(t => {
            const [name, tag] = t.split(':')
            return {name, tag, id: current.Id, size: current.Size, created: current.Created }
        })

        return [...all, ...versions]
    }, [])
}

export const toReadableImages = (imageList: Docker.ImageInfo[]): ImageReadable[] =>
    extractAllTags(imageList)
    .filter(r => r.tag !== '<none>' || r.name !== '<none>')
    .reduce<ImageReadable[]>((all, current) => {
        if (all.findIndex(r => r.name === current.name) > -1) {
            return all.map(a => a.name === current.name ? {...a, tags: [...a.tags, toTag(current)]} : a)
        } else {
            return [...all, { name: current.name, id: current.id, tags: [toTag(current)]}]
        }
    }, [])

export const ImageListRender = ({ isFetching, list }: { list: Docker.ImageInfo[]; isFetching: boolean; }) => {
    return (
        <table style={{ width: '100%' }}>
            <thead>
            <tr>
                <th>Image</th>
                <th colSpan={2}>Tag</th>
                <th>Size</th>
                <th>Created</th>
            </tr>
            </thead>
            {isFetching ? (
                <tbody><tr><td colSpan={5}>fetching images</td></tr></tbody>
            ) : (toReadableImages(list).map((image) => (<Row key={image.id} image={image}/>))
            )}
        </table>
    );
}

export const ImageList = () => {
    const [list, setList] = React.useState<Docker.ImageInfo[]>([]);
    const [error, setError] = React.useState<Error>();
    const [isFetching, setIsFetching] = React.useState(false);

    const fetchList = async () => {

        const docker = new Docker();
        setIsFetching(true);

        docker.listImages({ all: true }, (error, images) => {
            if (error) {
                console.error('imageList error', error);
                setError(error);
            } else {

            setList(images)
            }
        });

        setIsFetching(false);
    }

    React.useEffect(() => {
        fetchList()
    }, []);


    return (
        <>
            <button onClick={fetchList}>{isFetching ? "refreshing" : "refresh"}</button>
            {error ? (<div>{error.message}</div>) : (<ImageListRender list={list} isFetching={isFetching} />)}
        </>
    )
}
