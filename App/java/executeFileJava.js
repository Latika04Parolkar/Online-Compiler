const { exec, spawn } = require('child_process');
const kill  = require('tree-kill');
const path = require("path");
const {readFileSync} = require("fs");

const executeJava = async (filePath, inputPath) => {
    const jobId = path.basename(filePath);
    const jobFolder = path.basename(filePath).split(".")[0];
    const dirCodes = path.join(__dirname, `javaCodes/${jobFolder}/${jobId}`);

    if (inputPath === undefined) {
        return new Promise((resolve, reject) => {
            const child = spawn('java', [dirCodes], {
                
                timeout: 10 * 1000,
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
                if (signal === 'killed') {
                    kill(-child.pid);
                    reject("timed out!")
                }
            })
        })
    } else {
        return new Promise((resolve, reject) => {
            const input = readFileSync(inputPath);
            const child = spawn('java', [dirCodes], {
                timeout: 10 * 1000,
            });
            child.stdin.write(input);
            child.stdin.end();

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
    }
};

module.exports = {
    executeJava
}