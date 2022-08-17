module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("categories", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      categories: {
        type: Sequelize.STRING
      },
      active:{
        type:Sequelize.INTEGER
      }
  
      });
      return Category;
    };
  
   
  
  