 import Role from '../models/Role';

 //SAVE NEW
 export const create = async (req,res) => {

  try {
    let fields = req.fields;

    let role = new Role({
      RoleName:fields.RoleName,
      Description:fields.Description,
      UserId:fields.UserId,
      OrgId:fields.OrgId,
      AccessLinks:JSON.parse(fields.AccessLinks)
    });

    console.log("role",role);
    console.log("json",fields.AccessLinks);

    

    role.save((err, result) => {
      if (err) {
        console.log("Role add err => ", err);
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


    let updaterole = {
      RoleName:fields.RoleName,
      Description:fields.Description,
      AccessLinks:JSON.parse(fields.AccessLinks)
    };
  //  handle image
  let role = await Role.updateOne({
     OrgId:req.fields.OrgId,
     _id:fields._id
    },updaterole);

   console.log("role modified => ");
   res.status(200).send("role Updated Successfully");
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
     let role = await Role.find({OrgId:SessionUser},{RoleName:1,Description:1,UserId:1,createdAt:1,updatedAt:1}).exec();
       res.json(role);
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
     let role = await Role.findOne({
       OrgId:SessionUser,
       _id:req.query.Roleid,
      }).exec();
       res.status(200).json(role);
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
       await Role.deleteOne({OrgId:req.query.SessionUser},{_id:req.query._id}).exec();
       res.status(200).json('role deleted');
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

//GENERATE role CODE
// export const createcode = async (req,res) => {
//   try {
//     console.log(req.query.SessionUser);
//      let role = await Role.find({OrgId:req.query.SessionUser}).sort({Custid:-1}).limit(1).exec();//LAST CUSTCODE
//      let getuser = await User.find({OrgId:req.query.SessionUser}).exec();//GET PREFIX FROM USER
//     console.log(role);
//     let role_PREFIX = getuser[0].custCode_prefix;
//     if(role.length>0){
//      var code = (String(parseInt(role[0].Custid.match(/(\d+)/)[0])+1).padStart(6, '0'));//NEW CUSTCODE
//     }
//     else{
//       var code = (String(1).padStart(6, '0'));//NEW CUSTCODE
//     }
//     let custcode = role_PREFIX+code;//NEW CUSTCODE
//     res.status(200).json(custcode);

//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       err: err.message,
//     });
//   }
// };
