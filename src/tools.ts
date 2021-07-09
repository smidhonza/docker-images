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
