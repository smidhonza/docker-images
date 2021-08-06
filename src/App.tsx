import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Home from './modules/Home';

export const render = () => {
    ReactDOM.render(<Home />, document.getElementById('root'));
}
