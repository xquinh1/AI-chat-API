const errorHandle = (err, req, res, next) => {
    console.error(err)

    res.status(err.statusCode || 500).json({
        error: {
            code: err.code || "INTERNAL_ERROR",
            message: err.message || "Unexpected error"
        }
    })
}

export default errorHandle