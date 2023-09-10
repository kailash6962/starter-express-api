import Organization from '../models/Organization';
import { getUserDataByToken } from "../controllers/Auth";
var path = require('path');
var fs = require('fs');


 export const update = async (req,res) => {        
   try {
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
    let fields = req.fields;   
    var obj = fields;
    if(req.file!=undefined){
      obj.profile_img = {
      data: fs.readFileSync(path.join(__dirname + '/../tmp/' + req.file.filename)),
      contentType: 'image/png'
      }
      fs.unlinkSync(path.join(__dirname + '/../tmp/' + req.file.filename));
    }
    let userdata = await Organization.updateOne({OrgId:userOrgId},obj); 
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
  try {
    var getuserData = await getUserDataByToken(req);
    var userOrgId = getuserData.OrgId;
     let userdata = await Organization.find({OrgId:userOrgId}).findOne();
    var obj = {
      OrgId: userdata.OrgId,
      name: userdata.name,
      email: userdata.email,
      custCode_prefix: userdata.custCode_prefix,
      company_name: userdata.company_name,
      mobile: userdata.mobile,
      website: userdata.website,
      gstin: userdata.gstin,
      Address: userdata.Address,
      Industry: userdata.Industry,
      CompanyAddress: userdata.CompanyAddress,
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