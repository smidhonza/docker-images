import { Image, ImageReadable } from './interfaces';
import { runScript } from './utils';
import * as React from 'react';
import Row from './Row';
import { readableFileSize, toStringDateTime } from './tools';

const imageList = async (): Promise<Image[]> => {
    const a = await runScript('curl --unix-socket /var/run/docker.sock -H "Content-Type: application/json" http://localhost/v1.41/images/json', false);
    return JSON.parse(a)
};

const toTag = (current: Extracted): ImageReadable['tags'][0] => ({
    tag: current.tag,
    size: readableFileSize(current.size),
    created: current.created,
    createdReadable: toStringDateTime(current.created)
})

interface Extracted {
    name: string;
    id: string;
    tag: string;
    size: number;
    created: number;
}
const extractAllTags = (list: Image[]): Extracted[] => {
    return list.reduce((all, current) => {
        const versions = current.RepoTags.map(t => {
            const [name, tag] = t.split(':')
            return {name, tag, id: current.Id, size: current.Size, created: current.Created}
        })

        return [...all, ...versions]
    }, [])
}

export const toReadableImages = (imageList: Image[]): ImageReadable[] =>
    extractAllTags(imageList)
    .filter(r => r.tag !== '<none>' || r.name !== '<none>')
    .reduce<ImageReadable[]>((all, current) => {
        if (all.findIndex(r => r.name === current.name) > -1) {
            return all.map(a => a.name === current.name ? {...a, tags: [...a.tags, toTag(current)]} : a)
        } else {
            return [...all, { name: current.name, id: current.id, tags: [toTag(current)]}]
        }
    }, [])

export const ImageListRender = ({ isFetching, list }: { list: Image[]; isFetching: boolean; }) => {
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
    const [list, setList] = React.useState<Image[]>([]);
    const [isFetching, setIsFetching] = React.useState(false);

    const fetchList = async () => {
        setIsFetching(true);
        try {
            setList(await imageList())
        } catch (error) {
            console.error(error)
        } finally {
            setIsFetching(false);

        }
    }

    React.useEffect(() => {
        fetchList()
    }, []);

    return (
        <>
            <button onClick={fetchList}>{isFetching ? "refreshing" : "refresh"}</button>
            <ImageListRender list={list} isFetching={isFetching} />
        </>
    )
}
