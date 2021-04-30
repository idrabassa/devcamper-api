const fs =require('fs')
const mongoose =require('mongoose')
const colors=require('colors')
const dotenv = require('dotenv')

//load env vars
dotenv.config({path:'./config/config.env'})

//Load models

const Bootcamp =require('./modules/Bootcamp')
const Course =require('./modules/Course')
const User =require('./modules/User')
const Review =require('./modules/Review')
//connect to db

const conn = mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
})

//read the JSON files
const bootcamps =JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
const courses =JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))
const users =JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'))
const reviews =JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8'))



//import into DB

const importData = async ()=>{
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users)
        await Review.create(reviews)
        console.log('Data imported ...'.green.inverse);
        process.exit()
    } catch (error) {
        console.error(error )
    }
}

const deleteData = async ()=>{
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('Data destroyed ...'.red.inverse);
        process.exit()
    } catch (error) {
        console.error(error )
    }
}

if(process.argv[2]==='-i'){
    importData()
}else if (process.argv[2]==='-d') {
    deleteData()
    
}