class ApiError extends Error{
    statusCode:number;
    errors:any[];
    data:null;
    success:boolean

    constructor(
        statusCode:number,
        message:string="Something went Wrong!!",
        errors:any[]=[],
        stack:string=""
    ){
        //this is set by the Error class
        super(message);
        //this are set by the user;
        this.statusCode=statusCode;
        this.message=message;
        this.errors=errors;
        //this are set by default
        this.data =null;
        this.success=false;


        if(stack){
            this.stack =stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError};