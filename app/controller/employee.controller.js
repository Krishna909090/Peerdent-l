const db = require("../models");
const employee = db.employee;

// Add Employee
exports.addEmployee = async (req, res) => {
  let empId = Math.floor(Math.random() * Math.pow(8, 5))
  const emp = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.useremail,
    phonenumber:req.body.phonenumber,
    dob: req.body.dob,
    address: req.body.address,
    country: req.body.country,
    empId: empId,
    role_Type:req.body.role_Type,
    enable:req.body.enable
  };
  console.log(emp, "emp")
   
 let email = await employee.findOne({ where: { email: req.body.useremail } })
  if(email){
    return res.status(400).send({data:req.body.useremail, message:"Email already exists", status : 400})
  }

  let phonenumber = await employee.findOne({ where: { phonenumber: req.body.phonenumber } })
  if(phonenumber){
    return res.status(400).send({data:req.body.phonenumber, message:"Phone number already exists", status : 400})
  }
  await employee.create(emp)
    .then(data => {
      res.status(200).send({ data: data, message: "Employee Added Successfully", status:200 });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};


// Update Employee
exports.update = async (req, res) => {
  let params = req.body
  console.log(params)
  const Id = params.empId;
  let data = await employee.findOne({ where: { empId: Id } })
  if(!data){
    return res.status(400).send({message:"User not found", status:400})
  }
  await employee.update(params, {
    where: { empId: Id }
  })
    .then(async num => {
      if (num == 1) {
        let data = await employee.findOne({where :{ empId: Id }})
        res.status(200).send({ data :data  ,message: "Employee details Updated Successfully", status:200 });
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


// List of Employees
exports.listAllEmployees = async (req, res) => {
   try{
    let list = await employee.findAll({raw:true});
    res.status(200).send({ data :list  , status:200 });
   }
   catch(e){
    res.status(500).send({
        message: "Error while fetchinng Employee details"
      });
   }
  };


//get Employee details
exports.getEmployee = async (req, res) => {
    try{
     let list = await employee.findOne({where :{empId : req.query.empId}});
     console.log(list)
     res.status(200).send({ data :list  , status:200 });
    }
    catch(e){
     res.status(500).send({
         message: "Error while fetchinng Employee details"
       });
    }
   };
 
