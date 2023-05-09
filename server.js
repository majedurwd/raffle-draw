const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

app.use([morgan("dev"), cors(), express.json()])

app.get("/health", (_req, res) => {
    res.status(200).json({message: "OK"})
})

app.use((_req, _res, next) => {
    const error = new Error("Resource not found!")
    error.status = 404
    next()
})

app.use((err, _req, res, _next) => {
    if (err.status) {
        return res.status(err.status).json({
            msg: err.message
        })
    }
})


const port = process.env.PORT || 9000
app.listen(port, () => {
    console.log(`Server is running in http://localhost:${port}`);
})

