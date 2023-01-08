import User from '../models/user';


var path = require('path');
var fs = require('fs');


 export const update = async (req,res) => {
        console.log("req.body",req);
        
         let UserId = req.body.UserId;
   try {
    let fields = req.body;
    var obj = {
      name: req.body.name,
      email: req.body.email,
      // custCode_prefix: req.body.custCode_prefix,
      // company_name: req.body.company_name,
      mobile: req.body.mobile,
      Address: req.body.Address,
      // Industry: req.body.Industry,
    }
    
    if(req.file!=undefined){
      obj.profile_img = {
      data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
      contentType: 'image/png'
      }
      fs.unlinkSync(path.join(__dirname + '/../uploads/' + req.file.filename));
    }
    let userdata = await User.updateOne({UserId:UserId},obj); 

        console.log("User Settings modified => ");
        res.status(200).send("User settings Updated Successfully");
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};


export const readall = async (req,res) => {
  let SessionUser = req.query.SessionUser;
  try {
     let userdata = await User.find({UserId:SessionUser}).exec();
    //  const responsedata.name = userdata[0].name;
    //console.log(userdata[0].profile_img.data);
    var obj = {
      UserId: userdata[0].UserId,
      name: userdata[0].name,
      email: userdata[0].email,
      custCode_prefix: userdata[0].custCode_prefix,
      company_name: userdata[0].company_name,
      mobile: userdata[0].mobile,
      Address: userdata[0].Address,
      Industry: userdata[0].Industry,
      imgdata: ((userdata[0].profile_img.data==null)?null:userdata[0].profile_img.data.toString('base64'))
    }
       res.status(200).json(obj);
  } catch (err) {
    console.log(err);
    res.status(400).json({  
      err: err.message,
    });
  }
};