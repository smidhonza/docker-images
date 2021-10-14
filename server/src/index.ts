import { server } from './server';


const main = async () => {
    await server().listen(5000)

}

main();
