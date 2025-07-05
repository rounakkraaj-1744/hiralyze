import express from "express"
import dotenv from "dotenv"
import cors from "cors"

const app = express()
const port = process.env.PORT || 8080

dotenv.config()
app.use (cors())

app.get ("/", (req, res)=>{
    res.send ("Server started!")
})

app.listen (port, ()=>{
    console.log (`Server started at http://localhost:${port}`)
})