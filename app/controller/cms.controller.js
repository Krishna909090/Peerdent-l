const db = require("../models");
const cms = db.cms;

// Add Employee
exports.addCms = async (req, res) => {

    const obj = {
        about_Us_Content: req.body.about_Us_Content,
        EULA: req.body.EULA,
        privacy_Policy: req.body.privacy_Policy,
        terms_Conditions: req.body.terms_Conditions,
    };
    await cms.create(obj)
        .then(data => {
            res.status(200).send({ data: data, message: "Added Successfully", status: 200 });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};


// Update cms
exports.update = async (req, res) => {
    let params = req.body
    const Id = params.id;
    await cms.update(params, {
        where: { id: Id }
    })
        .then(async num => {
            if (num == 1) {
                let data = await cms.findOne({ where: { id: Id } })
                console.log(data, "data")
                res.status(200).send({ data: data, message: "Details Updated Successfully", status: 200 });
            } else {
                res.status(200).send({ message: `Cannot update User details with id=${Id}!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating  details  with id=" + Id
            });
        });
};

//get Employee details
exports.getCms = async (req, res) => {
    try {
        let list = await cms.findOne({ where: { id: req.query.id } });
        console.log(list)
        res.status(200).send({ data: list, status: 200 });
    }
    catch (e) {
        res.status(500).send({
            message: "Error while fetchinng details"
        });
    }
}; 

