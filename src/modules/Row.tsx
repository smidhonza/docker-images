import React from 'react';
import fs from "fs";
import zlib from 'zlib';
import os from 'os';
import { ImageReadable } from './interfaces';
import Docker from 'dockerode';
import { readableFileSize } from './tools';

const Row = ({ tag, imageName, index, tagCount }:{ imageName: string, tag: ImageReadable['tags'][0], index: number; tagCount: number }) => {
    const [progress, setProgress] = React.useState<string>(undefined);

    const download = async (imageTag: string) => {
        setProgress('preparing');
        const filename = [imageName.replace('/','.'), imageTag, 'tgz'].join('.');


        const docker = new Docker();
        const image = docker.getImage(`${imageName}:${imageTag}`)
        image.get((error, stream) => {
            let counter = 0
            stream.on('data', (chunk) => {
                counter = counter + chunk.length

                const percentage = counter / tag.size * 100
                setProgress(percentage > 100 ? 'finishing' : `${readableFileSize(counter)} (${Math.round(percentage)}%)`)
            });

            const homedir = os.homedir();

            const writable=fs.createWriteStream(`${homedir}/Downloads/${filename}`);
            const gzip = zlib.createGzip();
            writable.on('error', (e: any) => { console.error(e); });

            stream.pipe(gzip).pipe(writable);

            stream.on('end',()=>{
                console.log('done')
                setProgress(undefined)
            });

        })
    };

    return (
        <tr>
            {index === 0 ?<td rowSpan={tagCount}>{imageName}</td> : null}
            <td>{tag.tag}</td>
            <td>{progress || <button onClick={() => download(tag.tag)}>download .tgz</button>}</td>
            <td style={{ textAlign: 'right' }}>{tag.sizeReadable}</td>
            <td style={{ textAlign: 'right' }}>{tag.createdReadable}</td>
        </tr>
    )
}

export default Row;
