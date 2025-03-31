// Another way to import dotenv
// require('dotenv').config({path: './env'});

import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port: ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.log(`Mongo DB connection failed due to, `, error);
});

// Another method to connect and listen at port

/*
const app = express();

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        app.on("Error", (error) => {
            console.log("Error:", error);
            throw error;
        });

        app.listen(process.env.PORT, () => {
            console.log(`The app is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
})();

*/