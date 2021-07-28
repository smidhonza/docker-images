export interface Image {
    Containers: number; // -1
    Created: number; // 1625761707
    Id: string;
    Labels: { [key: string]: string} | null
    ParentId: string;
    RepoDigests: string[] | null;
    RepoTags: string[];
    SharedSize: number;
    Size: number;
    VirtualSize: number; // 283530681
}



export interface ImageReadable {
    id: string;
    name: string;
    tags: {
        tag: string;
        size: string;
        created: number;
        createdReadable: string
    }[];
}
