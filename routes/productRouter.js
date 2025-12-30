import express from "express";
import { deleteProduct, getProductById, getProducts, saveProducts, searchProducts, updateProduct } from "../controllers/productController.js";

const  productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/", saveProducts);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct)
productRouter.get("/:productId",getProductById)
productRouter.get("/search/:query",searchProducts)
export default productRouter;