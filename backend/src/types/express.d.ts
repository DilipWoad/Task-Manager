import { IUserDocument } from "../models/users.model.ts";

declare global{
    namespace Express{
        interface Request{
            user?:IUserDocument
        }
    }
}