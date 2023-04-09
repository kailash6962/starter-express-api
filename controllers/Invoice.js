import Customers from "../models/Customers";
import { successResponse, failureResponse } from "../utilities/Response";
import Invoice from "../models/Invoice";
import InvoiceItems from "../models/InvoiceItems";
import Organization from "../models/Organization";
import Staff from "../models/Staff";
import Activitylog from "../models/Activitylog";
const Vonage = require("@vonage/server-sdk");

const Models = require("../models/Invoice");

var Validator = require('validatorjs');

//SAVE NEW
export const create = async (req, res) => {
  try {
    let fields = req.fields;
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
      fields.Status = paymentStatus(fields.AmtTotal,fields.AmtPaid);
      let invoice = new Invoice(fields);
      var InvItems = fields.InvoiceItems;
      for (let i = 0; i < Object.keys(InvItems).length; ++i) {
        console.log(InvItems[i]);
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
        } else res.json(successResponse("Invoice created successfully"));
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
    let fields = req.fields;
    let customers = await Customers.findOne({
      OrgId: fields.OrgId,
      Custid: fields.custCode,
    }).exec();
    let org = await Organization.findOne({
      OrgId: fields.OrgId,
    }).exec();
    let invCheck = await Invoice.findOne({
      Invid: fields.Invid,
      OrgId: fields.OrgId,
    }).exec();
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
      OrgId: 'required',
    };
    

    let validation = new Validator(data, rules);
    
    if(validation.fails())
    res.status(200).send(validation.errors);
    else   
    { 
      let inv = await Invoice.updateOne({
        Invid: fields.Invid,
        OrgId:fields.OrgId,
      },fields);
      let deleteinvitems = await InvoiceItems.remove({
        Invid: fields.Invid,
        OrgId:fields.OrgId,
      }).exec();
      var InvItems = fields.InvoiceItems;
      for (let i = 0; i < Object.keys(InvItems).length; ++i) {
        console.log(InvItems[i]);
        InvItems[i].Invid = fields.Invid;
        InvItems[i].UserId = fields.UserId;
        InvItems[i].OrgId = fields.OrgId;
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
export const readall = async (req, res) => {
  let SessionUser = req.query.SessionUser;
  try {
    let data = await Invoice.find({ OrgId: SessionUser }).exec();
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
    let inv = await Invoice.find({
      OrgId: req.fields.OrgId,
      Invid: req.fields.Invid,
    }).exec();
    var invitems = await InvoiceItems.find({
      OrgId: req.fields.OrgId,
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
    console.log(req.query.SessionUser);
    let invoice = await Invoice.findOne({ OrgId: req.query.SessionUser })
      .sort({ Invid: -1 }).limit(1)
      .exec(); //LAST CODE
    let getuser = await Organization.findOne({
      OrgId: req.query.SessionUser,
    }).exec(); //GET PREFIX FROM USER
    console.log(invoice);
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
