module.exports = (sequelize, Sequelize) => {
    const reply = sequelize.define("reply", {
        query_Id: {
            type: Sequelize.INTEGER,
        },
        userId: {
            type: Sequelize.INTEGER
        },
        reply_By: {
            type: Sequelize.STRING
        },
        reply_Id: {
            type: Sequelize.INTEGER
        },
        reply: {
            type: Sequelize.STRING
        }
    });
    return reply;
};



