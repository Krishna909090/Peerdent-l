const db = require("../models");
const aws = require("../../aws/aws");
const Article = db.article;
const User = db.user;
const favourites = db.favourites;
const { Sequelize, Op } = require("sequelize");

var multer = require("multer");
const { all } = require("express/lib/application");

const store = multer.memoryStorage({
  function(req, file, cb) {
    cb(null, "");
  },
});

const uploadFile = multer({
  storage: store,
}).any("file");

console.log(uploadFile, "dadssffdsfds");

//Create Article Record
exports.createArticle = async (req, res) => {
  try{
    return new Promise((resolve, reject) => {
      uploadFile(req, res, async function (err) {
        if (err) {
          reject({ error: err });
        } else {
          let file_Id = Math.floor(Math.random() * Math.pow(8, 5));
          const user = {
            title: req.body.title,
            content: req.body.content,
            amount: req.body.amount,
            userId: req.body.user_Id,
            file_Id: file_Id,
            category: req.body.category,
            modeOfPayment:req.body.modeOfPayment
          };
          const id = req.body.user_Id;
          let users = await User.findOne({ where: { userId: id } });
          if(!users){
            return res.status(400).send({message:"User not found", status:400})
          }
          let x = await Article.create(user);
          
          let files = req.files;
          for (let K of files) {
            let Obj = await aws.uploadFiles(
              req.body.user_Id,
              K.originalname,
              K.buffer
            );
            if (K.fieldname === "thumbnail") {
              let params = {
                thumbnail: Obj.Location,
              };
              console.log(x.dataValues.file_Id, "sadada")
              await Article.update(params, {
                where: { file_Id: x.dataValues.file_Id },
              });
            } else {
              let params = {
                file: Obj.Location,
              };
              console.log(params);
              await Article.update(params, {
                where: { file_Id: x.dataValues.file_Id },
              });
            }
            
          }
          let data = await Article.findOne({ where: { file_Id: x.dataValues.file_Id } });
            return  res.status(200).send({data:data, status:200});
        }
      });
    });
  }
  catch(e){
    res.status(400).send({message:"Something went wrong!", status:400})
  }
 
};

exports.edit = async (req, res) => {
   let params;
  try {
    return new Promise((resolve, reject) => {
      uploadFile(req, res, async function (err) {
        if (err) {
          reject({ error: err })
        }
        else {

          const user = {
            title: req.body.title,
            content: req.body.content,
            amount: req.body.amount,
            userId: req.body.user_Id,
            file_Id: req.body.file_Id,
            category: req.body.category,
            modeOfPayment: req.body.modeOfPayment
          };
          const Id = req.body.user_Id
          console.log(Id, "llllkk")
          let users = await User.findOne({ where: { userId: Id } });
          if (!users) {
            res.status(400).send({ message: "User not found", status: 400 })
          }
          await Article.update(user, {
            where: { file_Id: req.body.file_Id, userId: Id }
          })

          let files = req.files
          if (files) {
            console.log(files, "filesss")
            for (let K of files) {
              let Obj = await aws.uploadFiles(req.body.user_Id, K.originalname, K.buffer)
              if (K.fieldname === "thumbnail") {
                let params = {
                  thumbnail: Obj.Location
                }
                console.log(Obj)
                await Article.update(params, {
                  where: { file_Id: req.body.file_Id }
                })
              }
              else {
                let params = {
                  file: Obj.Location,
                }
                await Article.update(params, {
                  where: { file_Id: req.body.file_Id }
                })
              }
            }
            let Obj = await Article.findOne({ where: { file_Id: req.body.file_Id } });
            console.log(Obj, "LimES")
           params = {
              title:Obj.dataValues.title,
              content:Obj.dataValues.content,
              amount:Obj.dataValues.amount,
              category:Obj.dataValues.category,
              file:Obj.dataValues.file,
              thumbnail:Obj.dataValues.thumbnail,
              modeOfPayment:Obj.dataValues.modeOfPayment
            }
            await favourites.update(params,{where: {file_Id: req.body.file_Id}})
            return res.status(200).send({ data: Obj, status: 200 })
          }
          let Obj = await Article.findOne({ where: { file_Id: req.body.file_Id } });
          console.log(Obj, "LimES")
         params = {
            title:Obj.dataValues.title,
            content:Obj.dataValues.content,
            amount:Obj.dataValues.amount,
            category:Obj.dataValues.category,
            file:Obj.dataValues.file,
            thumbnail:Obj.dataValues.thumbnail,
            modeOfPayment:Obj.dataValues.modeOfPayment
          }
          await favourites.update(params,{where: {file_Id: req.body.file_Id}})
          return res.status(200).send({ message: "Article Updated Successfully", status: 200 })
        }

      })
    })
  }
  catch (e) {
    res.status(400).send("Something went wrong!")
  }
};

