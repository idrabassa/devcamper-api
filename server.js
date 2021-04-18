const path = require('path')
const express = require("express")
const dotenv = require("dotenv")
const morgan =require('morgan')
const connectDB=require('./config/db')
const colors =require('colors')
const errorHandler=require('./middleware/error')
const fileUpload=require('express-fileupload')
const cookieParser = require('cookie-parser');
// const logger=require('./middleware/logger')


//Load env vars
dotenv.config({path:'./config/config.env'})

//Connect to database
connectDB();

// Routes files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const app = express()

//Body Parser
app.use(express.json())

//middleware
app.use(cookieParser())
// app.use(logger )
//Devlogging middeware 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
//file uploading
app.use(fileUpload())
//set static folder
app.use(express.static(path.join(__dirname,'public')))
// Mount routers
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);
app.use(errorHandler)
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}!`.yellow.bold)
});

//handle and unhandle promise rejections

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error:${err.message}`.red)
    //Close the server & exit proccess
    server.close(()=>process.exit(1))
})