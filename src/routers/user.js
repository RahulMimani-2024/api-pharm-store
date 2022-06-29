const multer = require("multer");
const express = require("express");
const router = new express.Router();
const { sendWelcomeMail, deleteAccount ,sendQuery} = require("../emails/account");
const Users = require("../models/user");
const auth = require("../middleware/auth");
//users CRUD operations
router.post("/users", async (req, res) => {
  const user = new Users(req.body);
  try {
    const token = await user.generateToken();
    await user.save();
    await sendWelcomeMail(user);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(String(error));
  }
});

router.post("/mail" ,async (req,res) => {
  try{
    await sendQuery(req.body);
    res.status(200).send();
  }catch(e){
    res.status(400).send();
  }
})

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// get cart details
router.get("/users/me/cart", auth, async (req, res) => {
  res.status(201).send(req.user.cart);
});
router.post("/users/me/cart/add", auth, async (req, res) => {
  const id = req.body.productId;
  const count = req.body.count;
  try{
    req.user.cart.forEach( (item) => {
      if(item.productId === id){
        throw new Error();
      }
    })
    req.user.cart = req.user.cart.concat({ productId : id, count });
    await req.user.save();
    res.status(200).send();
  }catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/me/cart/update", auth, async (req, res) => {
  req.user.cart.forEach((element) => {
    if (element.productId === req.body.productId) {
      element.count = req.body.count;
    }
  });
  await req.user.save();
  res.status(200).send();
});
router.post("/users/me/cart/delete", auth, async (req, res) => {
  req.user.cart.forEach((element) => {
    if (element.productId === req.body.productId) {
      element.remove();
    }
  });
  await req.user.save();
  res.status(200).send();
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await Users.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(201).send(user);
    console.log(user.name);
  } catch (error) {
    res.status(500).send(error);
  }
});

//updating my profile
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const updates_available = ["name", "age", "password", "email"];
  const isValidUpdate = updates.every((update) => {
    return updates_available.includes(update);
  });
  if (!isValidUpdate) {
    return res.status(400).send("Update Invalid");
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.status(201).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//deleting a user
router.delete("/users/me", auth, async (req, res) => {
  const _id = req.user._id;
  try {
    await req.user.remove();
    deleteAccount(req.user);
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

//login logout functionalities
router.post("/users/login", async (req, res) => {
  try {
    const user = await Users.findAndVerify(req.body.email, req.body.password);
    const token = await user.generateToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(404).send(String(error));
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send("Logged Out Sucessfully");
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("loggged out from all devices");
  } catch (e) {
    res.status(500).send();
  }
});

//uploading files
//creatig a multer instance `upload`
const upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return callback(new Error("file must be in jpg format"));
    }
    callback(undefined, true);
  },
});
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    if (req.file === undefined) {
      return res.status(404).send("must provide a file");
    }
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send("success");
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  if (req.user.avatar === undefined) {
    return res.send("no profile to be deleted");
  }
  req.user.avatar = undefined;
  await req.user.save();
  res.send("deleted succesfully");
});

//accessing the profile with id
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-type", "image/jpg");
    res.send(user.avatar);
    res.send("Dsadsad");
  } catch (e) {
    res.status(404).send();
  }
});
module.exports = router;