exports.getAllFiles = async (req, res) => {
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
      await Article.findAndCountAll({
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
      await Article.findAndCountAll({

        where: {
          category: arr,

        },
        order: order,
      }).then((response) => {
        if (!response) {
          return  res.status(400).send({ message: "No Records Found", status: 400 })
        }
        return res.status(200).send({ data: response, status: 200 });
      })
    }
    //For range of the Price
    else if (req.body.range) {
      console.log("came inside 1")
      let arr = data
      console.log(range, "rangeee")
      let k = await Article.findAndCountAll({
        where: {
          amount: {
            [Op.between]: range
          }
        }
      }).then((response) => {
        if (!response) {
          return  res.status(400).send({ message: "No Records Found", status: 400 })
        }
        return res.status(200).send({ data: response, status: 200 });
      })
     
    }
    else if (req.body.order) {
      console.log("came inside 090")
      let arr = data
      await Article.findAndCountAll({

        order: order

      }).then((response) => {
        if (!response) {
          return  res.status(400).send({ message: "No Records Found", status: 400 })
        }
        return res.status(200).send({ data: response, status: 200 });
      })
    }
    //For only categories filter
    else if (req.body.filter) {
      console.log("came inside 0")
      let arr = data
      await Article.findAndCountAll({
        where: {
          category: arr

        }
      }).then((response) => {
        if (!response) {
          return  res.status(400).send({ message: "No Records Found", status: 400 })
        }
        return res.status(200).send({ data: response, status: 200 });
      })
    }

    //To get All Files
    else {
      console.log("nothing was came")
      await Article.findAndCountAll({
      }).then((data) => {

        if (!data) {
          return  res.status(400).send({ message: "No Records Found", status: 400 })
        }
        return res.status(200).send({ data: data, status: 200 });
      })
    }
  }
  catch (e) {
    res.status(400).send({message:"Something went wrong!", status:400})
  }
};

exports.getFileById = async (req, res) => {
  let id = req.params.file_Id;
  let data = await Article.findOne({ where: { file_Id: id } });
  if (!data) {
    return res.status(400).send({message:"No Article was found with this ID", status:400});
  }
  let type = data.dataValues.category
  let Obj = await getRelatedArticles(type)
  return res.status(200).send({RelatedFiles: Obj, data:data, status:200})
};

exports.getFilesByUserId = async (req, res) => {
  let id = req.params.user_Id;
  let data = await Article.findAndCountAll({ where: { userId: id } });
  if (!data) {
    return res.status(400).send("No Article Found for these User");
  }
  return res.status(200).send(data);
};

exports.deleteByFileId = async (req, res) => {
  let id = req.params.file_Id;
  let data = await Article.destroy({ where: { file_Id: id } });
  await favourites.destroy({where: { file_Id: id }})
  if (!data) {
   return  res.status(400).send("Unknown File Id");
  }
 return res.status(200).send("Article Deleted Successfully");
};


async function getRelatedArticles(params) {
  let type = params
  let data = [];
  let order = [["createdAt", "DESC"]]
  let Obj = await Article.findAndCountAll({
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