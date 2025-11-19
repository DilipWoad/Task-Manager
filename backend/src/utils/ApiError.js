class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went Wrong!!",
        errors=[],
        stack=''
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

    }
}

export {ApiError};