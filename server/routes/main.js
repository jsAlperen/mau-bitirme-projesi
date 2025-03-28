const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const moment = require("moment");
moment.locale("tr");
router.get("", async (req, res) => {
  try {
    let perPage = 6;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      data,
      current: page,
      moment,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/blog", async (req, res) => {
  try {
    let perPage = 4;
    let eski2 = 3;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const eski = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(eski2 * page - eski2)
      .limit(eski2)
      .exec();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("blog", {
      data,
      eski,
      moment,
      token: req.cookies.token,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/blog",
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    let perPage = 5;
    let eski2 = 3;
    let page = req.query.page || 1;
    const eski = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(eski2 * page - eski2)
      .limit(eski2)
      .exec();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    res.render("post", {
      token: req.cookies.token,
      moment,
      data,
      eski,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/search", async (req, res) => {
  try {
    console.log(req.body);
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    let perPage = 5;
    let eski2 = 3;
    let page = req.query.page || 1;
    const eski = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(eski2 * page - eski2)
      .limit(eski2)
      .exec();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    res.render("search", {
      data,

      moment,
      token: req.cookies.token,
      eski,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
