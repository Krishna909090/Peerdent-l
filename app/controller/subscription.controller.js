const db = require("../models");
const subscripton = db.subscripton;

// Add Employee
exports.addSubscription = async (req, res) => {
    const sub = { sub_Name: req.body.sub_Name, sub_Tenure: req.body.sub_Tenure };
  
    await subscripton.create(sub).then(data => { res.status(200).send({ data: data, message: "Subscription Added Successfully", status: 200 })}).catch(err => { res.status(500).send({
                message:err.message || "Some error occurred while creating the User."})})}


// Update Subscription
exports.update = async (req, res) => {
    let params = req.body
    const id = params.id;
    let data = await subscripton.findOne({ where: { id : id } })
    if (!data) {
        return res.status(400).send({ message: "Subscription not found", status: 400 })
    }
    await subscripton.update(params, {
        where: { id : id }
    })
        .then(async num => {
            if (num == 1) {
                let data = await subscripton.findOne({ where: { id: id } })
                res.status(200).send({ data: data, message: "Subscripton details Updated Successfully", status: 200 });
            } else {
                res.status(401).send({ message: `Cannot update subscripton details with id=${id}!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating subscripton details  with id=" + id
            })
        });
};


// List of Subscriptions
exports.listAllSubscripton = async (req, res) => {
    try {
        let list = await subscripton.findAll({ raw: true });
        res.status(200).send({ data: list, status: 200 });
    }
    catch (e) {
        res.status(500).send({
            message: "Error while fetchinng subscripton details"
        });
    }
};


//get Subscripton details
exports.getSubscription = async (req, res) => {
    try {
        let list = await subscripton.findOne({ where: { id: req.query.id } });
        res.status(200).send({ data: list, status: 200 });
    }
    catch (e) {
        res.status(500).send({
            message: "Error while fetchinng subscripton details"
        });
    }
};

