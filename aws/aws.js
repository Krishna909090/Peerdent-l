const AWS = require("aws-sdk");
const env = require("dotenv")


let s3 = new AWS.S3({
    secretAccessKey:"k3nrG4/XqHfVz+Xq9WWM4YbNX1fSgJ0MtEhJNGpL",
    accessKeyId:"AKIASMHUNBJUO6FNEDF6",
    // region:"ap-south-1"
});

async function uploadFiles(userId, fileName, buffer){
    let params = {
        Bucket : "peerdent",
        Key: `uploads/${userId}/${fileName}`,
        Body:buffer
    }
    let res = await uploadtoAWS(params)
    return res;
}

async function uploadtoAWS(params){
    return new Promise((resolve, reject) => {
        let x = s3.upload(params, function(err, data){
            if (err) {
             
                throw err;
              }
              resolve(data);
            });
            return x;
          });
}



module.exports = {
    uploadFiles,
    uploadtoAWS,
}