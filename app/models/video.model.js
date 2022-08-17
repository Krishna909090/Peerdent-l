module.exports = (sequelize, Sequelize) => {
    const Video = sequelize.define("video", {
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      file: {
        type: Sequelize.STRING
      },
      file_Id:{
          type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      },
      modeOfPayment:{
        type:Sequelize.STRING
      },
      typeOfVideo:{
        type:Sequelize.STRING
      }
      });
      return Video;
    };
  
   
  
  