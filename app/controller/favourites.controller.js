const db = require("../models");
const aws = require("../../aws/aws");
const favourites = db.favourites;
const Ebook = db.ebook;
const Article = db.article;
const Video = db.video
const User = db.user;

//Create EBook Record
exports.createBookmark = async (req, res) => {
  try {
    let users = await User.findOne({ where: { userId: req.body.user_Id } });
    if (!users) {
      return res.status(400).send({ message: "User not found", status: 400 });
    }
     let getData = await favourites.findOne({
      where: { userId: req.body.user_Id, file_Id: req.body.file_Id },
    });
    if (getData) {
      await favourites.destroy({ where: { userId: req.body.user_Id, file_Id: req.body.file_Id }, });
      return res.status(200).send({message : "Un Bookmarked Successfully", status:200})
    }
    else {
      if (req.body.type === "Ebook") {
        let data = await Ebook.findOne({
          where: { file_Id: req.body.file_Id },
        });
        let Obj = {
          userId: req.body.user_Id,
          file_Id: req.body.file_Id,
          statusInfo: true,
          title: data.dataValues.title,
          content: data.dataValues.content,
          file: data.dataValues.file,
          thumbnail: data.dataValues.thumbnail,
          amount: data.dataValues.amount,
          type: req.body.type,
          modeOfPayment: data.dataValues.modeOfPayment,
          typeOfVideo: "Null"
        }
        await favourites.create(Obj);
        return res.status(200).send({ data: Obj, status: 200 });
      }
      else if (req.body.type === "Article") {
        let data = await Article.findOne({
          where: { file_Id: req.body.file_Id },
        });
        let Obj = {
          userId: req.body.user_Id,
          file_Id: req.body.file_Id,
          statusInfo: true,
          title: data.dataValues.title,
          content: data.dataValues.content,
          file: data.dataValues.file,
          thumbnail: data.dataValues.thumbnail,
          amount: data.dataValues.amount,
          modeOfPayment: data.dataValues.modeOfPayment,
          typeOfVideo: "Null"
        }
        await favourites.create(Obj);
        return res.status(200).send({ data: Obj, status: 200 });
      }
      else if (req.body.type === "Video") {
        let data = await Video.findOne({
          where: { file_Id: req.body.file_Id },
        });
        let Obj = {
          userId: req.body.user_Id,
          file_Id: req.body.file_Id,
          statusInfo: true,
          title: data.dataValues.title,
          content: data.dataValues.content,
          file: data.dataValues.file,
          thumbnail: data.dataValues.thumbnail,
          amount: data.dataValues.amount,
          type: req.body.type,
          amount: data.dataValues.amount,
          modeOfPayment: data.dataValues.modeOfPayment,
          typeOfVideo: data.dataValues.typeOfVideo
        }
        await favourites.create(Obj);
        return res.status(200).send({ data: Obj, status: 200 });
      }
    }
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
};

exports.getBookmarksByUserId = async (req, res) => {
  try {
    let id = req.params.user_Id;
    let data = await favourites.findAll({ where: { userId: id } });
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
