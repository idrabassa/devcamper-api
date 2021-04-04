const mongoose=require('mongoose')

const BootcampSchema =new mongoose.Schema({
    name: {
        type: String,
        require:[true,'Please add a name'],
        unique:true,
        trim:true,
        maxlenght:[50,'Name cannot be more than 50 characters']
    },

    slug: String,

    descrition:{
        type:String,
        required:[true,'Please add a description'],
        maxlenght:[500,'Description cannot be more than 500  characters']
    },

    // website:{
    //    match:[
    //         /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    //         'Please enter a value URL with http or https'
    //     ]
    // },

    phone:{
        type:String,
        maxlenght:[20,'Phone number cannot be more than 500  characters']
    },
    
    email:{
        type:String,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter the valid email'
        ]
    },

    location:{
        //GeoJSON Point
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true,
            index:'2dsphere'
          },
          formattedAddress:String,
          street:String,
          city:String,
          state:String,
          zipcode:String,
          country:String

    },

    careers:{
        type:[String],
        required:true,
        enum:[
            'Web devolopment',
            'Mobile devolopment',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },

    averageRating:{
        type:Number,
        min:[1,'Rating must be at least 1'],
        max:[10,'Rating must cannot be more than 10']
    },

    averageCost: Number,

    photo:{
        type:String,
        default:'no-photo.jpg'
    },

    housing:{
        type:Boolean,
        default:false
    },
    jobGuarantee:{
        type:Boolean,
        default:false
    },
    jobAssitance:{
        type:Boolean,
        default:false
    },
    acceptGi:{
        type:Boolean,
        default:false
    },

    createdAt:{
        type:Date,
        default:Date.now
    },
    
})

module.exports = mongoose.model('Bootcamp',BootcampSchema)