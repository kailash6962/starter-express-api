import Organization from '../models/Organization';


var path = require('path');
var fs = require('fs');


 export const update = async (req,res) => {        
  let OrgId = req.body.OrgId;
   try {
    let fields = req.body;
    var obj = fields;
console.log('obj :11', obj);
    if(req.file!=undefined){
      obj.profile_img = {
      data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
      contentType: 'image/png'
      }
      fs.unlinkSync(path.join(__dirname + '/../uploads/' + req.file.filename));
    }
    let userdata = await Organization.updateOne({OrgId:OrgId},obj); 

        console.log("Organization Settings modified => ");
        res.status(200).send("Organization settings Updated Successfully");
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};


export const readall = async (req,res) => {
  let SessionUser = req.query.OrgId;
  try {
     let userdata = await Organization.find({OrgId:req.query.OrgId}).findOne();
    var obj = {
      OrgId: userdata.OrgId,
      name: userdata.name,
      email: userdata.email,
      custCode_prefix: userdata.custCode_prefix,
      company_name: userdata.company_name,
      mobile: userdata.mobile,
      gstin: userdata.gstin,
      Address: userdata.Address,
      Industry: userdata.Industry,
      imgdata: ((userdata.profile_img.data==null)?null:userdata.profile_img.data.toString('base64'))
    }
      return res.status(200).json(obj);
  } catch (err) {
    console.log(err);
    return res.status(400).json({  
      err: err.message,
    });
  }
};