const db = require("../models");
const aws = require("../../aws/aws");
const Video = db.video;
const User = db.user;
const favourites = db.favourites;
var multer = require('multer');
const { Sequelize, Op } = require("sequelize");


//Create Video Record
exports.UploadVideoFiles = async (req, res) => {

  try {
    let file_Id = Math.floor(Math.random() * Math.pow(8, 5))
    const user = {
      title: req.body.title,
      content: req.body.content,
      amount: req.body.amount,
      userId: req.body.user_Id,
      file: req.body.file,
      file_Id: file_Id,
      category: req.body.category,
      modeOfPayment:req.body.modeOfPayment,
      typeOfVideo:req.body.typeOfVideo
    };
    console.log(user, "sdsdsad")
    let users = await User.findOne({ where: { userId: req.body.user_Id } });
    if (!users) {
      return res.status(400).send({message:"User not found", status:400})
    }
    let x = await Video.create(user);
    console.log(x, "xxxx")
    let Obj = await Video.findOne({ where: { file_Id: x.dataValues.file_Id } });
    console.log(Obj, "adadsdaadaada")
    return res.status(200).send({data:Obj, status:200});
  }
  catch (e) {
    res.status(400).send({message:"Something went wrong!", status:400})
  }

};

exports.edit = async (req, res) => {

  try {
   
    const user = {
      title: req.body.title,
      content: req.body.content,
      amount: req.body.amount,
      category: req.body.category,
      modeOfPayment:req.body.modeOfPayment,
      typeOfVideo:req.body.typeOfVideo
    };
    let users = await User.findOne({ where: { userId: req.body.user_Id } });
    if (!users) {
     return res.status(400).send({message:"User not found", status:400})
    }
    await Video.update(user, {where: {file_Id :req.body.file_Id }});
    console.log(req.body.file_Id)
     let params =  await favourites.findOne({where: {file_Id :req.body.file_Id }});
     console.log(params)
     if(params){
      await favourites.findOne(user, {where: {file_Id :req.body.file_Id }});
     }
    console.log("Asdaslmabisbjkdajfbv")
    let Obj = await Video.findOne({ where: { file_Id:req.body.file_Id } });
  //  consol.log(Obj.dataValues, "Objjsdadaaaadadadsaasdajdksnj")
    return res.status(200).send({data:Obj, status:200, message:"Video Updated Successfully"});
  }
  catch (e) {
    res.status(400).send({message:"Something went wrong!", status:400})
  }

};

exports.getALLVideoFiles = async (req, res) => {

  let data = req.body.filter;
  let p = req.body.order;
  let limit = req.body.size;
  let offset = req.body.page * limit;
  let order = [["amount", p]];
  let range = req.body.range;
  try {
    //For categories, Order and Range between the categories
    if (req.body.filter && req.body.order && req.body.range) {
      console.log("came insdie this 3")
      await Video.findAndCountAll({
        where: {
          category: data,
          amount: {
            [Op.between]: range
          }
        },
        order: order
      }).then((response) => {
        if (!response) {
          return res.status(400).send({ message: "No Records Found", status: 400 })
        }
        return res.status(200).send({ data: response, status: 200 });
      })

    }
    //For categories and high to low, low to high filter
    else if (req.body.filter && req.body.order) {
      console.log("came inside 2")
      let arr = data
      await Video.findAndCountAll({

        where: {
          category: arr,

        },
        order: order,
      }).then((response) => {
        if (!response) {
          return res.status(400).send({ message: "No Records Found", status: 400 })
        }
        return res.status(200).send({ data: response, status: 200 });
      })
    }
    //For range of the Price
    else if (req.body.range) {
      console.log("came inside 1")
      let arr = data
      await Video.findAndCountAll({
        where: {
          amount: {
            [Op.between]: range
          }
        }
      }).then((response) => {
        if (!response) {
          return res.status(400).send({ message: "No Records Found", status: 400 })
        }
        return res.status(200).send({ data: response, status: 200 });
      })
    }
    else if (req.body.order) {
      console.log("came inside 090")
      let arr = data
      await Video.findAndCountAll({

        order: order

      }).then((response) => {
        if (!response) {
          return res.status(400).send({ message: "No Records Found", status: 400 })
        }
        return res.status(200).send({ data: response, status: 200 });
      })
    }
    //For only categories filter
    else if (req.body.filter) {
      console.log("came inside 0")
      let arr = data
      await Video.findAndCountAll({
        where: {
          category: arr

        }
      }).then((response) => {
        if (!response) {
          return res.status(400).send({ message: "No Records Found", status: 400 })
        }
        return res.status(200).send({ data: response, status: 200 });
      })
    }

    //To get All Files
    else {
      console.log("nothing was came")
      await Video.findAndCountAll({
      }).then((data) => {

        if (!data) {
          return res.status(400).send({ message: "No Records Found", status: 400 })
        }
        return res.status(200).send({ data: data, status: 200 });
      })
    }
  }
  catch (e) {
    res.status(400).send({message:"Something went wrong!", status:400})
  }
};



exports.getVideoFileById = async (req, res) => {
  let id = req.params.file_Id;
  let data = await Video.findOne({ where: { file_Id: id } });
  if (!data) {
    return res.status(400).send({message:"No Videos was found with this file Id", status:400});
  }
  let type = data.dataValues.category
  let Obj = await getRelatedVideos(type)
  return res.status(200).send({RelatedFiles: Obj, data:data, status:200})
};

exports.getVideoFilesByUserId = async (req, res) => {
  let id = req.params.user_Id;
  let data = await Video.findAndCountAll({ where: { userId: id } });
  if (!data) {
    return res.status(400).send({message:"No Videos Found for these User", status:400});
  }

  return res.status(200).send({data:data, status:200})

};

exports.deleteVideoFileById = async (req, res) => {
  let id = req.params.file_Id;
  let data = await Video.destroy({ where: { file_Id: id } });
  await favourites.destroy({where: { file_Id: id }})
  if (!data) {
    return res.status(400).send({message:"Unknown File Id", status:400});
  }
  return res.status(200).send({message:"Video Deleted Successfully", status:200});
};


const store = multer.memoryStorage({
  function(req, file, cb) {
    cb(null, "");
  },
});

const uploadFile = multer({
  storage: store,
}).any("file");

exports.uploadFiles = async (req, res) => {
    
  try {
    return new Promise((resolve, reject) => {
      uploadFile(req, res, async function (err) {
        if (err) {
          reject({ error: err })
        }
        else {
          // let users = await User.findOne({ where: { userId: id } });
          // if (!users) {
          //   res.status(400).send("User not found")
          // }
          let files = req.files
          console.log(req.files, "Adaadadaada")
          let Obj = await aws.uploadFiles(req.body.user_Id, files[0].originalname, files[0].buffer)
          return res.status(200).send({data:Obj, status:200})
        }
      })
    })
  }
  catch (e) {
    res.status(400).send({message:"Something went wrong!", status:400})
  }
};


async function getRelatedVideos(params) {
  let type = params
  let data = [];
  let order = [["createdAt", "DESC"]]
  let Obj = await Video.findAndCountAll({
    where: { category: type },
    order: order,
    limit: 5
  }).then((response) => {
    if (!response) {
      return false;
    }
    data.push(response)
  })
  return data
}