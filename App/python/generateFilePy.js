const fs = require('fs');
const path = require("path");
const { v4: uuid } = require('uuid');


const generateFilePy = async (format, code, input) => {
    const jobId = uuid();
    const dirCodes = path.join(__dirname, `pyCodes/${jobId}`);

    if (!fs.existsSync(dirCodes)) {
        fs.mkdirSync(dirCodes, { recursive: true });
    }

    const fileName = `${jobId}.${format}`;
    const filePath = path.join(dirCodes, fileName);
    if (input !== undefined && input !== '') {
        const inputFileName = `${jobId}.txt`;
        const inputPath = path.join(dirCodes, inputFileName);
        await fs.writeFileSync(filePath, code);
        await fs.writeFileSync(inputPath, input);
        return { filePath, inputPath };
    } else {
        await fs.writeFileSync(filePath, code);
        return {filePath , inputPath : undefined};
    }
}

module.exports = {
    generateFilePy
};