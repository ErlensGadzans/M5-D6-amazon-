const express = require("express");
const { readDB } = require("../lib/utilities"); //i dont really understand what does it is for

const router = express.Router();

const cartsFilePath = path.join(__dirname, "carts.json");
const productsFilePath = path.join(__dirname, "../products/products.json");

router.get("/", async (req, res, next) => {
  try {
    const cartDataBase = await readDB(cartsFilePath);
    if (cartDataBase.length > 0) {
      res.status(201).send(cartDataBase);
    } else {
      const error = {};
      error.httpStatusCode = 404;
      error.message = "The cart is empty!";
      next(error);
    }
  } catch (error) {
    error.httpStatusCode = 404;
    next(error);
  }
});

module.exports = router;
