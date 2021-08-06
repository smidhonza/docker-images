import * as React from 'react';
import { runScript } from './utils';
import { ImageReadable } from './interfaces';

interface IProps {
    image: ImageReadable;
}



const Tbody = ({ image }: IProps) => {


    return (
        <tbody>
            {image.tags.sort((a, b) => b.created - a.created).map((tag, index) => {
                return (
                    <Row key={`${image.name}-${tag.tag}`} tag={tag} imageName={image.name} tagCount={image.tags.length} index={index} />
                )
            })}
        </tbody>
    )
}

const Row = ({ tag, imageName, index, tagCount }:{ imageName: string, tag: ImageReadable['tags'][0], index: number; tagCount: number }) => {
    const [progress, setProgress] = React.useState<string>(undefined);

    const download = async (tag: string) => {
        setProgress('preparing');
        const filename = [imageName.replace('/','.'), tag].join('.');

        let buff: string[] = [];

        await runScript(`curl --unix-socket /var/run/docker.sock  http://localhost/v1.41/images/${imageName}:${tag}/get | gzip >  ~/Downloads/${filename}.tgz`, true, (progress) => {
            if (progress.startsWith('\r')) {
                buff = [];
            }
            buff.push(progress);
            const clean = buff.join('').split(' ').filter(a => a.trim() !== '')
            const [t1, received, t3, t4, t5, t6, t7, t8,t9, time,t11,t12] = clean;

            if (time && received) {
                const [_, minutes, seconds] = time.split(":");
                setProgress(`${[minutes, seconds].join(":")} ${received}`)
            }

        });

        setProgress(undefined)
    };

    return (
        <tr>
            {index === 0 ?<td rowSpan={tagCount}>{imageName}</td> : null}
            <td>{tag.tag}</td>
            <td>{progress || <button onClick={() => download(tag.tag)}>download .tgz</button>}</td>
            <td style={{ textAlign: 'right' }}>{tag.size}</td>
            <td style={{ textAlign: 'right' }}>{tag.createdReadable}</td>
        </tr>
    )
}

export default Tbody;
