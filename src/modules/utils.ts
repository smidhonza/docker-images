import { spawn } from 'child_process';

export const runScript = (command: string, noOutput: boolean, onError?: (output: string) => void): Promise<string> => new Promise((resolve) => {
    const result: string[] = [];
    const child = spawn(command,{
        shell: true,
    });

    child.on('error', (error) => {
        console.log({
            title: 'Title',
            type: 'warning',
            message: 'Error occured.\r\n' + error
        });
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        if(noOutput === false) {
            result.push(data.toString())
        }
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        onError && onError(data)
    });

    child.on('close', (code) => {
        if (code === 0) {
            resolve(noOutput ? undefined : result.join(''))
        }
    });
})
