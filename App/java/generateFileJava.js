const fs = require('fs');
const path = require("path");
const { v4: uuid } = require('uuid');

const generateFileJava = async (format, code, input) => {
    const jobId = uuid();
    const dir = path.join(__dirname, `javaCodes/${jobId}`);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const fileName = `${jobId}.${format}`;
    const filePath = path.join(dir, fileName);
    if (input !== undefined && input !== '') {
        const inputFileName = `${jobId}.txt`;
        const inputPath = path.join(dir, inputFileName);
        await fs.writeFileSync(filePath, code);
        await fs.writeFileSync(inputPath, input);
        return { filePath, inputPath };
    } else {
        await fs.writeFileSync(filePath, code);
        return {filePath , inputPath : undefined};
    }
}

module.exports = {
    generateFileJava
};