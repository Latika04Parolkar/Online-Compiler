const { spawn } = require('child_process');
const kill = require('tree-kill');
const {readFileSync} = require("fs");

const executePy = (filePath, inputPath) => {

    if (inputPath === undefined) {
        return new Promise((resolve, reject) => {
            const child = spawn(`python`, [`${filePath}`], {
                detached: true,
                timeout: 10 * 1000,
            });

            child.stdout.on('data', data => {
                resolve(String(data));
            });

            child.stderr.on('data', error => {
                reject(String(error));
            });

            child.on('exit', (code, signal) => {
                console.log('exit :- ', signal);
                if (signal === 'SIGTERM') {
                    reject (new Error("ustjf"))
                    kill(-child.pid);
                }
            })
        })
    } else {
        return new Promise((resolve, reject) => {
            const input =  readFileSync(inputPath);
            const child = spawn(`python`, [filePath], {
                detached: true,
                timeout: 10 * 1000,
            });
            child.stdin.write(input);
            child.stdin.end();
            child.stdout.on('data', data => {
                resolve(String(data));
            });

            child.stderr.on('data', error => {
                reject(String(error));
            });

            child.on('exit', (code, signal) => {
                console.log('exit :- ', signal);
                if (signal === 'SIGTERM') {
                    kill(-child.pid);
                }
            })
        })
    }
}

module.exports = {
    executePy
}