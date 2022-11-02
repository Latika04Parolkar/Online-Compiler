const { exec,spawn } = require('child_process');
const path = require("path");
const kill = require("tree-kill");
const {readFileSync} = require("fs");

const executeCpp = async (filePath, inputPath) => {

    const jobFolder = path.basename(filePath).split(".")[0];
    const dir = path.join(__dirname, `cppCodes/${jobFolder}`);
    const outPath = path.join(dir, `${jobFolder}.out`)

    if (inputPath === undefined) {
        return new Promise((resolve, reject) => {
            exec(`g++ ${filePath} -o ${outPath}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    reject(String(error));
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    reject(String(stderr));
                }
                const child = spawn(outPath, [], {
                    timeout: 5 * 1000,
                });

                child.stdout.on('data', data => {
                    console.log('stdout ', data);
                    resolve(String(data));
                });

                child.stderr.on('data', error => {
                    console.log('error ', error);
                    reject(String(error));
                });

                child.on('exit', (code, signal) => {
                    console.log('exit :- ', signal);
                    if (signal === 'SIGTERM') {
                        kill(-child.pid);
                        reject("timed out!")
                    }
                })
            })
        })
    } else {
        return new Promise((resolve, reject) => {
            exec(`g++ ${filePath} -o ${outPath}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    reject(String(error));
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    reject(String(stderr));
                }
                const input = readFileSync(inputPath);
                const child = spawn(outPath, [], {
                    timeout: 5 * 1000,
                });
                child.stdin.write(input);
                child.stdin.end();

                child.stdout.on('data', data => {
                    resolve(String(data));
                });

                child.stderr.on('data', error => {
                    console.log('error ', error);
                    reject(String(error));
                });

                child.on('exit', (code, signal) => {
                    console.log('exit :- ', signal);
                    if (signal === 'SIGTERM') {
                        kill(-child.pid);
                        reject("timed out!")
                    }
                })
            })
        })
    }
};

module.exports = {
    executeCpp
}