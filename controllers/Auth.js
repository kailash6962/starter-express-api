import User from '../models/user';
import Role from '../models/Role';

import Organization from '../models/Organization';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

//IMPORT NODEMAILER
var nodemailer = require('nodemailer');


export const register = async (req,res) => {
    const { name, email, password, custCode_prefix, profile_img } = req.fields;
    let token = Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2);

    sendVerificationEmail(req.get('host'),email,token,name);

    //validation
    if(!name) return res.status(400).send('Name is required');
    if(!password || password.length < 6)
        return res
        .status(400)
        .send('Password is required and should be min 6 character long');

        let userExist = await User.findOne({email}).exec();

        if(userExist) return res.status(400).send('Email is taken');
        const Orgid = await generateOrgId();
        var NewUserid = await generateUserId();
        let object = {
            UserId: NewUserid,
            OrgId: Orgid,
            name:name,
            email:email,
            password:password,
            custCode_prefix:custCode_prefix,
            profile_img:profile_img,
            register_token:token,
            active:0,
        }
        let orgobject = {
            OrgId: Orgid,
            name:name,
            email:email,
            custCode_prefix:custCode_prefix,
            profile_img:profile_img,
            active:1,
        }
        let role = new Role({
            RoleName:'Admin',
            Description:'Manage All Pages',
            UserId:NewUserid,
            OrgId:Orgid,
            ReadOnly:true,
            AccessLinks:(['CustomerUpdate', 'CustomerDelete', 'ProductList', 'ProductCreate', 'ProductUpdate', 'ProductDelete', 'InvoiceList', 'InvoiceUpdate', 'InvoiceDelete', 'ExpenseList', 'ExpenseCreate', 'StaffCreate', 'StaffList', 'ExpenseUpdate', 'StaffUpdate', 'StaffDelete', 'ExpenseDelete', 'UserRolesUpdate', 'UserRolesCreate', 'OrganizationUpdate', 'AccountUpdate', 'UserRolesDelete', 'InvoiceCreate', 'ReportCreate', 'Report_CustomerBalances', 'UserRolesList', 'AccountView', 'OrganizationView', 'CustomerCreate', 'CustomerList'])
          });

        const user = new User(object);
        const org = new Organization(orgobject);

        try{
            await user.save();
            await org.save();
            await role.save();
            console.log('USER CREATED ',user.email,name);
    //send mail using nodemailer

    sendVerificationEmail(req.get('host'),email,token,name);
    //send mail using nodemailer
            return res.json({ ok: true });
        } catch (err) {
            console.log('CREATE USER FAILED ',err)
            return res.status(400).send('Error. '+err);
        }
};

//SEND MAIL ACTIVATION LINK
export const sendVerificationEmail = (host,email,token,name) => {
    
    if(host=='localhost:'+process.env.PORT){
        var hosturi = 'http://localhost:'+process.env.PORT+'/api';
        }
        else{
            var hosturi = process.env.SERVER_URL_PROD;
        }
        var verify_url = hosturi+'/verifyemail?email='+email+'&token='+token
        console.log(token);//localhost:8000
        var transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE, // upgrade later with STARTTLS
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
        
        var mailOptions = {
            from: {
                name:'InvoiceApp',
                address:process.env.EMAIL_USERNAME
            },
            to: email,
            subject: 'Email Verification for KailashInvoiceApp',
            html: `<h4>Hi ${name},</h4>
            <p>Please verify your email for create account on InvoiceAppDemo</p> 
            <br><a href='${verify_url}' style='
                background-color: #4286f5;
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
              '>
              Click here to Verify Email
              </a>`
        };
    
        transport.sendMail(mailOptions, function(error, info){
            if(error) {
                console.log(error);
                return false;
            } else {
                console.log('Email sent: '+info.response);
                return true;
            }
        });
    
}

//SEND OTP MAIL FORGOT PASSWORD LINK
const sendOtpEmail = (email,name,otp) => {
    
        var transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE, // upgrade later with STARTTLS
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
        
        var mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'OTP for InvoiceApp',
            html: `<h4>Dear ${name},</h4>
            <p>Your OTP for change Password is <b style='color:#1890ff'>${otp}</b></p> <br>
            <p>In case you have not initiated this transaction or face any concerns, please reach out to us at <a>support@kailashinvoice.com</a></p>
            `
        };
    
        transport.sendMail(mailOptions, function(error, info){
            if(error) {
                console.log(error);
                return false;
            } else {
                console.log('Email sent: '+info.response);
                return true;
            }
        });
    
}

//SEND VERIFICATION EMAIL
export const sendverifyemail = async (req,res) => {
    console.log(req.body.email);
    let users = await User.findOne({email:req.body.email,active:0}).exec();
    console.log('users',users);

    if(users)
    {
    var mailstatus = sendVerificationEmail(req.get('host'),req.body.email,users.register_token,users.name);
    res.status(200).send('Email Sent Successfully');
    }
    else{
        res.status(400).send('Entered Email Not Found');
    }
    
}

//CREATING USER ID
export const generateUserId = async () => {
    let users = await User.find().sort({UserId:-1}).limit(1).exec();//LAST CUSTCODE
    let USERID_PREFIX = 'USER';
     if(users.length>0){
        var code = (String(parseInt(users[0].UserId.match(/(\d+)/)[0])+1).padStart(6, '0'));//NEW CUSTCODE
       }
       else{
        var code = (String(1).padStart(6, '0'));//NEW CUSTCODE
       }
       let generateduserid = USERID_PREFIX+code;//NEW CUSTCODE
    return generateduserid;
}

