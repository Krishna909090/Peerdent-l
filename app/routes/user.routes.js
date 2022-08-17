module.exports = (app) => {
  var router = require("express").Router();

  //User Related APIS******************************************************
  router.post("/register", User.Register); // Create a User
  router.post("/login", User.login); // Login a User
  router.post("/update", User.update); // Update the User Details
  router.post("/getUserDetails",User.userDetails)
  //************************************************************************

  //Ebook Related APIS*******************************************************
  router.post("/Ebooks", Ebook.create); // Create Ebook
  router.get("/getAllFiles", Ebook.getAllFiles); // Get ALL Ebooks
  router.get("/getFileById/:file_Id", Ebook.getFileById); // Get Ebook By Id
  router.get("/getFilesByUserId/:user_Id", Ebook.getFilesByUserId); // Get By User Id
  router.delete("/deleteFileById/:file_Id", Ebook.deleteByFileId); // Delete By File Id
  //**************************************************************************

  //Article Related APIS*******************************************************
  router.post("/createArticle", Article.createArticle); // Create Article
  router.get("/getAllArticles", Article.getAllFiles); // Get ALL Ebook Files
  router.get("/getArticleById/:file_Id", Article.getFileById); // Get ALL Ebook by File ID
  router.get("/getArticlesByUserId/:user_Id", Article.getFilesByUserId); // Get Files by User Id
  router.delete("/deleteArticleById/:file_Id", Article.deleteByFileId); // Delete Files by File Id
  //*********************************************************************************************

  //Video Related APIS********************************************************************************
  router.post("/Uploadvideos", Video.UploadVideoFiles); // Create Video Record
  router.get("/getVideoFileById/:file_Id", Video.getVideoFileById); // Get Video By Id
  router.get("/getAllVideoFiles", Video.getALLVideoFiles); // Get ALL Videos
  router.get("/getVideoFilesByUserId/:user_Id", Video.getVideoFilesByUserId); // Get Videos By User Id
  router.delete("/deleteVideoFileById/:file_Id", Video.deleteVideoFileById); // Delete Files by Video Id
  //*****************************************************************************************************
};
