import * as React from 'react';
import Tbody from './Tbody';
import { IDockerService } from '../sdk';
import { either } from 'fputils';
import { ImageReadable } from './interfaces';

export const ImageListRender = ({ isFetching, list }: { list: ImageReadable[]; isFetching: boolean; }) => {
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
            ) : (list.map((image) => (<Tbody key={image.id} image={image}/>))
            )}
        </table>
    );
}

export const ImageList = (props: { dockerService: IDockerService }) => {
    const [list, setList] = React.useState<ImageReadable[]>([]);
    const [error, setError] = React.useState<Error>();
    const [isFetching, setIsFetching] = React.useState(false);

    const fetchList = async () => {
        setIsFetching(true);
        either(setError, setList, await props.dockerService.images())
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
