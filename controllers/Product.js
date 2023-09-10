import Product from '../models/Product';
import { getUserDataByToken } from "../controllers/Auth";
var Validator = require('validatorjs');

 export const create = async (req,res) => {
  try {
    let data = req.fields;
    let rules = {
      ProdId: "required",
      prodName: "required",
      costPrice: "required",
      sellingPrice: "required",
      unit: "required",
      stockCounts: "integer",
      Category: "required",
      minimumStockCounts: "integer",
      Type: "required",
      wholeSaleCount: "integer",
      wholeSalePrice: "integer",
      };
    let validation = new Validator(data, rules);
    if(validation.fails())
    return res.status(200).send(validation.errors);
    else{
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
    var userId = userData.UserId;
    let fields = req.fields;
    fields.OrgId = userOrgId;
    fields.UserId = userId;

    let product = new Product(fields);    
    product.save((err, result) => {
      if (err) {
        console.log("saving Product err => ", err);
        res.status(500).send(err.message);
      }
      res.json(result);
    });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: err.message,
    });
  }
};

//READ ALL
export const readall = async (req,res) => {
  try {
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
     let product = await Product.find({OrgId:userOrgId}).exec();
     console.log(product);
       res.json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//GENERATE PRODUCT CODE
export const createcode = async (req,res) => {
  try {
     let products = await Product.find({OrgId:req.query.SessionUser}).sort({ProdId:-1}).limit(1).exec();//LAST PRODCODE

    let PRODUCT_PREFIX = 'PROD';//getuser[0].PRODCode_prefix;
    if(products.length>0){
     var code = (String(parseInt(products[0].ProdId.match(/(\d+)/)[0])+1).padStart(6, '0'));//NEW PRODCODE
    }
    else{
      var code = (String(1).padStart(6, '0'));//NEW PRODCODE
    }
    let productcode = PRODUCT_PREFIX+code;//NEW PRODCODE
    res.status(200).json(productcode);

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
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
       await Product.deleteOne({OrgId:userOrgId,ProdId:req.query.ProdId}).exec();
       res.status(200).json('Product deleted');
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
let products = await Product.find({
 OrgId:SessionUser,
 ProdId:req.query.ProdId,
}).exec();
console.log(products);
 res.json(products);
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


// let products = new products(fields);
//  handle image
let products = await Product.updateOne({
OrgId:req.fields.OrgId,
ProdId:fields.ProdId
},fields);

console.log("Product modified => ");
res.status(200).send("Product Updated Successfully");
} catch (err) {
console.log(err);
res.status(400).json({
err: err.message,
});
}
};