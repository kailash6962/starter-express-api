import Customers from "../models/Customers";
import { successResponse, failureResponse } from "../utilities/Response";
import Invoice from "../models/Invoice";
import InvoiceItems from "../models/InvoiceItems";
import Organization from "../models/Organization";
import InvoicePay from "../models/InvoicePay";
import InvoicePayDetail from "../models/InvoicePayDetail";
import Staff from "../models/Staff";
import Activitylog from "../models/Activitylog";
const Vonage = require("@vonage/server-sdk");

const Models = require("../models/Invoice");


var Validator = require('validatorjs');

//SAVE NEW
export const create = async (req, res, next) => {
  try {
    let fields = req.fields;
    let org = await Organization.findOne({
      OrgId: fields.OrgId,
    }).exec();
    let checkDuplicate = await InvoicePayDetail.findOne({
      PaymentId: fields.PaymentId,
      OrgId: fields.OrgId,
    }).exec();
    if(checkDuplicate){
      res.status(500).send(failureResponse("Duplicate Payment Id"));
    return next();
    }
    console.log("Creating payment");

    //validation
    let data = fields;
    
    let rules = {
      PaymentId: 'required',
      AmtPaid: 'required',
      PaymentDate: 'required',
      PaymentMode: 'required',
      PaymentBy: 'required',
      PaymentReference: 'required',
      UserId: 'required',
      OrgId: 'required',
    };
    let validation = new Validator(data, rules);
    if(validation.fails())
    res.status(200).send(validation.errors);
    else   
    { 
      var generatedPayId = await generatecode(req.fields.OrgId);
      var paymentDetail = fields.paymentDetail;
      var detailLength = Object.keys(paymentDetail).length;
      console.log('paymentDetail count ',detailLength);
    if (org && (parseFloat(fields.AmtPaid)>0)) {
      var remainingAmt = parseFloat(fields.AmtPaid);
      for(let i=0;i<detailLength;i++){
        console.log(paymentDetail[i].InvId);
        let pendingInv = await Invoice.findOne({
          Invid: paymentDetail[i].InvId,
          OrgId: fields.OrgId,
        }).exec();
        var pendingAmt = parseFloat(pendingInv.AmtTotal) - parseFloat(pendingInv.AmtPaid);
        if(pendingAmt>0)
        {
          var paidAmt = 0;
          if(remainingAmt>=pendingAmt){
            paidAmt = pendingAmt;
            remainingAmt = remainingAmt-paidAmt;
          } else {
            paidAmt = remainingAmt;
            remainingAmt = remainingAmt-paidAmt;
          }
          var updatedPaidAmt = parseFloat(pendingInv.AmtPaid)+parseFloat(paidAmt);
          var updatedStatus = paymentStatus(pendingInv.AmtTotal,updatedPaidAmt);
          await Invoice.updateOne({
            Invid: paymentDetail[i].InvId,
            OrgId:fields.OrgId,
          },{AmtPaid:updatedPaidAmt,Status:updatedStatus});
          let paydetail = {
            PaymentId: fields.PaymentId,
            Invid: paymentDetail[i].InvId,
            UserId: fields.UserId,
            OrgId: fields.OrgId,
            AmtPaid:paidAmt,
            Status:updatedStatus
          };
          let savepay = new InvoicePayDetail(paydetail);
          savepay.save((err, result) => {
            if (err) {
              console.log("saving err => ", err);
            }
          });
        }
      }
      var responseData = {};
      var paidTotal = data.AmtPaid-remainingAmt;
      if(data.AmtPaid!=remainingAmt){
      let paymaster = {
        PaymentId: fields.PaymentId,
        PaymentDate: fields.PaymentDate,
        PaymentMode: fields.PaymentMode,
        CustCode: fields.CustCode,
        PaymentBy: fields.PaymentBy,
        PaymentReference: fields.PaymentReference,
        Notes: fields.Notes,
        UserId: fields.UserId,
        OrgId: fields.OrgId,
        AmtPaid:paidTotal,
        Status:'Paid'
      };
      let savepaymaster = new InvoicePay(paymaster);
      savepaymaster.save((err, result) => {
            if (err) {
              console.log("saving err => ", err);
              res.status(500).send(failureResponse(err.message));
              return next();
            } else {
            responseData = {message:"Payment created successfully"};
            if(remainingAmt>0)
              responseData.message = "Your paid amount Rs."+(data.AmtPaid)+" is greater than selected Invoice pending amount Rs."+(paidTotal)+" ..Refund amount is Rs."+remainingAmt;
            res.json(successResponse(responseData))
            return next();
            }
          });
        } else{
          responseData.message = "You don't have pending invoice to pay";
          res.json(successResponse(responseData))
          return next();
        }
            
    } else{ res.status(500).send(failureResponse("Invalid Input")); return next();}
    
  }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
    return next();
  }
};

