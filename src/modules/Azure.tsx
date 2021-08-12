import * as React from "react";
import { runScript } from './utils';
import { toReadableDate } from './tools';
import { isLeft } from 'fputils';

interface IDetail {
    changeableAttributes:{
        deleteEnabled: boolean;
        listEnabled: boolean;
        readEnabled: boolean;
        writeEnabled: boolean;
    },
    createdTime:"2021-07-02T13:22:28.6131175Z";
    "digest": string;
    "lastUpdateTime":"2021-07-02T13:22:28.6131175Z";
    "name": string;
    "signed": boolean;
}

const registry = 'baf4mbp';

const AzureTags = (props: { repository: string}) => {
    const [detail, setDetail] = React.useState<IDetail[]>([]);
    const [isFetching, setIsFetching] = React.useState(false);

    const fetchDetail = async () => {
        setIsFetching(true);
            const data = await runScript(`az acr repository show-tags -n ${registry} --repository ${props.repository} --detail --orderby time_desc`, false);
            if (isLeft(data)) {
                console.error(data.value)
            } else {
                setDetail(JSON.parse(data.value))
            }

            setIsFetching(false);
    }


    React.useEffect(() => {
        fetchDetail()
    }, [])


    if (isFetching) {
        return (<tbody><tr><td colSpan={3}>fetching</td></tr></tbody>)

    }
    return (
        <tbody>{detail.map((r, index) => (
            <tr key={`${props.repository}-${r.name}`}>
                {index === 0 && <td rowSpan={detail.length}>{props.repository}</td>}
                <td style={{ textAlign: 'right' }}>{r.name}</td>
                <td style={{ textAlign: 'right' }}>{toReadableDate(r.createdTime)}</td>
            </tr>
        ))}
        </tbody>
    )
}

const Azure = () => {
    const [list, setList] = React.useState<string[]>([]);
    const [isFetching, setIsFetching] = React.useState(true);

    const fetchList = async () => {
        setIsFetching(true);

            const data = await runScript(`az acr repository list -n ${registry}`, false);
            if (isLeft(data)) {
                console.error(data.value)
            } else {
                setList(JSON.parse(data.value))
            }

            setIsFetching(false);
    }


    React.useEffect(() => {
        fetchList()
    }, [])


    return (
        <div>
            <button onClick={fetchList}>{isFetching ? "refreshing" : "refresh"}</button>
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Tag</th>
                        <th>Created</th>
                    </tr>
                </thead>
            {!isFetching && list.map((repository) => (<AzureTags key={repository} repository={repository} />))}
            </table>
        </div>
    )
}

export default Azure;
