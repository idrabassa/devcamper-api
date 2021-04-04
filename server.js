const express = require("express")
const dotenv = require("dotenv")
const morgan =require('morgan')
const connectDB=require('./config/db')
const colors =require('colors')
// const logger=require('./middleware/logger')


//Load env vars
dotenv.config({path:'./config/config.env'})

//Connect to database
connectDB();

// Routes files
const bootcamps = require('./routes/bootcamps')

const app =express()

//Body Parser
app.use(express.json())

//middleware
// app.use(logger )
//Devlogging middeware 
if (process.env.NODE_ENV=== 'development') {
    app.use(morgan('dev'))
}
// Mount routers
app.use('/api/v1/bootcamps',bootcamps);

const PORT =process.env.PORT || 5000

const server=app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}!`.yellow.bold)
});

//handle and unhandle promise rejections

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error:${err.message}`.red)
    //Close the server & exit proccess
    server.close(()=>process.exit(1))
})