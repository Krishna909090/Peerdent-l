module.exports = (sequelize, Sequelize) => {
    const QuestionsAndAnswers = sequelize.define("QuestionsAndAnswers", {
      question_Id:{
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER
      },
      question_By:{
          type: Sequelize.STRING
      },
      type: {
          type: Sequelize.STRING
      },
      question:{
        type: Sequelize.STRING
      }
      });
      return QuestionsAndAnswers;
    };
  
   
  
  