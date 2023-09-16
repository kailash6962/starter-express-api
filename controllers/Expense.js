import Customers from "../models/Customers";
import { successResponse, failureResponse, errorResponse } from "../utilities/Response";
import Expense from "../models/Expense";
import { getUserDataByToken } from "../controllers/Auth";
import Organization from "../models/Organization";
import Activitylog from "../models/Activitylog";


var Validator = require('validatorjs');

//SAVE NEW
export const create = async (req, res, next) => {
  try {
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
    var userId = userData.UserId;
    let fields = req.fields;
    fields.UserId = userId;
    fields.OrgId = userOrgId;
    let org = await Organization.findOne({
      OrgId: fields.OrgId,
    }).exec();
    let checkDuplicate = await Expense.findOne({
      ExpenseId: fields.ExpenseId,
      OrgId: fields.OrgId,
    }).exec();
    if(checkDuplicate){
      res.status(200).send(failureResponse({message:"Duplicate ExpenseId"}));
    return next();
    }
    let rules = {
      ExpenseId: 'required',
      ExpenseDate: 'required',
      CustCode: 'required',
      Category: 'required',
      Amount:'required|integer|min:1'
    };
    let validation = new Validator(req.fields, rules);
    if(validation.fails())
    return res.status(200).send(validation.errors);
  else{
    if (org){
      let save = new Expense(fields);
      save.save((err, result) => {
        if (err) 
          return res.status(200).send(failureResponse(err.message));
          return res.status(200).send(successResponse({message:"Expense Created Successfully"}));
      });
    }
  }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: err.message,
    });
  }
};

//READ ALL
export const readall = async (req, res) => {
  try {
    var filter = {};
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
    // let data = await Expense.find({ OrgId: userOrgId }).exec();
    let data = await Expense.aggregate([
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
          localField: 'CustCode',
          foreignField: 'Custid',
          "pipeline": [
            { "$match": {"OrgId" : userData.OrgId} },
          ],
          as: 'CustomerData'
        }
      },
      { $sort: { createdAt: -1 } }, // 1 for ascending, -1 for descending
  ]).exec();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: err.message,
    });
  }
};

//READ ONE
export const readone = async (req, res) => {
  try {
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
    let expense = await Expense.find({
      OrgId: userOrgId,
      ExpenseId: req.fields.ExpenseId,
    }).exec();
    var resdata = {};
    resdata['Expense'] = expense.length>0?expense:"No Data Found";
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
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
 
    await Expense.deleteOne({
      OrgId: userOrgId,
      ExpenseId: req.fields.ExpenseId,
    }).exec();
   
    res.status(200).json("Expense deleted");
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
    var invno = await generatecode(userOrgId);
    res.status(200).json(successResponse(invno));
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};
const generatecode = async (fields) => {
    let lastcode =await Expense.findOne({ OrgId: fields })
      .sort({ ExpenseId: -1 }).limit(1)
      .exec(); //LAST CODE
      console.log('lastcode :150', lastcode);

    // let getuser =await Organization.findOne({
    //   OrgId: fields,
    // }).exec(); //GET PREFIX FROM USER
    let CODE_PREFIX = 'EXP';//getuser.invpaymentCode_prefix;
    if (lastcode) {
      var code = String(parseInt(lastcode.ExpenseId.match(/(\d+)/)[0]) + 1).padStart(
        6,
        "0"
      ); //NEW CUSTCODE
    } else {
      var code = String(1).padStart(6, "0"); //NEW CUSTCODE
    }
    let createdcode = (CODE_PREFIX ? CODE_PREFIX : 'EXP') + code; //NEW CUSTCODE
  return createdcode;
}
