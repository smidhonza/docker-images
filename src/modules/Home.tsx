import * as React from "react";
import { ImageList } from './ImageList';
import Azure from './Azure';

const Home = () => {
    const [nav, setNav] = React.useState<'home' | 'azure'>('home');

    return (
        <div>
            <div>
                <button onClick={() => setNav('home')}>Local</button>
                <button onClick={() => setNav('azure')}>Azure</button>
            </div>
            {nav === 'home' ? <ImageList /> : null}
            {nav === 'azure' ? <Azure /> : null}

        </div>
    )
}

export default Home;
