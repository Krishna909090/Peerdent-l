const db = require("../models");
const category = db.categories;
const User = db.user

exports.getAllCategories = async (req, res) => {  
    let data = await category.findAll({ where: { active: 1 } })
    if (!data) {
      return res.status(400).send({message:"No active categories", status:400});
    }
    return res.status(200).send({data:data, status:200})
  }

  exports.createCategory = async (req, res) => {
    let Obj = {
      active:1,
      categories:req.body.categories,
      id:req.body.id
    }  
    console.log(Obj)
    let data = await category.create(Obj)
    if (!data) {
      return res.status(400).send({message:"Something went wrong!", status:400});
    }
    
    return res.status(200).send({data:data, status:200})
  }

