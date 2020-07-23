const router = require("express").Router();
const User = require("../models/user.model");
// const List = require("../models/list.model");

router.get("/home", async (req, res) => {
    console.log("Req User", req.user);
    try {
      //get all lists
      let lists = await List.find()
        .populate("lists");
  
      // console.log(restaurants);
      res.render("/home", { lists });
    } catch (error) {
      console.log(error);
    }
  });


module.exports = router;