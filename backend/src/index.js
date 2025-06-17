import dotenv from "dotenv";
dotenv.config({
    path:"./.env"
})
import connectDB from './db/index.js';
import {app} from "./app.js"

const port = process.env.PORT || 4000

app.get('/',(req,res)=>{
    res.send('hello')
})

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`⚙️ Server is running at port : ${port}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})