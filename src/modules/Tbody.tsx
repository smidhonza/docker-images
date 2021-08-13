import { ImageReadable } from './interfaces';
import React from 'react';
import Row from './Row';

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

export default Tbody
