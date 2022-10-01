module.exports = (sequelize, Sequelize) => {
    const query = sequelize.define("query", {
        query_Id: {
            type: Sequelize.INTEGER,
        },
        userId: {
            type: Sequelize.INTEGER
        },
        query_By: {
            type: Sequelize.STRING
        },
        query: {
            type: Sequelize.STRING
        },
        priority: {
            type: Sequelize.STRING
        },
        category:{
            type: Sequelize.STRING
        },
        file:{
            type: Sequelize.STRING
        }
    });
    return query;
};



