import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import axios from "axios";
import { recommendProductsForUser } from "./userRec.js";
import { recommendSimilarProducts } from "./productRec.js";

const app = express();
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "*/*" }));

app.get("/recommendations/user", async (req, res) => {
  const userId = req.query.userId;
  axios.get("http://localhost:8080/transactions").then((response) => {
    const transactions = response.data;
    const sanitized = transactions.map((transaction) => ({
      userId: transaction.person.id,
      productId: transaction.product.id,
    }));
    const recs = recommendProductsForUser(userId, sanitized, 5);
    axios.get("http://localhost:8080/products").then((response) => {
      const products = response.data;
      const productMap = {};
      products.forEach((product) => {
        productMap[product.id] = product;
      });
      res.send(recs.map((rec) => productMap[rec]));
    });
  });
});

app.get("/recommendations/product", (req, res) => {
  const productId = parseInt(req.query.productId);
  axios.get("http://localhost:8080/transactions").then((response) => {
    const transactions = response.data;

    const sanitized = transactions.map((transaction) => ({
      userId: transaction.person.id,
      productId: transaction.product.id,
    }));
    const recs = recommendSimilarProducts(productId, sanitized, 5);
    axios.get("http://localhost:8080/products").then((response) => {
      const products = response.data;
      const productMap = {};
      products.forEach((product) => {
        productMap[product.id] = product;
      });
      res.send(recs.map((rec) => productMap[rec]));
    });
  });
});

app.listen(8082);
console.log(`App listening on port ${8082}`);
