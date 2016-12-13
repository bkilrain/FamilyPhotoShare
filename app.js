const express = require('express');
const aws = require('aws-sdk');

const app = express();
const port = process.env.PORT || 3000;
const bucket = process.env.S3_BUCKET;

app.use(express.static('./public'));


app.listen(port);
console.log('listening on port', port);


app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log('error getting signed url: ', err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.send(returnData);
  });


})