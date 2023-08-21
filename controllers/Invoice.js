import Customers from "../models/Customers";
import { successResponse, failureResponse } from "../utilities/Response";
import { getUserDataByToken } from "../controllers/Auth";
import Invoice from "../models/Invoice";
import InvoiceItems from "../models/InvoiceItems";
import Organization from "../models/Organization";
import Staff from "../models/Staff";
import Activitylog from "../models/Activitylog";
import User from '../models/user';

const jwt = require('jsonwebtoken');

const Vonage = require("@vonage/server-sdk");

const Models = require("../models/Invoice");

var Validator = require('validatorjs');

//SAVE NEW
export const create = async (req, res) => {
  try {
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
    var userId = userData.UserId;
    let fields = req.fields;
    fields.UserId = userId;
    fields.OrgId = userOrgId;
    let customers = await Customers.findOne({
      OrgId: fields.OrgId,
      Custid: fields.custCode,
    }).exec();
    let org = await Organization.findOne({
      OrgId: fields.OrgId,
    }).exec();
    let inv = await Invoice.findOne({
      Invid: fields.Invid,
    }).exec();
    //validation

    let data = fields;
    
    let rules = {
      Invid: 'required',
      custCode: 'required',
      InvDate: 'required',
      DueDate: 'required',
      SalesPerson: 'required',
      SubTotal: 'required',
      AmtTotal: 'required',
      UserId: 'required',
      OrgId: 'required',
    };
    

    let validation = new Validator(data, rules);
    
    if(validation.fails())
    res.status(200).send(validation.errors);
    else   
    { 
    if (customers && org && !(parseFloat(fields.AmtTotal)<parseFloat(fields.AmtPaid))) {
      fields.Status = (fields.Status=='Draft')?"Draft":paymentStatus(fields.AmtTotal,fields.AmtPaid);
      let invoice = new Invoice(fields);
      var InvItems = fields.InvoiceItems;
      for (let i = 0; i < Object.keys(InvItems).length; ++i) {
        InvItems[i].Invid = fields.Invid;
        InvItems[i].UserId = fields.UserId;
        InvItems[i].OrgId = fields.OrgId;
        let newinvitems = new InvoiceItems(InvItems[i]);
        newinvitems.save();
      }
      invoice.save((err, result) => {
        if (err) {
          console.log("saving err => ", err);
          res.status(500).send(failureResponse(err.message));
        } else res.json(successResponse({invId:result.Invid,message:"Invoice created successfully"}));
      });
    } else res.status(500).send(failureResponse("Invalid Input"));
  }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//UPDATE
export const update = async (req, res) => {
  try {
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
    var userId = userData.UserId;
    let fields = req.fields;
    fields.OrgId = userOrgId;
    fields.UserId = userId;
    fields.Status = paymentStatus(fields.AmtTotal,fields.AmtPaid);
    let customers = await Customers.findOne({
      OrgId: userOrgId,
      Custid: fields.custCode,
    }).exec();
    let org = await Organization.findOne({
      OrgId: userOrgId,
    }).exec();
    let invCheck = await Invoice.findOne({
      Invid: fields.Invid,
      OrgId: userOrgId,
    }).exec();
    if(parseFloat(invCheck.AmtPaid)>parseFloat(fields.AmtTotal))
    return res.status(200).send(failureResponse({message:"Paid amount is greater than Invoice amount. Please Check and Try again"}));
    if (customers && org && invCheck) {
      let data = fields;
    
    let rules = {
      Invid: 'required',
      custCode: 'required',
      InvDate: 'required',
      DueDate: 'required',
      SalesPerson: 'required',
      SubTotal: 'required',
      AmtTotal: 'required',
      UserId: 'required',
    };
    

    let validation = new Validator(data, rules);
    
    if(validation.fails())
    return res.status(200).send(failureResponse(validation.errors));
    else   
    { 
      let inv = await Invoice.updateOne({
        Invid: fields.Invid,
        OrgId:userOrgId,
      },fields);
      let deleteinvitems = await InvoiceItems.remove({
        Invid: fields.Invid,
        OrgId:userOrgId,
      }).exec();
      var InvItems = fields.InvoiceItems;
      for (let i = 0; i < Object.keys(InvItems).length; ++i) {
        console.log(InvItems[i]);
        InvItems[i].Invid = fields.Invid;
        InvItems[i].UserId = fields.UserId;
        InvItems[i].OrgId = userOrgId;
        let newinvitems = new InvoiceItems(InvItems[i]);
        newinvitems.save();
      }
      res.json(successResponse("Invoice Updated Successfully"));
    }
    } else res.status(500).send(failureResponse("Invalid Input"));
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//READ ALL
export const read = async (req, res) => {
  
  var userData = await getUserDataByToken(req);
  var filter = {};
  if(req.fields.custCode)
  filter.custCode = req.fields.custCode;
  if(req.fields.Status=='Pending')
  filter.Status = {$ne:'FullyPaid'};
  try {
    let data = await Invoice.aggregate([
      {
        $match:{
          "OrgId" : userData.OrgId,
          ...filter
        }
      }, 
      {
        $lookup:
        {
          from: 'customers',
          localField: 'custCode',
          foreignField: 'Custid',
          "pipeline": [
            { "$match": {"OrgId" : userData.OrgId} },
          ],
          as: 'CustomerData'
        }
      },
      { $sort: { createdAt: -1 } }, // 1 for ascending, -1 for descending
  ]).exec();
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
  var userData = await getUserDataByToken(req);
  try {
    let inv = await Invoice.aggregate([
      {
        $match:{
          "OrgId" : userData.OrgId,
          "Invid" : req.fields.Invid,
        }
      }, 
      {
        $lookup:
        {
          from: 'customers',
          localField: 'custCode',
          foreignField: 'Custid',
          "pipeline": [
            { "$match": {"OrgId" : userData.OrgId} },
          ],
          as: 'CustomerData'
        }
      }
  ]).exec();
    var invitems = await InvoiceItems.find({
      OrgId: userData.OrgId,
      Invid: req.fields.Invid,
    }).exec();
    var resdata = {};
    resdata['invdata'] = inv;
    resdata['invitems'] = invitems;
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
    await Customers.deleteOne(
      { OrgId: req.query.SessionUser },
      { Custid: req.query.Custid }
    ).exec();
    res.status(200).json("Customer deleted");
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
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
    let invoice = await Invoice.findOne({ OrgId: userOrgId })
      .sort({ Invid: -1 }).limit(1)
      .exec(); //LAST CODE
    let getuser = await Organization.findOne({
      OrgId: userOrgId,
    }).exec(); //GET PREFIX FROM USER
    let CODE_PREFIX = getuser.invCode_prefix;
    if (invoice) {
      var code = String(parseInt(invoice.Invid.match(/(\d+)/)[0]) + 1).padStart(
        6,
        "0"
      ); //NEW CUSTCODE
    } else {
      var code = String(1).padStart(6, "0"); //NEW CUSTCODE
    }
    let invno = (CODE_PREFIX ? CODE_PREFIX : "INV") + code; //NEW CUSTCODE
    res.status(200).json(successResponse(invno));
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
