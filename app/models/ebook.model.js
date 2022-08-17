module.exports = (sequelize, Sequelize) => {
  const Ebook = sequelize.define("ebook", {
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
    thumbnail: {
      type: Sequelize.STRING
    },
    file_Id: {
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
    }
    });
    return Ebook;
  };

 

