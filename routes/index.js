const express = require("express");
const router = new express.Router();
const app = express();
app.use(router);

const Job = require("../db/models/jobModel");
const { generateFileCpp } = require('../App/c++/generateFileCpp');
const { generateFilePy } = require('../App/python/generateFilePy');
const { generateFileJava } = require('../App/java/generateFileJava');
const { addJobToQueue } = require("./jobQueue");

router.get('/status', async (req, res) => {
    const jobId = req.query.id;

    if (jobId === undefined || jobId === '') {
        return res.status(400).json({ success: false, error: "Missing ID query param!" })
    }

    try {
        const job = await Job.findById(jobId);
        if (job === undefined) {
            return res.status(400).json({
                success: false,
                error: "invalid job id"
            })
        }
        return res.status(200).json({ success: true, job });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: JSON.stringify(error)
        })
    }

});

router.post('/run', async (req, res) => {
    const { language = "cpp", code, input } = req.body;
    if (code === '' || code === undefined) {
        return res.status(400).json({
            success: false,
            error: "Empty code body!"
        })
    }

    let job;
    let obj;
    try {
        // need to generate a c++ file with content from the request
        if(language === 'cpp'){
            obj = await generateFileCpp(language, code, input);
        } else if(language === 'py'){
            obj = await generateFilePy(language, code, input);
        }else{
            obj = await generateFileJava(language, code, input);
        }

        // we need to run the file and send the response
        const { filePath, inputPath } = obj;
        job = await new Job({ language, filePath, inputPath, code }).save();
        const jobId = job["_id"];
        addJobToQueue(jobId);
        res.status(201).json({ success: true, jobId })

    } catch (error) {
        return res.status(500).json({
            success: false,
            err: JSON.stringify(error)
        })
    }
});

module.exports = router;