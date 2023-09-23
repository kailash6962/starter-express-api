import express from "express";
import {readdirSync} from 'fs';
import cors from 'cors';//cross origin auth
const morgan = require("morgan"); //server logs
import mongoose from 'mongoose';//mongodb

require("dotenv").config(); //for env
try{
  
const app = express();
const corsOptions = {
    origin: '*',//[APP_URL_DEV, process.env.APP_URL_PROD],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable credentials (cookies, authorization headers)
    optionsSuccessStatus: 204, // Set the preflight response status to 204
};
//db connection
mongoose.connect(process.env.DEV_DATABASE)
.then(() => console.log('DB Connected'))
.catch((err) => console.log('DB Connection Error: ', err));
console.log('Initiating Routes');

//middleware
app.use(cors(corsOptions));
app.use(morgan("prod"));
// app.use(express.json());
app.use(express.raw());

//route middleware
readdirSync('./routes').map((r) => 
    app.use('/api', require(`./routes/${r}`))
);

const port = process.env.PORT || 8000;
app.listen(port, ()=> console.log(`Server is running on http://localhost:${port}/`));
console.log('*** Server is ready to Use ***');
} catch (error) {
    console.log(error);
}
