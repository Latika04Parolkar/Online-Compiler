const Queue = require("bull");
const env = require("dotenv");
env.config();
// "rediss://red-cdh1jvqen0hl21kljf10:1bwn5uFr3tdeO7u6gd4FsCI1FUrMYKuQ@singapore-redis.render.com:6379"
const jobQueue = new Queue("job-queue", "redis://red-cdh1jvqen0hl21kljf10:6379");
const NUM_WORKERS = 5;
const Job = require("../db/models/jobModel");
const { executeCpp } = require('../App/c++/executeCpp');
const { executePy } = require('../App/python/executePy');
const { executeJava } = require('../App/java/executeFileJava');
console.log(jobQueue);
jobQueue.process(NUM_WORKERS, async ({ data }) => {
    const { id: jobId } = data;
    const job = await Job.findById(jobId);
    if (job === undefined) {
        throw Error("job not found");
    }

    try {
        job["startedAt"] = new Date();
        if (job.language === 'cpp') {
            output = await executeCpp(job.filePath, job.inputPath);
        } else if (job.language === 'py') {
            output = await executePy(job.filePath, job.inputPath);
        } else {
            output = await executeJava(job.filePath, job.inputPath);
        }
        job["completedAt"] = new Date();
        console.log(job["completedAt"]);
        job["status"] = "success";
        job["output"] = output;
        await job.save();

    } catch (err) {
        job["completedAt"] = new Date();
        console.log("err", err.error);

        if( (err.error.signal === 'SIGTERM') || err.error.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER" )
        {
            job["status"] = "TLE";
            job["output"] = "Process killed, because it ran longer than 10 seconds. Is your code waiting for keyboard input which is not supplied?" + "\n" + err.stdout;
            await job.save();
            throw Error(JSON.stringify(err));
        } else{
            if(job.language === 'cpp'){
                job["output"] = JSON.stringify(err.stderr).replace(/D:\\\\Major\\\\OnlineCompiler\\\\backend\\\\App\\\\c\+\+\\\\cppCodes\\\\/gi, "");
            }
            else if(job.language === 'java'){
                job["output"] = JSON.stringify(err.stderr);
            }
            else{
                job["output"] = JSON.stringify(err.stderr).split(",")[1];
            }
            job["status"] = "error";
            await job.save();
            throw Error(JSON.stringify(err.stderr));
        }
       
    }
    return true;
})

jobQueue.on('failed', (error) => {
    console.log(error.data.id, "failed", error.failedReason);
})

const addJobToQueue = async (jobId) => {
    await jobQueue.add({ id: jobId })
}

module.exports = {
    addJobToQueue
}