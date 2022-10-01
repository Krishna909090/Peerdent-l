const db = require("../models");
const aws = require("../../aws/aws");
const Queries = db.query;
const Reply = db.reply;
const User = db.user;
var multer = require('multer');


const store = multer.memoryStorage({
  function(req, file, cb) {
    cb(null, "");
  },
});

const uploadFile = multer({
  storage: store,
}).any("file");

//Create Questions
exports.createQuery = async (req, res) => {
  try{
    return new Promise((resolve, reject) => {
      uploadFile(req, res, async function (err) {
        if (err) {
          reject({ error: err })
        } 
        else{
          let query_Id = Math.floor(Math.random() * Math.pow(8, 5))
          let users = await User.findOne({ where: { userId: req.body.userId } });
          if (!users) {   
            return res.status(400).send({ message: "User not found", status: 400 });
          }
          const Obj = {
            userId: req.body.userId,
            query_Id: query_Id,
            query: req.body.query,
            query_By:users.firstname + " " + users.lastname,
            priority: req.body.priority,
            category:req.body.category
          };
          console.log(Obj, "Parmas")
          let getData = await Queries.create(Obj);
          let files = req.files
          console.log(files, "filesss")
         if(files){
          let Obj = await aws.uploadFiles(req.body.userId, files[0].originalname, files[0].buffer)
          let params = {
            file: Obj.Location
          }
          await Queries.update(params, {
            where: { query_Id: getData.dataValues.query_Id }
          })
          let Info = await Queries.findOne({ where: { query_Id: getData.dataValues.query_Id } });
          return res .status(200).send({data:Info, status:200});
         }
      
         return res.status(200).send({data:getData, status:200});
        }
      })
    })
  }
  catch (e){
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
}

exports.createReply = async (req, res) => {
  let reply_Id = Math.floor(Math.random() * Math.pow(8, 5))
  try {
    let users = await User.findOne({ where: { userId: req.body.userId } });
    if (!users) {
      return res.status(400).send({ message: "User not found", status: 400 });
    }
    let Obj = {
      reply_By: users.firstname + " " + users.lastname,
      reply: req.body.reply,
      reply_Id: reply_Id,
      query_Id: req.body.query_Id,
      userId: req.body.userId,
    }
    let data = await Reply.create(Obj);
    return res.status(200).send({ data: data, status: 200 });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
};

//Get All Queries
exports.getAllQueries = async (req, res) => {
  try {
    let data = await Queries.findAndCountAll();
    return res.status(200).send({ data: data, status: 200 });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
}


//Update Answer
exports.updateReply = async (req, res) => {
  try {
    let users = await Reply.findOne({
      where: {
        reply_Id: req.body.reply_Id
      }
    });
    if (users.dataValues.userId != req.body.userId) {
      return res.status(400).send({ message: "You are not authorised to update this Reply", status: 400 });
    }
    await Reply.update({
      reply: req.body.reply
    }, {
      where: {
        reply_Id: req.body.reply_Id
      }
    });
    return res.status(200).send({ message: "Your Reply was updated Successfully", status: 200 });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
}

//Get All Answers
exports.viewQuery = async (req, res) => {
  console.log(req.params, "akbdsjbfkkfjsdabj")
  try {
    let order = [["createdAt", "ASC"]]
    // let Query = [];
    // let Replies = []
    let data = await Queries.findOne({
      where: { query_Id: req.params.Id },raw:true  });
    // Query.push(data)
    let data1 = await Reply.findAll({
      where: {
        query_Id: req.params.Id},
        order: order,
        raw:true});
    // Replies.push(data1)
    return res.status(200).send({ Query:data, Replies:data1, status: 200 });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
}

//Get All Queries
exports.getQueriesByUserId = async (req, res) => {
  try {
    let data = await Queries.findAndCountAll({where: {
      userId: req.params.userId},raw:true});
    return res.status(200).send({ data: data, status: 200 });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
}
