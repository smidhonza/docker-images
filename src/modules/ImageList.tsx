import * as React from 'react';
import { toReadableImages } from './tools';
import Docker from 'dockerode';
import Tbody from './Tbody';

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
            ) : (toReadableImages(list).map((image) => (<Tbody key={image.id} image={image}/>))
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
