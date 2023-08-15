import ErrorLogs from '../models/ErrorLogs';
import { getUserDataByToken } from "../controllers/Auth";

var nodemailer = require('nodemailer');

export const report = async (req,res) => {
  try {
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
    var userId = userData.UserId;
    let saveLogData = {
      ErrorReportId: await createcode(),
      ErrorData:req.fields,
      UserId:userId,
      OrgId:userOrgId,
    }
    let saveErrorLogs = new ErrorLogs(saveLogData);
    saveErrorLogs.save((err, result) => {
      if (err) {
        console.log("saving err => ", err);
      }
      sendErrorEmailtoAdministrator(process.env.ADMIN_EMAIL_ADDRESS,process.env.ADMIN_NAME,result)
      return res.status(200).json("Report sent successfully");
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({  
      err: err.message,
    });
  }
};

export const sendErrorEmailtoAdministrator = (email,name,errorJson) => {
  let jsonData = errorJson.ErrorData;
  const formattedTree = `
  <ul>
      <li>Collection Info
          <ul>
              <li>ErrorId: ${errorJson.ErrorReportId}</li>
              <li>UserId: ${errorJson.UserId}</li>
              <li>OrgId: ${errorJson.OrgId}</li>
          </ul>
      </li>
      <li>Browser Info
          <ul>
              <li>User Agent: ${jsonData.browserInfo.userAgent}</li>
              <li>Language: ${jsonData.browserInfo.language}</li>
              <li>Platform: ${jsonData.browserInfo.platform}</li>
          </ul>
      </li>
      <li>Screen Info
          <ul>
              <li>Width: ${jsonData.screenInfo.width}</li>
              <li>Height: ${jsonData.screenInfo.height}</li>
          </ul>
      </li>
      <li>Error
          <ul>
              <li>Message: ${jsonData.error.message}</li>
              <li>Status: ${jsonData.error.status}</li>
              <!-- Add more error-related information as needed -->
          </ul>
      </li>
      <!-- Add more sections like 'response' and 'userToken' -->
  </ul>
`;

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
          <p>Unknown Error occured in Invoice application</p><br>
          ${formattedTree}
          <br><p>
            Above data is just for short information. Show more detail in errorLog database collection
            </p>`
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

//GENERATE CUSTOMER CODE
export const createcode = async () => {
  try {
    let PREFIX = 'ERR';
    let errorLogs = await ErrorLogs.find({}).sort({ErrorReportId:-1}).limit(1).exec();
    if(errorLogs.length>0)
     var ecode = (String(parseInt(errorLogs[0].ErrorReportId.match(/(\d+)/)[0])+1).padStart(6, '0'));
    else
      var ecode = (String(1).padStart(6, '0'));
    let code = PREFIX+ecode;
    return code;
  } catch (err) {
    return Math.floor(10000000 + Math.random() * 90000000);
  }
};
