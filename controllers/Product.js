import Product from '../models/Product';

 export const create = async (req,res) => {
        console.log("req.body",req.fields);
  try {
    let fields = req.fields;

    let product = new Product(fields);    
    product.save((err, result) => {
      if (err) {
        console.log("saving Product err => ", err);
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

//READ ALL
export const readall = async (req,res) => {
  let SessionUser = req.query.SessionUser;
  console.log(SessionUser);
  try {
     let product = await Product.find({OrgId:SessionUser}).exec();
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
     //let getuser = await User.find({name:req.query.SessionUser}).exec();//GET PREFIX FROM USER
    //console.log(products);
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
       await Product.deleteOne({OrgId:req.query.SessionUser},{ProdId:req.query.ProdId}).exec();
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