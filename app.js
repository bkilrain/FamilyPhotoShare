const express = require('express');
const aws = require('aws-sdk');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const S3_BUCKET = process.env.S3_BUCKET;

app.use('/', express.static(path.join(__dirname, '/public')));

app.set('views', './public/views');
app.set('view engine', 'ejs');
// app.engine('ejs', require('ejs').renderFile);

app.listen(port);
console.log('listening on port', port);

const s3 = new aws.S3();

app.get('/sign-s3', (req, res) => {
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
});

app.get('/batchList', (req, res) => {
  const batchListParams = {
    Bucket: S3_BUCKET,
    Delimiter: '/'
  };
  s3.listObjects(batchListParams, (err, data) => {
    if (err) {
      console.log('error getting batch list:', err);
      return res.end();
    }
    res.send(data);
  });

});

app.get('/batch/:name', (req, res) => {
  const batchName = req.params.name;
  const batchListParams = {
    Bucket: S3_BUCKET,
    Prefix: batchName
  }
  s3.listObjects(batchListParams, (err, data) => {
    if (err) {
      console.log('error retrieving batch:', err);
      return res.end();
    }
    res.render('batch', {
      data: data, 
      urlPath: `https://${S3_BUCKET}.s3.amazonaws.com/`,
      title: batchName
    });
  })
});

