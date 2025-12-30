import express from "express";
import { deleteProduct, getProductById, getProducts, saveProducts, searchProducts, updateProduct } from "../controllers/productController.js";

const  productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/", saveProducts);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct)
productRouter.get("/search/:query",searchProducts)
productRouter.get("/:productId",getProductById)

export default productRouter;