module.exports = (sequelize, Sequelize) => {
    const answers = sequelize.define("answers", {
        question_Id: {
            type: Sequelize.INTEGER,
        },
        userId: {
            type: Sequelize.INTEGER
        },
        reply_By: {
            type: Sequelize.STRING
        },
        answer_Id: {
            type: Sequelize.INTEGER
        },
        answer: {
            type: Sequelize.STRING
        }
    });
    return answers;
};



