const express = require("express");
const router = new express.Router();
const multer = require("multer");
const productAuth = require("../middleware/productAuth.js")
const Products = require("../models/products");
router.get("/products", async (req, res) => {
  try {
    const allProducts = await Products.find({});
    res.status(201).send(allProducts);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.post("/products/add", async (req, res) => {
    const product = new Products({
        ...req.body,
    });
    try {
        await product.save();
        req.product = product
        res.status(201).send(req.body);
    } catch (e) {
        res.status(404).send(e);
    }
});
const upload = multer({
  limits: {
    filesize: 1000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return callback(new Error("file must be in jpg format"));
    }
    callback(undefined, true);
  }
});
router.get('/products/me' , async (req,res) =>{
    const product = await Products.find({
        id : req.body.id,
    });
    req.product = product;
    res.status(201).send();
})

router.post('/products/me/avatar' , upload.single('avatar') , async (req,res)=>{
    
    Products.findOne({
        id : req.body.id,
    } ,async (error,doc) => {
        if(error){
            throw new Error("Product not found");
        }
        try{
            const product = doc;
            product.avatar = req.file.buffer;
            await product.save();
            res.send('successfully uploaded');
        }
        catch(e){
            res.status(400).send(e);
        }
    })
},(error,req,res,next) =>{
    if(error) {
        res.status(400).send({error :error.message});
    }
    next();
});

//accessing the image 
router.get('/products/:id/avatar',async (req,res)=>{
    try{
      const product = await Products.findById(req.params.id);
      if(!product || !product.avatar){
        throw new Error();
      }
      res.set('Content-type' , 'image/jpg');
      res.send(product.avatar);
    }catch(e) {
      res.status(404).send();
    }
  })


module.exports = router;
