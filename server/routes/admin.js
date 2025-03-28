const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
moment.locale("tr");
const adminLayout = "../views/layouts/admin";
const jwtSecret = "atlasfit";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({
        message:
          "Yetkilendirilmemiş Hesap. Lütfen iletişime geçin: alperenvural10@gmail.com",
      });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res
      .status(401)
      .json({
        message:
          "Yetkilendirilmemiş Hesap. Lütfen iletişime geçin: alperenvural10@gmail.com",
      });
  }
};

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Admin Acıklama",
    }; //şu testi de bi ara düzelt

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Kullanıcı Adı hatalı." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Şifre hatalı." });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("admin/dashboard", {
      username: res.locals.username,
      data,
      count: count,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const data = await Post.find();
    res.render("admin/add-post", {
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/dashboard", authMiddleware, async (req, res) => {
  try {
    try {
      console.log(req.body);
      const newPost = new Post({
        title: req.body.title,
        aciklama: req.body.description2,
        body: req.body.description,
        img: req.body.image,
      });

      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const data = await Post.findOne({ _id: req.params.id });
    let perPage = 3;
    let page = req.query.page || 1;

    const data2 = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("admin/edit-post", {
      data,
      data2,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      aciklama: req.body.description2,
      img: req.body.image,
      body: req.body.description,
      updatedAt: Date.now(),
    });

    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "Kullanıcı Oluşturuldu", user });
    } catch (error) {
      if (error.code === 11000) {
        res
          .status(409)
          .json({ message: "Bu kullanıcı zaten kullanılmakta. Code 11000" });
      }
      res.status(500).json({ message: "Sunucu Hatası" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});
module.exports = router;