//CREATING NEW TOKEN
export const resetPassword = async (req,res) => {
    let users = await User.find().sort({UserId:-1}).limit(1).exec();//LAST CUSTCODE
    let USERID_PREFIX = 'USER';
     if(users.length>0){
        var code = (String(parseInt(users[0].UserId.match(/(\d+)/)[0])+1).padStart(6, '0'));//NEW CUSTCODE
       }
       else{
        var code = (String(1).padStart(6, '0'));//NEW CUSTCODE
       }
       let generateduserid = USERID_PREFIX+code;//NEW CUSTCODE
    return generateduserid;
}

//CREATING ORGANIZATION ID
const generateOrgId = async () => {
    let users = await User.find().sort({OrgId:-1}).limit(1).exec();//LAST CUSTCODE
    let USERID_PREFIX = 'ORGN';
     if(users.length>0){
        var code = (String(parseInt(users[0].OrgId.match(/(\d+)/)[0])+1).padStart(7, '0'));//NEW CUSTCODE
       }
       else{
        var code = (String(1).padStart(7, '0'));//NEW CUSTCODE
       }
       let generatedorgnid = USERID_PREFIX+code;//NEW CUSTCODE
    return generatedorgnid;
}

export const login = async (req,res) => {
    
    const {email, password} = req.fields;
    try{
        let user = await User.findOne({ email }).exec();

        //console.log('LOGIN SUCCESS ',user);
        if(!user) return res.status(400).send('User Email Not Found');//check email found
        if(user.active)
        {
        user.comparePassword(password, (err, match) => {
            console.log('Compare password error',err);
            if(!match || err) return res.status(400).send("Wrong password");
            //console.log("Generate a token then send as response to client");
            let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });

            res.json({token, user:{
                _id : user._id,
                UserId : user.UserId,
                OrgId : user.OrgId,
                name : user.name,
                email : user.email,
                createdAt: user.createdAt,
                updatedAt :user.updatedAt
            } });

        });
        }
        else{
            res.status(400).send('Email Not Verified');
        }
        //res.send('user controller');
    } catch (err) {
        console.log('LOGIN FAILED ',err)
        return res.status(400).send('Login Failed. '+err);
    }
};

//VERIFY EMAIL
export const verifyemail = async (req,res) => {
    console.log(req.query);
    //res.status(200).send(req.fields);
    const {email, token} = req.query;
    try{
        let user = await User.findOne({ email,register_token:token,active:0 }).exec();
        if(req.get('host')=='localhost:'+process.env.PORT){
            var redirecturl = process.env.APP_URL_DEV;
            }
            else{
            var redirecturl = process.env.APP_URL_PROD;
            }
        //console.log('LOGIN SUCCESS ',user);
        if(!user) return res.status(400).send('<h4>Email Not verified!!</h4><p>Reason : Token is not valid</h4>');//check email found
        
        if(user){
            await User.updateOne({
                email:email,
                register_token:token
                },{active:1});

                res.status(200).send(`<h3 style="color:green">Email verifed Successfully ✔..</h3> <a href="${redirecturl}">Click here to redirect to login page</a>`);
        }
                
        //res.send('user controller');
    } catch (err) {
        console.log('LOGIN FAILED ',err)
        return res.status(400).send('Login Failed. '+err);
    }
};

//SEND OTP EMAIL
export const sendotpmail = async (req,res) => {
    console.log('body',req.fields);
   
     const {otp, email} = req.fields;
    try{
        let user = await User.findOne({ email:email }).exec();
        
        if(!user) return res.status(400).send('Entered email is not registered');//check email found
        
        if(user){
            await sendOtpEmail(user.email,user.name,otp);
            let token = btoa(otp);

            await User.updateOne({
                email:email,
                },{register_token:token});
                
            console.log('token',otp);
          
            res.status(200).send('Success');
        }
                
        //res.send('user controller');
    } catch (err) {
        console.log('OTP sending failed',err)
        return res.status(400).send('Failed to Send OTP. '+err);
    }
};

//UPDATE PASSWORD
export const updatepassword = async (req,res) => {
    console.log('body',req.fields);
   
     const {otp, email, password} = req.fields;
    try{
        let user = await User.findOne({ email:email,register_token:btoa(otp) }).exec();
       
        if(!user) return res.status(400).send('Invalid Request');//check email found
        
        if(user){
            const newpwd = await bcrypt.hash(password,12);
            await User.updateOne({
                email:email,
                },{password:newpwd});
                
            console.log('token',otp);
          
            res.status(200).send('Password Updated Successfully');
        }
                
        //res.send('user controller');
    } catch (err) {
        console.log('Failed to Update password',err)
        return res.status(400).send('Failed to Update password. '+err);
    }
};
//PERMISSION LINKS
export const getuseraccesslinks = async (req,res) => {
    console.log('query',req.query);
    let user = await User.findOne({ UserId:req.query.UserId }).exec();
    if(user){
        let userRole = await Role.findOne({ OrgId:user.OrgId,RoleName:user.Role }).exec();
        res.status(200).send(userRole.AccessLinks);
    }
}
//PERMISSION LINKS
export async function getUserDataByToken(req){
    var token = req.headers['authorization'];
    token = token.substring(7);
    const verify = await jwt.verify(token,process.env.JWT_SECRET);
        var userData = await User.findById(verify._id,
          {
            "profile_img":0,
            "password":0,
            "register_token":0
          });
    return userData;
}