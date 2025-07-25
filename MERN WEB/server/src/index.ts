import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { connectDB } from './db/mongo';
import rootRouter from './routes';
import { errorHandler } from './middlewares/errorHandler';


dotenv.config();
const app =express()

const corsOptions={
    origin: process.env.CLIENT_ORIGIN ,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
}



app.use(cors(corsOptions))
app.use(express.json()) 
app.use(cookieParser())

const PORT = process.env.PORT

app.use("/api",rootRouter)
app.use(errorHandler)


// app.get('/',(req,res)=>{
//     res.send('Hello World kaif!')
// })


connectDB().then(()=>{

    app.listen(PORT, ()=>{
        console.log(`Server running on http://localhost:${PORT}`)
    })

})