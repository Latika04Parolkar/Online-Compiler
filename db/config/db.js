const mongoose = require("mongoose");
const env = require("dotenv");
env.config();

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Succesfully connected to mongodb database!");
})