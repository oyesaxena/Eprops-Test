require('dotenv').config()
const AWSSecretKey=process.env.AWS_SECRET_KEY
const AWSAccessKey=process.env.AWS_ACCESS_KEY
const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
var multer  = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const app=express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

aws.config.update({
    secretAccessKey: AWSSecretKey,
    accessKeyId: AWSAccessKey,
    region: 'ap-south-1'
});

s3 = new aws.S3();
  var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'propssol',
        key: function (req, file, cb) {
            // var newFileName = Date.now() + "-" + file.originalname
            console.log(file);
            cb(null,'foo-folder/' + Date.now() + '_' +  file.originalname); //use Date.now() for unique file keys
        }
    })
});

mongoose.connect('mongodb+srv://oyesaxena:abhi@testing.qrypk.mongodb.net/test?retryWrites=true',{useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:true });

const imageSchema= new mongoose.Schema({
    images:[]
})
const Image = mongoose.model("Image", imageSchema);

app.get("/",async (req,res)=>{
    Image.find({},function(err,images){
        res.render("home",{
            images:images
        })
    })
    
})

app.post("/upload", upload.array("files",50),(req,res)=>{
    const image= new Image({
        images:req.files
    })
    image.save((err)=>{
        if(err){
            console.log(err)
            res.send("try again")
        }
        else{
            res.redirect("/")
        }
    })

})



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));