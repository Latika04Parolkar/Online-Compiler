const { exec } = require('child_process');

const executePy = (filePath, inputPath) => {

    if (inputPath === undefined) {
        return new Promise((resolve, reject) => {
            exec(
                `python ${filePath}`,
                {
                    maxBuffer: 1024 * 10000,
                    timeout: 2 * 1000,
                    killSignal: "SIGKILL"
                },
                (error, stdout, stderr) => {
                    error && reject({ error, stderr, stdout });
                    stderr && reject(stderr);
                    resolve(stdout)
                }
            );
        })
    } else {
        return new Promise((resolve, reject) => {
            exec(
                `python ${filePath} < ${inputPath}`,
                {
                    maxBuffer: 1024 * 10000,
                    timeout: 10 * 1000
                },
                (error, stdout, stderr) => {
                    error && reject({ error, stderr, stdout });
                    stderr && reject(stderr);
                    resolve(stdout)
                }
            );
        })
    }
};

module.exports = {
    executePy
}