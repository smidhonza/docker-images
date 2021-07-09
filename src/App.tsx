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

const runScript = (command: string): Promise<string> => new Promise((resolve) => {
    let result: any;
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
        //Here is the output
        data=data.toString();
        result = data
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        // Return some data to the renderer process with the mainprocess-response ID
        // mainWindow.webContents.send('mainprocess-response', data);
        //Here is the output from the command
        console.log('stderr', data);
    });

    child.on('close', (code) => {
       console.log('close', code)
        if (code === 0) {
            resolve(result)
        }

    });
})


// GET https://baf4mbp.azurecr.io/acr/v1/_catalog
// GET https://baf4mbp.azurecr.io/acr/v1/account/_tags?orderby=timedesc

const imageList = async (): Promise<Image[]> => {
   const a = await runScript('curl --unix-socket /var/run/docker.sock -H "Content-Type: application/json" http://localhost/v1.41/images/json');

    return JSON.parse(a)
};

const Row = ({ image }: { image: Image}) => {
    const [isDownloading, setIsDownloading] = React.useState(false);


    const download = async () => {
        setIsDownloading(true);
        const filename = image.RepoTags[0].replace('/','.').replace(':','.')
        const command = `docker image save ${image.RepoTags[0]} | gzip > ~/Downloads/${filename}.tgz`

        await runScript(command);
        setIsDownloading(false)
    };

    return (
        <tr>
            <td>{isDownloading ? 'downloading' : <button onClick={download}>download .tgz</button>}</td>
            <td>{image.RepoTags[0]}</td>
            <td>{readableFileSize(image.Size)}</td>
            <td>{image.Created}</td>
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

    if (isFetching) {
        return (<div> fetching images</div>)
    }

    return (
        <div>
            <button onClick={fetchList}>refresh</button>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>repository</th>
                        <th>size</th>
                        <th>created</th>
                    </tr>
                </thead>
                <tbody>
                {list.map((image) => {
                    return (<Row key={image.Id} image={image}/>)
                })}
                </tbody>
            </table>
        </div>
    )
}


export const render = () => {
    ReactDOM.render(<Example />, document.getElementById('root'));
}
