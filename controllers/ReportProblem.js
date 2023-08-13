import ErrorLogs from '../models/ErrorLogs';
import { getUserDataByToken } from "../controllers/Auth";

var path = require('path');
var fs = require('fs');
var nodemailer = require('nodemailer');

export const report = async (req,res) => {
  try {
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
    var userId = userData.UserId;
    let saveLogData = {
      ErrorReportId:'ERR0001',
      ErrorData:req.fields,
      UserId:userId,
      OrgId:userOrgId,
    }
    let saveErrorLogs = new ErrorLogs(saveLogData);
    saveErrorLogs.save((err, result) => {
      if (err) {
        console.log("saving err => ", err);
      }
      sendErrorEmailtoAdministrator(process.env.ADMIN_EMAIL_ADDRESS,process.env.ADMIN_NAME)
      return res.status(200).json("Report sent successfully");
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({  
      err: err.message,
    });
  }
};

export const sendErrorEmailtoAdministrator = (email,name) => {
    
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
          subject: 'New Error Reported in KailashInvoiceApp',
          html: `<h4>Hi ${name},</h4>
          <p>Unknown Error occured in Invoice application</p> 
          <br><a href='#' style='
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
            Show Error Detail
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