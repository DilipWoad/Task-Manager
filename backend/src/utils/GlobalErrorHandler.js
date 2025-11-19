export const GlobalErrorHandler=(err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    //so this will return a response to gracefully handle the error/creahsed
    return res.status(statusCode).json({
        success : statusCode<400,
        message : err.message || "Internal Server Error.",
        errors : err.errors || [],
        data : err.data || null,
    })
}
