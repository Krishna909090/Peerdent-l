const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model.js")(sequelize, Sequelize);
db.ebook = require("./ebook.model.js")(sequelize, Sequelize);
db.article  = require("./article.model.js")(sequelize, Sequelize);
db.video = require("./video.model.js")(sequelize, Sequelize);
db.favourites = require("./favourites.model")(sequelize, Sequelize);
db.categories = require("./categories.model")(sequelize, Sequelize);
db.QuestionsAndAnswers = require("./Q&A.model")(sequelize, Sequelize);
db.answers = require("./answers.model")(sequelize, Sequelize);
db.payment = require("./payment.model")(sequelize, Sequelize);
db.query = require("./askAnExpert.model")(sequelize, Sequelize);
db.reply = require("./replyByExpert.model")(sequelize, Sequelize);
db.employee = require("./employee.model")(sequelize, Sequelize);
db.subscripton = require("./subscription.model")(sequelize, Sequelize);
db.cms = require("./cms.model")(sequelize, Sequelize);
module.exports = db;