const { program } = require("commander");
import { validateConfig,parseYAMLConfig } from './config'
import { createServer } from './server'
import os from 'os'
async function main(){
    program
  .option('--config <path>', 'path to config file')


program.parse();

const options = program.opts();
const path = program.args[0];
// console.log("path:",options);

if( options && 'config' in options ){
    const config = await parseYAMLConfig(options.config);
    const validatedConfig = await validateConfig(config);
    // console.log("validatedConfig:",validatedConfig);
    createServer({
      port: validatedConfig.server.listen,
      workerCount: validatedConfig.server.workers || os .cpus().length,
      config: validatedConfig,
    });
}
}

main()