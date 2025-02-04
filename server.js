var express = require('express');
const bodyParser = require('body-parser')
var cors = require('cors');
const multer = require('multer');
var fs = require("fs");
var path = require("path");
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    var directory = "uploads";
    if (fs.existsSync(directory) == false) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, path.basename(file.originalname))
  }
});

var upload = multer({ storage: storage });

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    return next(error)
  }
  res.send(
    {
      name: file.filename,
      type: file.mimetype,
      size: file.size
    }
  )
})






const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
