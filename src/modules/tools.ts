const get = (size: number, units: string[]): string => {
    const [head, ...rest] = units;
    if (size >= 1024) {
        return get(size / 1024, rest)
    }
    return `${size.toFixed(1)} ${head}`
}

export const readableFileSize = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    return get(size, units);
}


export const pad = (n: number) => (n < 10 ? '0' + n : n);

export const toStringDateTime = (miliseconds: number) => {
    const date = new Date(miliseconds * 1000)
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
};


export const toReadableDate = (datetime: string) => {
    const date = new Date(datetime)
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`

}
