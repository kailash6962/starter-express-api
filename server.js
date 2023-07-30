import express from "express";
import {readdirSync} from 'fs';
import cors from 'cors';//cross origin auth
const morgan = require("morgan"); //server logs
import mongoose from 'mongoose';//mongodb

require("dotenv").config(); //for env
try{
  
const app = express();

//db connection
mongoose.connect(process.env.DEV_DATABASE)
.then(() => console.log('DB Connected'))
.catch((err) => console.log('DB Connection Error: ', err));
console.log('Initiating Routes');

//middleware
app.use(cors());
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
