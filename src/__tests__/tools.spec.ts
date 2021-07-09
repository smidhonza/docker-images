import { readableFileSize } from '../tools';

describe('tools', () => {
describe('readableFileSize', () => {
    it('works', () => {
        expect(readableFileSize(0)).toEqual('0.0 B')
        expect(readableFileSize(1024)).toEqual('1.0 KB')
        expect(readableFileSize(1024 + 500)).toEqual('1.5 KB')
        expect(readableFileSize(1024 * 1024)).toEqual('1.0 MB')
        expect(readableFileSize(1024 * 1024 + (600 * 1024))).toEqual('1.6 MB')
        expect(readableFileSize(283530681)).toEqual('270.4 MB')
        expect(readableFileSize(1024 * 1024 * 1024)).toEqual('1.0 GB')
    })
})
})
