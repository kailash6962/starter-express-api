 import Staff from '../models/Staff';
 var nodemailer = require('nodemailer');

//  import {
//   generateUserId,
//   sendVerificationEmail,
// } from './Auth';
 const Vonage = require('@vonage/server-sdk')
 import User from '../models/user';

 //SAVE NEW
 export const create = async (req,res) => {

  //Sending SMS
  // var companyname = 'GeethaMobiles'
  // const vonage = new Vonage({
  //   apiKey: "ca770ca9",
  //   apiSecret: "tIPkKhQPlXWj6Ibj"
  // });
  // const from = "KailashApp";
  // const to = "918678915300";
  // const text = `Hi Kailash,  Thank you for choosing ${companyname}. We are so grateful for the pleasure of serving you and hope we met your expectations.`;

  // vonage.message.sendSms(from, to, text, (err, responseData) => {
  //     if (err) {
  //         console.log(err);
  //     } else {
  //         if(responseData.messages[0]['status'] === "0") {
  //             console.log("Message sent successfully.");
  //         } else {
  //             console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
  //         }
  //     }
  // });
  //SENDING SMS

  console.log("req.body",req.fields);
  try {
    let fields = req.fields;

    let staffs = new Staff(fields);

    let token = Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2);


    let object = {
      UserId: await generateUserId(),
      OrgId: req.fields.OrgId,
      name:req.fields.StaffName,
      email:req.fields.email,
      Role:req.fields.role,
      password:req.fields.newpassword,
      register_token:token,
      active:0,
  } 
  console.log("user obj",object);
    // handle image
    const user = new User(object);
    await user.save();
    sendVerificationEmail(req.get('host'),req.fields.email,token,req.fields.StaffName);

    staffs.save((err, result) => {
      if (err) {
        console.log("saving staff err => ", err);
        res.status(400).send(err.message);
      }
      res.json(result);
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//SEND ACCOUNT ACTIVATION LINK
const sendCreatepasswordLink = (host,email,token,name) => {
    
  if(host=='localhost:'+process.env.PORT){
      var hosturi = 'http://localhost:'+process.env.PORT+'/api';
      }
      else{
          var hosturi = process.env.SERVER_URL_PROD;
      }
      var verify_url = hosturi+'/createpassword?email='+email+'&token='+token
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
          from: process.env.EMAIL_USERNAME,
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

 //UPDATE
 export const update = async (req,res) => {
        console.log("req.update",req.fields);
  try {
    let fields = req.fields;


  // let staffs = new staffs(fields);
  //  handle image
  let currentemail = await Staff.findOne({
    OrgId:req.fields.OrgId,
     Staffid:fields.Staffid
   }).exec();

  let staffs = await Staff.updateOne({
     OrgId:req.fields.OrgId,
     Staffid:fields.Staffid
    },fields);

    let object = {
      name:fields.StaffName,
      email:fields.email,
      active:0,
  }

  await User.updateOne({
    email:currentemail.email,
    },object);

   console.log("staff modified => ");
   res.status(200).send("staff Updated Successfully");
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//READ ALL
export const readall = async (req,res) => {
        let SessionUser = req.query.SessionUser;
  try {
     let staffs = await Staff.find({OrgId:SessionUser}).exec();
       res.json(staffs);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//READ ONE
export const readone = async (req,res) => {
        let SessionUser = req.query.SessionUser;
        console.log(req.query);
  try {
     let staffs = await Staff.find({
       OrgId:SessionUser,
       Staffid:req.query.Staffid,
      }).exec();
       res.json(staffs);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//DELETE
export const remove = async (req,res) => {
  try {
       await Staff.deleteOne({OrgId:req.query.SessionUser},{Staffid:req.query.Staffid}).exec();
       res.status(200).json('staff deleted');
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//GENERATE staff CODE
export const createcode = async (req,res) => {
  try {
    console.log(req.query.SessionUser);
     let staffs = await Staff.find({OrgId:req.query.SessionUser}).sort({Staffid:-1}).limit(1).exec();//LAST CUSTCODE
     //let getuser = await User.find({OrgId:req.query.SessionUser}).exec();//GET PREFIX FROM USER
    console.log(staffs);
    let staff_PREFIX = 'STAFF';
    if(staffs.length>0){
     var code = (String(parseInt(staffs[0].Staffid.match(/(\d+)/)[0])+1).padStart(6, '0'));//NEW CUSTCODE
    }
    else{
      var code = (String(1).padStart(6, '0'));//NEW CUSTCODE
    }
    let custcode = staff_PREFIX+code;//NEW CUSTCODE
    res.status(200).json(custcode);

  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

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