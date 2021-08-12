import { spawn } from 'child_process';
import { Left, Maybe, Right } from 'fputils';

/**
 *
 * @deprecated
 */
export const runScript = (command: string, noOutput: boolean, onError?: (output: string) => void): Promise<Maybe<string>> => new Promise((resolve) => {
    const result: string[] = [];
    const child = spawn(command,{
        shell: true,
        stdio: 'inherit'
    });

    child.on('error', (error) => {
        console.log({
            title: 'Title',
            type: 'warning',
            message: 'Error occured.\r\n' + error
        });
    });

    child?.stdout?.setEncoding('utf8');
    child?.stdout?.on('data', (data) => {
        console.log('stdout on data', data)
        if(!noOutput) {
            result.push(data.toString())
        }
    });

    child?.stdout?.on('error',function(error){
        console.log('stdout error', error);
        resolve(Left(error))
    });

    child?.stderr?.setEncoding('utf8');
    child?.stderr?.on('data', (data) => {
        console.log('stderr on data', data);

        onError && onError(data)
    });

    child?.stderr?.on('error',function(error){
        console.log('stderr error', error);
    });

    child?.on('close', (code) => {
        console.log('on close', code);

        if (code === 0) {
            resolve(Right(noOutput ? undefined : result.join('')))
        }

        resolve(Left(new Error(`Unexpected close event with code: ${code}`)))

    });
})
