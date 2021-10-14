import * as React from "react";
import { ImageList } from './ImageList';
import { dockerService } from '../sdk';

const Home = () => {

    const service = dockerService('http://localhost:5000')

    return (
        <div>
           <ImageList dockerService={service}/>
        </div>
    )
}

export default Home;
