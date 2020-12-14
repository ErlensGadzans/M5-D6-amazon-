const express = require("express");
const path = require("path");
const uniqid = require("uniqid");
const { check, validationResult } = require("express-validator");
const { readDB, writeDB } = require("../lib/utilities"); //i dont really understand what does it is for

const router = express.Router();

const usersFilePath = path.join(__dirname, "users.json");
const productsFilePath = path.join(__dirname, "../products/products.json");

router.get("/", async (req, res, next) => {
  try {
    const userDataBase = await readDB(usersFilePath);
    res.send(userDataBase);
  } catch (error) {
    error.httpStatusCode = 404;
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const userDataBase = await readDB(usersFilePath);
    const selecteduser = userDataBase.findIndex(
      (user) => user._id === req.params.userId
    );

    if (selecteduser !== -1) {
      res.status(201).send(userDataBase[selecteduser]);
    } else {
      const error = {};
      error.httpStatusCode = 404;
      error.message = "The user is not found!!";
      next(error);
    }
  } catch (error) {
    error.httpStatusCode = 500;
    next(error);
  }
});
// get users product and calculate total on the fly
router.get("/:userId/cart", async (req, res, next) => {
  try {
    const userDataBase = await readDB(usersFilePath);
    const selecteduser = userDataBase.findIndex(
      (user) => user._id === req.params.userId
    );

    if (selecteduser !== -1) {
      const user = userDataBase[selecteduser];

      //total

      const total = user.products.reduce((prev, curr) => prev + curr.price, 0);

      res.status(201).send({ products: user.products, total });
    } else {
      const error = {};
      error.httpStatusCode = 404;
      error.message = "The user is not found!!";
      next(error);
    }
  } catch (error) {
    error.httpStatusCode = 500;
    next(error);
  }
});
//aadd or remove porudct
router.post("/:userId/cart", async (req, res, next) => {
  try {
    // read database
    const userDataBase = await readDB(usersFilePath);
    const selecteduser = userDataBase.findIndex(
      (user) => user._id === req.params.userId
    );

    // if user found
    if (selecteduser !== -1) {
      const { product } = req.body;
      const user = userDataBase[selecteduser];
      // check if user has this product in his/her cart already
      const hasPoductInCartAlready = user.products.some(
        (p) => p._id === product._id
      );
      // if has
      if (hasPoductInCartAlready) {
        // remove
        userDataBase[selecteduser].products = user.products.filter(
          (product) => product._id !== product._id
        );
      } else {
        //add
        userDataBase[selecteduser].products = [...user.products, product];
      }
      //update db
      await writeDB(usersFilePath, userDataBase);
      res.status(201).send(userDataBase[selecteduser]);
    } else {
      const error = {};
      error.httpStatusCode = 404;
      error.message = "The user is not found!!";
      next(error);
    }
  } catch (error) {
    error.httpStatusCode = 500;
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const userDataBase = await readDB(usersFilePath);
  const newuser = { ...req.body, _id: uniqid(), products: [], total: 0 };
  userDataBase.push(newuser);
  await writeDB(usersFilePath, userDataBase);
  res.status(201).send(userDataBase);
});

module.exports = router;
