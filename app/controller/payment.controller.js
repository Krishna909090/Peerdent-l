const db = require("../models");
const aws = require("../../aws/aws");
const favourites = db.favourites;
const Ebook = db.ebook;
const Article = db.article;
const Video = db.video;
const Payment = db.payment;
const User = db.user;
const  moment = require("moment")

//Create EBook Record
exports.payment = async (req, res) => {
  let statusInfo;
  try {
    let users = await User.findOne({ where: { userId: req.body.user_Id } });
    if (!users) {
      return res.status(400).send({ message: "User not found", status: 400 });
    }
    let Info = await favourites.findOne({where: { file_Id: req.body.file_Id, userId: req.body.user_Id }})
    if(Info){
       statusInfo = Info.statusInfo
    }else{
      statusInfo = false
    }
    
     
  
      if (req.body.type === "Ebook") {
          // check E-book table and get the data
        let data = await Ebook.findOne({
          where: { file_Id: req.body.file_Id },
        });
         let months = req.body.months;
         let expire_Date = await calculateEndDate(months);
         let remainingDays = await expiryDate(expire_Date)
        let Obj = {
          userId: req.body.user_Id,
          file_Id: req.body.file_Id,
          title:data.dataValues.title,
          category:data.dataValues.category,
          statusInfo:statusInfo,
          content: data.dataValues.content,
          file: data.dataValues.file,
          thumbnail: data.dataValues.thumbnail,
          amount: data.dataValues.amount,
          type: req.body.type,
          modeOfPayment: data.dataValues.modeOfPayment,
          typeOfVideo: "Null",
          OrderId:req.body.orderId,
          expire_Date:  expire_Date,
          
          purchased_Date :  moment().format("DD-MM-YYYY")
        }
        let params = await Payment.create(Obj);
        params.dataValues.remainingDays = remainingDays;
        console.log(params.da)
        return res.status(200).send({ data: params, status: 200 });
      }
      else if (req.body.type === "Article") {
        let data = await Article.findOne({
          where: { file_Id: req.body.file_Id },
        });
        let Obj = {
          userId: req.body.user_Id,
          file_Id: req.body.file_Id,
          title:data.dataValues.title,
          category:data.dataValues.category,
          statusInfo:true,
          content: data.dataValues.content,
          file: data.dataValues.file,
          thumbnail: data.dataValues.thumbnail,
          amount: data.dataValues.amount,
          type: req.body.type,
          modeOfPayment: data.dataValues.modeOfPayment,
          typeOfVideo: "Null",
          OrderId:req.body.orderId,
          expire_Date: await calculateEndDate(months),
          purchased_Date :  moment().format("DD-MM-YYYY")
        }
        let params = await Payment.create(Obj);
        return res.status(200).send({ data: params, status: 200 });
      }
      else if (req.body.type === "Video") {
        let data = await Video.findOne({
          where: { file_Id: req.body.file_Id },
        });
        let Obj = {
          userId: req.body.user_Id,
          file_Id: req.body.file_Id,
          title:data.dataValues.title,
          category:data.dataValues.category,
          statusInfo:true,
          content: data.dataValues.content,
          file: data.dataValues.file,
          thumbnail: data.dataValues.thumbnail,
          amount: data.dataValues.amount,
          type: req.body.type,
          modeOfPayment: data.dataValues.modeOfPayment,
          typeOfVideo: req.body.typeOfVideo,
          OrderId:req.body.orderId,
          expire_Date: await calculateEndDate(months),
          purchased_Date :  moment().format("DD-MM-YYYY")
        }
        let params = await Payment.create(Obj);
        return res.status(200).send({ data: params, status: 200 });
      }
    
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
};

exports.getPurhasesByUserId = async (req, res) => {
  try {
    let id = req.params.user_Id;
    let data = await Payment.findAll({ where: { userId: id } });
    if (!data) {
      return res.status(400).send("No Bookmarks Found for these User");
    }
    let Ebooks = [];
    let Articles = [];
    let Videos = [];
    for (let K of data) {
      if (K.type === 'Ebook') {
        let data = await Ebook.findOne({
          where: { file_Id: K.dataValues.file_Id }
        });
        Ebooks.push(K);
      };
      if (K.type === 'Article') {
        let data = await Article.findOne({
          where: { file_Id: K.dataValues.file_Id }
        })
        Articles.push(K);
      };
      if (K.type === 'Video') {
        let data = await Video.findOne({
          where: { file_Id: K.dataValues.file_Id }
        });
        Videos.push(K);
      };
    }
    return res.status(200).send({ Ebook: Ebooks, Article: Articles, Video: Videos, status: 200 });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
};



async function expiryDate(date_string) {
  var expiration = date_string
  var current_date =  moment().format("DD-MM-YYYY");
  console.log(current_date)
  var days = moment(expiration).diff(current_date, 'days');
  return days;
}

async function calculateEndDate(params){
  let startDate =  moment().format("DD-MM-YYYY");
  let endDateMoment = moment(startDate);
  endDateMoment.add(params, 'months')
  return endDateMoment;
}


