const express = require("express");
const reviewsRoutes = require("./reviews");
const usersRoutes = require("./users");
const fileRoutes = require("./files/upload");
const productsRouter = require("./products");
const cors = require("cors");
const { join } = require("path");
const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  badRequestHandler,
  catchAllHandler,
} = require("./lib/errorHandling");

const server = express();
const port = 3077;

server.use(cors());
server.use(express.json());

server.use(
  "/images",
  express.static(join(__dirname, "../public/img/products"))
);

server.use("/products", productsRouter);
server.use("/users", usersRoutes);
server.use("/reviews", reviewsRoutes);
server.use("/files", fileRoutes);

server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(badRequestHandler);
server.use(catchAllHandler);

server.listen(port, () => {
  console.log("Server running away on port: ", port);
});
