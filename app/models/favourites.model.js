module.exports = (sequelize, Sequelize) => {
    const favourites = sequelize.define("favourites", {
     
      file_Id:{
          type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      statusInfo:{
          type: Sequelize.BOOLEAN
      },
      type: {
          type: Sequelize.STRING
      },
      title:{
        type:Sequelize.STRING
      },
      content:{
        type:Sequelize.STRING
      },
      file:{
        type:Sequelize.STRING
      },
      thumbnail:{
        type:Sequelize.STRING
      },
      amount:{
        type:Sequelize.INTEGER
      },
      modeOfPayment:{
        type:Sequelize.STRING
      },
      typeOfVideo:{
        type:Sequelize.STRING
      }

      });
      return favourites;
    };
  
   
  
  