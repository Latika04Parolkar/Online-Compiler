const { exec } = require('child_process');
const path = require("path");

const executeJava = async (filePath, inputPath) => {
    const jobId = path.basename(filePath);
    const jobFolder = path.basename(filePath).split(".")[0];
    const dir = path.join(__dirname, `javaCodes/${jobFolder}`);

    if (inputPath === undefined) {
        return new Promise((resolve, reject) => {
            exec(
                `cd ${dir} && javac ${jobId} && java Compiler`,
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
    } else {
        return new Promise((resolve, reject) => {
            exec(
                `cd ${dir} && javac ${jobId} && java Compiler < ${inputPath}`,
                {
                    maxBuffer: 1024 * 5000,
                    timeout: 10 * 1000
                },
                (error, stdout, stderr) => {
                    error && reject({ error, stderr, stdout });
                    stderr && reject(stderr);
                    resolve(stdout)
                },
            );
        })
    }
};

module.exports = {
    executeJava
}