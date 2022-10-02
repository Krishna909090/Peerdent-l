module.exports = (sequelize, Sequelize, DataTypes) => {
    const employee = sequelize.define("employee", {
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phonenumber: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      empId: {
        type: Sequelize.INTEGER,
      },
      work: {
        type: Sequelize.STRING
      },
      experience: {
        type: Sequelize.STRING
        },
      role_Type:{
        type: Sequelize.STRING
      },
      enable:{
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      }
      });
      return employee;
    };
  