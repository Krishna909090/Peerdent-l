const db = require("../models");
const aws = require("../../aws/aws");
const QuestionsAndAnswers = db.QuestionsAndAnswers;
const answers = db.answers;
const User = db.user;

//Create Questions
exports.createQuestion = async (req, res) => {
  let question_Id = Math.floor(Math.random() * Math.pow(8, 5))
  try {
    let users = await User.findOne({ where: { userId: req.body.user_Id } });
    if (!users) {
      return res.status(400).send({ message: "User not found", status: 400 });
    }
    const Obj = {
      userId: req.body.user_Id,
      question_Id: question_Id,
      question: req.body.question,
      type: req.body.type,
      question_By: users.firstname + " " + users.lastname,
    };
    await QuestionsAndAnswers.create(Obj);
    let getData = await QuestionsAndAnswers.findAll()
    return res.status(200).send({data:getData, status:200});
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
};

//Create Answers
exports.createAnswer = async (req, res) => {
  let answer_Id = Math.floor(Math.random() * Math.pow(8, 5))
  try {
    let users = await User.findOne({ where: { userId: req.body.user_Id } });
    if (!users) {
      return res.status(400).send({ message: "User not found", status: 400 });
    }
    let Obj = {
      reply_By: users.firstname + " " + users.lastname,
      answer: req.body.answer,
      answer_Id: answer_Id,
      question_Id: req.body.question_Id,
      userId: req.body.user_Id,
    }
    let data = await answers.create(Obj);
    return res.status(200).send({ data: data, status: 200 });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
};

//Get All Answers
exports.getAllQuestions = async (req, res) => {
  try {
    if(req.body.range && req.body.filter){
      console.log("rangeeee")
      let range = req.body.range
      let order = [["createdAt", range]]
      console.log("came inside 111111")
      let arr = req.body.filter
      await QuestionsAndAnswers.findAndCountAll({
        where: { type : req.body.filter },
        order: order
      }).then((response) => {
        if (!response) {
          return res.status(400).send({message:"No Records Found", status:400})
        }
        return res.status(200).send({data: response, status:200});
      })
    }
    else if(req.body.filter) {
      console.log("came inside 0")
      let arr = req.body.filter
      await QuestionsAndAnswers.findAndCountAll({
        where: {
          type: arr

        }
      }).then((response) => {
        if (!response) {
          return res.status(400).send({message:"No Records Found", status:400})
        }
        return res.status(200).send({data: response, status:200});
      })
    }
    else if(req.body.range){
      console.log("rangeeee")
      let range = req.body.range
      let order = [["createdAt", range]]
      console.log("came inside 0")
      let arr = req.body.filter
      await QuestionsAndAnswers.findAndCountAll({
        order: order
      }).then((response) => {
        if (!response) {
          return res.status(400).send({message:"No Records Found", status:400})
        }
        return res.status(200).send({data: response, status:200});
      })
    }
    else{
      let data = await QuestionsAndAnswers.findAndCountAll();
      return res.status(200).send({ data: data, status: 200 });
    }
   
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
}

//Update Question
exports.updateQuestion = async (req, res) => {
  try {
    let users = await QuestionsAndAnswers.findOne({
      where: {
        question_Id: req.body.question_Id
      }
    });
    if (users.dataValues.userId !== req.body.user_Id) {
      return res.status(400).send({ message: "You are not authorised to update this question", status: 400 });
    }
    await QuestionsAndAnswers.update({
      question: req.body.question,
      type: req.body.type,
    }, {
      where: {
        question_Id: req.body.question_Id,
      }
    });
    return res.status(200).send({ message: "Your Question was updated Successfully", status: 200 });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
}

//Update Answer
exports.updateAnswer = async (req, res) => {
  try {
    let users = await answers.findOne({
      where: {
        answer_Id: req.body.answer_Id
      }
    });
    if (users.dataValues.userId !== req.body.user_Id) {
      return res.status(400).send({ message: "You are not authorised to update this answer", status: 400 });
    }
    await answers.update({
      answer: req.body.answer
    }, {
      where: {
        answer_Id: req.body.answer_Id
      }
    });
    return res.status(200).send({ message: "Your Answer was updated Successfully", status: 200 });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
}

//Get All Answers
exports.getAllAnswers = async (req, res) => {
  try {
    let data = await answers.findAll({
      where: {
        question_Id: req.query.question_Id
      }
    });
    return res.status(200).send({ data: data, status: 200 });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
}

//Delete Question
exports.deleteQuestion = async (req, res) => {
  try {
    await QuestionsAndAnswers.destroy({ where: { question_Id: req.query.question_Id } });
    await answers.destroy({ where: { question_Id: req.query.question_Id } });
    return res.status(200).send({ message: "Your Question was deleted Successfully", status:200 });
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
}


//Delete Answer
exports.deleteAnswer = async (req, res) => {
  try {
    await answers.destroy({ where: { answer_Id: req.query.answer_Id } });
    return res.status(200).send({ message: "Your Answer was deleted Successfully", status:200});
  } catch (e) {
    res.status(400).send({ message: "Something went wrong!", status: 400 });
  }
}