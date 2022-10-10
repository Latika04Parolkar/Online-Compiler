const { exec } = require('child_process');
const path = require("path");

const executeCpp = async (filePath, inputPath) => {

    const jobFolder = path.basename(filePath).split(".")[0];
    const dir = path.join(__dirname, `cppCodes/${jobFolder}`);
    const outPath = path.join(dir, `${jobFolder}.out`)

    if (inputPath === undefined) {
        return new Promise((resolve, reject) => {
            exec(
                `g++ ${filePath}  -o ${outPath}  && cd ${dir} && ${jobFolder}.out`,
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
                `g++ ${filePath}  -o ${outPath}  && cd ${dir} && ${jobFolder}.out < ${inputPath}`,
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



// const executeCpp = async (filePath, inputPath) => {
//     const jobId = path.basename(filePath);
//     const jobFolder = path.basename(filePath).split(".")[0];
//     const dir = path.join(__dirname, `cppCodes/${jobFolder}`);
//     const outPath = path.join(dir, `${jobFolder}.out`);

//     if(inputPath === undefined){
//         return new Promise((resolve, reject) => {
//             exec(
//                 `g++ ${filePath}  -o ${outPath}  && cd ${outPath} && ${jobId}.out`,
//                 (error, stdout, stderr) => {
//                     error && reject({ error, stderr });
//                     stderr && reject(stderr);
//                     resolve(stdout)
//                 }
//             );
//         })
//     }else{
//         return new Promise((resolve, reject) => {
//             exec(
//                 `g++ ${filePath}  -o ${outPath}  && cd ${outPath} && ${jobId}.out < ${inputPath}`,
//                 (error, stdout, stderr) => {
//                     error && reject({ error, stderr });
//                     stderr && reject(stderr);
//                     resolve(stdout)
//                 }
//             );
//         })
//     }
// };

module.exports = {
    executeCpp
}