const db = require("../models");
const aws = require("../../aws/aws");
const favourites = db.favourites;
const Ebook = db.ebook;
const Article = db.article;
const Video = db.video;
const Payment = db.payment;
const User = db.user;
let  moment = require("moment")

//Create EBook Record
exports.payment = async (req, res) => {
  let statusInfo;
  try {
    let users = await User.findOne({ where: { userId: req.body.user_Id } });
    if (!users) {
      return res.status(400).send({ message: "User not found", status: 400 });
    }
    // let Info = await Payment.findOne({where: { file_Id: req.body.file_Id, userId: req.body.user_Id }})
    // if(Info){
    //    statusInfo = Info.statusInfo
    // }else{
    //   statusInfo = false
    // }
      if (req.body.type === "Ebook") {
          // check E-book table and get the data
        let data = await Ebook.findOne({
          where: { file_Id: req.body.file_Id },
        });
         let months = req.body.months;
         console.log(months, "monthsss")
         let expire_Date = await calculateEndDate(months);
        //  let remainingDays = await expiryDate(expire_Date);
        //  console.log(remainingDays, "remaining dayas")
        let Obj = {
          userId: req.body.user_Id,
          file_Id: req.body.file_Id,
          title:data.dataValues.title,
          category:data.dataValues.category,
          content: data.dataValues.content,
          file: data.dataValues.file,
          thumbnail: data.dataValues.thumbnail,
          amount: data.dataValues.amount,
          type: req.body.type,
          modeOfPayment: req.body.modeOfPayment,
          typeOfVideo: "Null",
          OrderId:req.body.orderId
        }
        console.log(Obj, "Obj")
        let params = await Payment.create(Obj);
        //params.dataValues.remainingDays = remainingDays;
        console.log(params)
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
          modeOfPayment:  req.body.modeOfPayment,
          typeOfVideo: "Null",
          OrderId:req.body.orderId,
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
          modeOfPayment: req.body.modeOfPayment,
          typeOfVideo: req.body.typeOfVideo,
          OrderId:req.body.orderId,
          type:req.body.type                                                                                                                                                                             
        }
        let params = await Payment.create(Obj);
        console.log(params,"paramsss")
        return res.status(200).send({ data: params, status: 200 });
      }
    
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
};

exports.getPurhasesByUserId = async (req, res) => {
  try {
    console.log(req.params.user_Id)
    let id = req.params.user_Id;
    let data = await Payment.findAll({ where: { userId: id } });
    if (!data) {
      return res.status(400).send("No Bookmarks Found for these User");
    }
    console.log(data, "data")
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

exports.getOrderByOrderId = async (req, res) => {
  console.log(req.params)
  let id = req.params.order_Id

  let Obj = await Payment.findOne({ where: { OrderId: id } })
  if (!Obj) {
    return res.status(400).send({ message: "No Order was found with this ID", status: 400 });
  }
  return res.status(200).send({ data: Obj,  status: 200 })
}


// async function expiryDate(date_string) {
//   console.log(date_string, "dataaaa")
//   const expiration = JSON.stringify(date_string)
//   const current_date =  JSON.stringify(moment().format("DD-MM-YYYY"));
//   console.log(current_date)
//   // let date1 =moment(current_date);
//   // let date2 = moment(expiration)
//   let days = date2.diff(date1)
//   console.log(days, "daysss")
//   return days;
// }

async function calculateEndDate(params){
 console.log(params, "monthss")
  let startDate =  moment().format('DD-MM-YYYY');
  console.log(startDate, "Asdadasdad")
  let endDateMoment =moment().add(1, 'M').format('DD-MM-YYYY');
 
  console.log(endDateMoment, "sdadanijidn")
  return endDateMoment;
}


