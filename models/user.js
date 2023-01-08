import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
const {Schema} = mongoose;


const userSchema = new Schema({
    UserId: {
        type: String,
        trim: true,
        required : 'Id is required'
    },
    OrgId: {
        type: String,
        trim: true,
        required : 'Id is required'
    },
    name: {
        type: String,
        trim: true,
        required : 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        required : 'Email is required',
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min : 6,
        max : 64,
    },
    profile_img:
    {
        data: Buffer,
        contentType: String
    },
    Role:
    {
        default: "Admin",
        type: String,
    },
    mobile:
    {
        type: String,
    },
    Address:
    {
        type: String,
    },
    // custCode_prefix: {
    //     type: String,
    //     required: false,
    // },
    // Industry: {
    //     type: String,
    // },
    register_token: {
        type: String,
    },
    active:{
        type: Boolean,
    },
    stripe_account_id:'',
    stripe_seller: {},
    stripeSession: {}
},{ timestamps: true });

userSchema.pre('save', function(next){
    let user = this;

    if(user.isModified('password')){
        return bcrypt.hash(user.password, 12, function(err, hash){
            if(err){
            console.log('BCRYPT HASH ERR ',err);
            return next(err);
            }
            user.password = hash;
            return next();
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function (password, next) {
    bcrypt.compare(password,this.password, function(err, match){
        if(err){
            console.log("COMPARE PASSWORD ERROR", err);
            return next(err, false);
        }
        console.log("MATCH PASSWORD", match);
        return next(null, match); //true
    });
};

export default mongoose.model("User",userSchema);