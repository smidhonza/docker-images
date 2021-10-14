export interface ImageReadable {
    id: string;
    name: string;
    tags: {
        tag: string;
        size: number;
        sizeReadable: string;
        created: number;
        createdReadable: string
    }[];
}
