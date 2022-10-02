module.exports = (sequelize, Sequelize, DataTypes) => {
    const cms = sequelize.define("cms", {
        id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          about_Us_Content : {
            type: Sequelize.STRING,
          },
          EULA : {
            type: Sequelize.STRING,
          },
          privacy_Policy:{
            type: Sequelize.STRING,
          },
          terms_Conditions:{
            type: Sequelize.STRING,
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
          },
      });
      return cms;
    };
  