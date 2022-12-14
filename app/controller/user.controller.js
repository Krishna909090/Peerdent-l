const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
const User = db.user;

// Registration
exports.Register = async (req, res) => {
  let userId = Math.floor(Math.random() * Math.pow(8, 5))
  const user = {
    firstname: req.body.firstname,
    middlename: req.body.middlename,
    lastname: req.body.lastname,
    password: req.body.password,
    email: req.body.useremail,
    code: req.body.code,
    phonenumber:req.body.phonenumber,
    dob: req.body.dob,
    address: req.body.address,
    country: req.body.country,
    userId: userId,
    role_Type:req.body.role_Type
  };
  console.log(user, "user")
   
 let email = await User.findOne({ where: { email: req.body.useremail } })
  if(email){
    return res.status(400).send({data:req.body.useremail, message:"Email already exists", status : 400})
  }

  let phonenumber = await User.findOne({ where: { phonenumber: req.body.phonenumber } })
  if(phonenumber){
    return res.status(400).send({data:req.body.phonenumber, message:"Phone number already exists", status : 400})
  }
  console.log(user, "jadjafbjnfnkndfksl")
  user.password = await bcrypt.hash(user.password, 10);
  await User.create(user)
    .then(data => {
      res.status(200).send({ data: data, message: "User Registered Successfully", status:200 });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

//Authentication
exports.login = async (req, res) => {
  let params = req.body;
  let data = await User.findOne({ where: { email: req.body.useremail } })
  if (data && bcrypt.compareSync(params.password, data.dataValues.password)) {
    const token = jwt.sign(
      {
        useremail: params.useremail,
        userId: data.dataValues.userId
      },
      "Secret",
      {
        expiresIn: "24h",
      }
    );

    let userDetail = {
      user: data.dataValues,
      token: token
    }
    res.status(200).send({ data: userDetail, message: "You have logged in successfully", status:200 })
  }
  else {
    res.status(400).send({message:"Invalid Useremail or Password", status: 400})
  }

}

// Update Profile
exports.update = async (req, res) => {
  let params = req.body
  console.log(params)
  const Id = params.userId;
  let data = await User.findOne({ where: { userId: Id } })
  let data1 = await sequelize.query('SELECT * FROM users WHERE "userId" = 5421', { raw: true })
  console.log("**********************************")
  console.log(data1[0], "dataasdaa")
  console.log("**********************************")
    if(!data){
    return res.status(400).send({message:"User not found", status:400})
  }
  await User.update(params, {
    where: { userId: Id }
  })
    .then(async num => {
      if (num == 1) {
        let data = await User.findOne({where :{ userId: Id }})
        res.status(200).send({ data :data  ,message: "User Profile Updated Successfully", status:200 });
      } else {
        res.status(200).send({ message: `Cannot update User details with id=${Id}!`});
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User details  with id=" + Id
      });
    });
};


// Update Profile
exports.userDetails = async (req, res) => {
  const Id = req.params.user_Id;
  try {
    let data = await User.findOne({
      where: { userId: Id }})
    res.status(200).send({data:data,status:200})
  }
  catch (err) {
    res.status(500).send({
      message: "Error getting User details  with id=" + Id
    });
  }
};







