const express = require("express");
require("./db/mongoose");
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const productRouter = require('./routers/products');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT;
const multer = require('multer');
const upload = multer({
  dest : 'images'
})

app.post('/upload' ,upload.single('upload'),(req,res) =>{
  res.send()
})



app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(productRouter);
// Listening
app.listen(port, () => {
  console.log("listening on port", port);
});
