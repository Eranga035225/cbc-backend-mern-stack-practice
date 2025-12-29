import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin } from "./userController.js";


export async function  createOrder(req,res){
  //get user info
  if(req.user == null){
    res.status(403).json({
      message : "Please log in and try again"

    }
   )
   return;
  }
  //add current user name if not provided
  const orderInfo = req.body;

  if(orderInfo.name == null){
    orderInfo.name = req.user.firstName + " " + req.user.lastName;
   }
  //generate order id  CBC00001
  let orderId = "CBC00001";

  const lastOrder = await Order.find().sort({date : -1}).limit(1); //get last order

  if(lastOrder.length > 0){ 
    const lastOrderId = lastOrder[0].orderId;
    const lastOrderNumberString = lastOrderId.replace("CBC", "");//remove cbc part
    const lastOrderNumber = parseInt(lastOrderNumberString); //convert to number
    const newOrderNumber = lastOrderNumber + 1;
    const newOrderNumberString = String(newOrderNumber).padStart(5, '0'); //add leading zeros
    orderId = "CBC" + newOrderNumberString;

  }
  try{

    let total = 0;
    let labeledTotal = 0;
    const products = [];

    for(let i=0;i<orderInfo.products.length;i++){
      const item = await Product.findOne({productId : orderInfo.products[i].productId});
      if(item==null){
        res.status(404).json({
          message : "Product with product id " + orderInfo.products[i].productId + " not found"
        })
        return;
      }

      if(item.isAvailable == false){
        res.status(404).json({
          message : "Product with product id " + orderInfo.products[i].productId + " is not available right now"
        })
        return;
      }

      products[i] = {
        productInfo : {
          productId : item.productId,
          name : item.name,
          altNames : item.altNames,
          description : item.description,
          images : item.images, 
          labeledPrice : item.labeledPrice,
          price : item.price,
        },
        quantity : orderInfo.products[i].quantity
      }
      total += item.price * orderInfo.products[i].quantity;
      labeledTotal += item.labeledPrice * orderInfo.products[i].quantity; 
      
    }

  //create order object

  const order = new Order({
    orderId : orderId,
    name : orderInfo.name,
    email : req.user.email,
    address : orderInfo.address,
    phone : orderInfo.phone,
    status : "pending",
    total : total,
    labeledTotal : labeledTotal,
    products : products
  });

    const createdOrder = await order.save();
     res.json({
       message : "Order created successfully",
       order : createdOrder

     })
  }catch(err){
    res.status(500).json({
      message : "Failed to create the order",
      error : err
    })

  }

 
}


export async function getOrders(req,res){
  if(req.user == null){
    res.status(403).json({
      message : "Please log in and try again"
    })
    return

  }

  try{
    if(req.user.role == 'admin'){
      const orders = await Order.find();
      res.json(orders);
    }else{
      const orders = await Order.find({email : req.user.email});
      res.json(orders);

    }

  } catch(err){
    res.status(500).json({
      message : "Failed to get the orders",
      error : err
    })
  }





  }
  

  export async function updateOrderStatus(req,res){
    if(!isAdmin(req)){
      res.status(403).json({
        message : "You are not authorized to update orders"
      })
      return
    }
   
    try{
       const orderId = req.params.orderId;
       const status = req.params.status;

       await Order.updateOne(
        {
          orderId : orderId
        },
        {
          status : status  //details thta should be updated

        }
       )
       res.json({
         message : "Order status updated successfully"
       })

    }catch(e){
      res.status(500).json({
        message : "Failed to update the order status",
        error : e
      })
      return;



    }

    
  }





