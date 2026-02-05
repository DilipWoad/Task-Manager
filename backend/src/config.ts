import dotenv from "dotenv"

dotenv.config({
    path: '.env'
})

//Import env here
const _MONGO_URI=process.env.MONGODB_URI;
const _CROSS_ORIGIN=process.env.CROSS_ORIGIN;

//VALIDATE IT HERE
if(!_MONGO_URI){
    throw new Error("FATAL ERROR : MONGODB_URI is not defined in the .env file")
}
if(!_CROSS_ORIGIN){
    throw new Error("ORIGIN ERROR : CROSS_ORIGIN is not defined in the .env file")
}


export const MONGO_URI=_MONGO_URI
export const CROSS_ORIGIN=_CROSS_ORIGIN