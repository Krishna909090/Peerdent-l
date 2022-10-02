module.exports = (sequelize, Sequelize, DataTypes) => {
    const subscription = sequelize.define("subscription", {
        id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          sub_Name: {
            type: Sequelize.STRING,
          },
          sub_Tenure:{
            type: Sequelize.STRING,
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
          },
      });
      return subscription;
    };
  