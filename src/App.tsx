import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { spawn } from 'child_process';
import { readableFileSize } from './tools';

interface Image {
    Containers: number; // -1
    Created: number; // 1625761707
    Id: string;
    Labels: { [key: string]: string} | null
    ParentId: string;
    RepoDigests: string[] | null;
    RepoTags: string[];
    SharedSize: number;
    Size: number;
    VirtualSize: number; // 283530681
}

const runScript = (command: string, noOutput: boolean, onError?: (output: string) => void): Promise<string> => new Promise((resolve) => {
    const result: string[] = [];
    const child = spawn(command,{
        shell: true,
    });

    child.on('error', (error) => {
        console.log({
            title: 'Title',
            type: 'warning',
            message: 'Error occured.\r\n' + error
        });
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        if(noOutput === false) {
            result.push(data.toString())
        }
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        onError && onError(data)
    });

    child.on('close', (code) => {
        if (code === 0) {
            resolve(noOutput ? undefined : result.join(''))
        }
    });
})


// GET https://baf4mbp.azurecr.io/acr/v1/_catalog
// GET https://baf4mbp.azurecr.io/acr/v1/account/_tags?orderby=timedesc

const imageList = async (): Promise<Image[]> => {
   const a = await runScript('curl --unix-socket /var/run/docker.sock -H "Content-Type: application/json" http://localhost/v1.41/images/json', false);
    return JSON.parse(a)
};

const Row = ({ image }: { image: Image}) => {
    const [progress, setProgress] = React.useState<string>(undefined);

    const download = async () => {
        setProgress('preparing');
        const filename = image.RepoTags[0].replace('/','.').replace(':','.')

        let buff: string[] = [];

        await runScript(`curl --unix-socket /var/run/docker.sock  http://localhost/v1.41/images/${image.RepoTags[0]}/get --output ~/Downloads/${filename}.tgz`, true, (progress) => {
           if (progress.startsWith('\r')) {
               buff = [];
           }
           buff.push(progress);

           const clean = buff.join('').split(' ').filter(a => a.trim() !== '')
           const [t1, received, t3, t4, t5, t6, t7, t8,t9, time,t11,t12] = clean;

           if (time && received) {
               setProgress(`${time} ${received}`)
           }

        });

        setProgress(undefined)
    };

    const [name, tag] = image.RepoTags[0].split(':')

    return (
        <tr>
            <td>{progress || <button onClick={download}>download .tgz</button>}</td>
            <td>{name}</td>
            <td>{tag}</td>
            <td style={{ textAlign: 'right' }}>{readableFileSize(image.Size)}</td>
            <td>{new Date(image.Created).toISOString()}</td>
        </tr>
    )
}


const Example = () => {
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
        <div>
            <button onClick={fetchList}>{isFetching ? "refreshing" : "refresh"}</button>
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Image</th>
                        <th>Tag</th>
                        <th>Size</th>
                        <th>Created</th>
                    </tr>
                </thead>
                {isFetching ? (
                    <tbody><tr><td colSpan={5}>fetching images</td></tr></tbody>
                ) : (
                    <tbody>
                    {list.map((image) => (<Row key={image.Id} image={image}/>))}
                    </tbody>
                )}
            </table>
        </div>
    )
}


export const render = () => {
    ReactDOM.render(<Example />, document.getElementById('root'));
}
