import { mockedImages } from './mocks';
import { ImageListRender } from '../ImageList';
import * as renderer from 'react-test-renderer';
import * as React from 'react';
import { toReadableImages } from '../tools';

describe('<ImageList />', () => {
    it('renders ok', () => {
        const component = renderer.create(<ImageListRender list={mockedImages} isFetching={false} />);

        expect(component.toJSON()).toEqual(1)
        // expect(component.toJSON()).toMatchSnapshot()
    })

    it ('formats', () => {
        const a = toReadableImages(mockedImages)
        expect(JSON.stringify(a, null, 2)).toEqual('?')
    })
})
