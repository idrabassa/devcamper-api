const fs =require('fs')
const mongoose =require('mongoose')
const colors=require('colors')
const dotenv = require('dotenv')

//load env vars
dotenv.config({path:'./config/config.env'})

//Load models

const Bootcamp =require('./modules/Bootcamp')

//connect to db

const conn =mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
})

//read the JSON files
const bootcamps =JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))

//import into DB

const importData = async ()=>{
    try {
        await Bootcamp.create(bootcamps)
        console.log('Data imported ...'.green.inverse);
        process.exit()
    } catch (error) {
        console.error(error)
    }
}