import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function getProducts(req,res){

  try{
    if(isAdmin(req)){
      const products = await Product.find();
      res.json(products);
    } else{
      const products = await Product.find({isAvailable: true});
      res.json(products);
    }
   }catch(err){
    res.json({
      message : "Failed to get the products",
      error : err
    });
   }

}

export function saveProducts(req,res){

  if(!isAdmin(req)){
    res.status(403).json({
      message : "You are not authorized to add products"
    })
    return
  }


  const product = new Product(
    req.body
  );


  product.save().then(()=>{

    res.json({
      message: "Product added successfully",
    })
  })
  .catch(()=>{
    res.json({
      message: "Failed to add the product",
    })
  })

}

export async function deleteProduct(req,res){
  if(!isAdmin(req)){
    res.status(403).json({
      message : "You are not authorized to delete products"
    })
    return 
  }
  try{
    await Product.deleteOne({productId : req.params.productId})

    res.json({
      message : "Product deleted successfully"
    })
  }catch(err){
    res.status(500).json({
      message : "Failed to delete the product",
      error : err
    })

  }
 




}