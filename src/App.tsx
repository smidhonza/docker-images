import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ImageList } from './modules/ImageList';

export const render = () => {
    ReactDOM.render(<ImageList />, document.getElementById('root'));
}
