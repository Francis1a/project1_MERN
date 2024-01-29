const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})

//static signup model 
userSchema.statics.signup = async function(email, password) {
    
    //validation
    if(!email || !password){
        throw Error('All fields must be filled')
    }
    
    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }

    if(!validator.isStrongPassword(password)){
        throw Error('Password is Weak')
    }
    //End of Validation

    //check if Email is already exist
    const exists = await this.findOne({ email })
    if (exists){
        throw Error('Email already in use')
    }

    
    
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    //convert password to hash
    const user = await this.create({ email, password: hash })

    return user 
}

//static login model 
userSchema.statics.login = async function(email, password){
    
    //validation
    if(!email || !password){
        throw Error('All fields must be filled')
    }

    //check if Userr is exist
    const user = await this.findOne({ email })
    if (!user){
        throw Error('Email does not exist')
    }

    //check if password matches
    // const userPass = await this.findOne({ email })
    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error('Incorrect Password')
    }

    return user

}


module.exports = mongoose.model('User', userSchema)