//READ ALL
export const readall = async (req, res) => {
  let SessionUser = req.query.SessionUser;
  try {
    let data = await InvoicePay.find({ OrgId: SessionUser }).exec();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//READ ONE
export const readone = async (req, res) => {
  console.log(req.fields);
  try {
    let invPay = await InvoicePay.find({
      OrgId: req.fields.OrgId,
      PaymentId: req.fields.PaymentId,
    }).exec();
    var invpayDetails = await InvoicePayDetail.find({
      OrgId: req.fields.OrgId,
      PaymentId: req.fields.PaymentId,
    }).exec();
    var resdata = {};
    resdata['paymentMasterData'] = invPay;
    resdata['paymentDetails'] = invpayDetails;
    res.json(resdata);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//DELETE
export const remove = async (req, res) => {
  try {
    let getInvpaydetail = await InvoicePayDetail.find({
      OrgId: req.fields.OrgId,
      PaymentId: req.fields.PaymentId,
    }).exec(function(err, docs) {
      console.log("Found the following records");
      // Iterate over the result and print each document
      docs.forEach(async doc =>  {
      let invoice = await Invoice.findOne({  
        OrgId: req.fields.OrgId,
        Invid: doc.Invid,
       })
      .sort({ Invid: -1 }).limit(1)
      .exec();
      var updatedAmt = (invoice.AmtPaid-parseFloat(doc.AmtPaid))
      let inv = await Invoice.updateOne({
        OrgId: req.fields.OrgId,
        Invid: doc.Invid,
      },{ 
        AmtPaid: updatedAmt,
        Status:paymentStatus(invoice.AmtTotal,updatedAmt)
       });
       doc.delete();
      });
    });
    await InvoicePay.deleteOne({
      OrgId: req.fields.OrgId,
      PaymentId: req.fields.PaymentId,
    }).exec();
   
    res.status(200).json("Payment deleted");
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//GENERATE INVOICE CODE
export const createcode = async (req, res) => {
  try {
    var invno = await generatecode(req.fields.SessionUser);
    res.status(200).json(invno);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};
const paymentStatus = (AmtTotal,AmtPaid) => {
  if(parseFloat(AmtTotal)<=parseFloat(AmtPaid))
    return "FullyPaid";
    else
    return ((parseFloat(AmtPaid)<1)?"UnPaid":"PartiallyPaid");
}
const generatecode = async (fields) => {
    let lastcode =await InvoicePay.findOne({ OrgId: fields })
      .sort({ PaymentId: -1 }).limit(1)
      .exec(); //LAST CODE
    let getuser =await Organization.findOne({
      OrgId: fields,
    }).exec(); //GET PREFIX FROM USER
    let CODE_PREFIX = getuser.invpaymentCode_prefix;
    if (lastcode) {
      var code = String(parseInt(lastcode.PaymentId.match(/(\d+)/)[0]) + 1).padStart(
        6,
        "0"
      ); //NEW CUSTCODE
    } else {
      var code = String(1).padStart(6, "0"); //NEW CUSTCODE
    }
    let invno = (CODE_PREFIX ? CODE_PREFIX : 'PAY') + code; //NEW CUSTCODE
  return invno;
}
