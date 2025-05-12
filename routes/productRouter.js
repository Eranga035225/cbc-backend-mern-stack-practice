import express from "express";
import { deleteProduct, getProducts, saveProducts } from "../controllers/productController.js";

const  productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/", saveProducts);
productRouter.delete("/:productId", deleteProduct);

export default productRouter;