 import Customers from '../models/customers';
 import Organization from '../models/Organization';
 import Activitylog from '../models/Activitylog';
 const Vonage = require('@vonage/server-sdk');

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

    let customers = new Customers(fields);
    // handle image
  
    customers.save((err, result) => {
      if (err) {
        console.log("saving hotel err => ", err);
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

 //UPDATE
 export const update = async (req,res) => {
        console.log("req.update",req.fields);
  try {
    let fields = req.fields;


  // let customers = new Customers(fields);
  //  handle image
  let customers = await Customers.updateOne({
     OrgId:req.fields.OrgId,
     Custid:fields.Custid
    },fields);

   console.log("Customer modified => ");
   res.status(200).send("Customer Updated Successfully");
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
     let customers = await Customers.find({OrgId:SessionUser}).exec();
       res.json(customers);
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
     let customers = await Customers.find({
       OrgId:SessionUser,
       Custid:req.query.Custid,
      }).exec();
       res.json(customers);
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
       await Customers.deleteOne({OrgId:req.query.SessionUser},{Custid:req.query.Custid}).exec();
       res.status(200).json('Customer deleted');
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//GENERATE CUSTOMER CODE
export const createcode = async (req,res) => {
  try {
    console.log(req.query.SessionUser);
     let customers = await Customers.find({OrgId:req.query.SessionUser}).sort({Custid:-1}).limit(1).exec();//LAST CUSTCODE
     let getuser = await Organization.find({OrgId:req.query.SessionUser}).exec();//GET PREFIX FROM USER
    console.log(customers);
    let CUSTOMER_PREFIX = getuser[0].custCode_prefix;
    if(customers.length>0){
     var code = (String(parseInt(customers[0].Custid.match(/(\d+)/)[0])+1).padStart(6, '0'));//NEW CUSTCODE
    }
    else{
      var code = (String(1).padStart(6, '0'));//NEW CUSTCODE
    }
    let custcode = CUSTOMER_PREFIX+code;//NEW CUSTCODE
    res.status(200).json(custcode);

  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};
