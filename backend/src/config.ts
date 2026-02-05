import dotenv from "dotenv"

dotenv.config({
    path: '.env'
})


const _MONGO_URI=process.env.MONGODB_URI;
//VALIDATE IT HERE
if(!_MONGO_URI){
    throw new Error("FATAL ERROR: MONGODB_URI is not defined in the .env file")
}

export const MONGO_URI=_MONGO_URI