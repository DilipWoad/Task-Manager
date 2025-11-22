//ig this is the first thing the server sees
//so it must connectDb here and all the env are brought here
import "./config.js"
import connectDB from "./configs/DB/index.js";
import { app } from "./app.js";

const port= process.env.PORT ||8089;
console.log(port);

//connect Db
connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`⚙ Server Running... at port :: `,port)
    })
})
.catch((err)=>{
    console.error("Error while connecting to the Server :: ",err)
})