import Review from "../models/review.js";


export async  function addReview(req,res){

  try{

    
  if(req.user == null){
    res.status(403).json({
      message: "Please login first"
    })
  }

  const [productId,rating,comment ] = req.body;

  if(!productId || !rating || !comment){
    res.status(400).json({
      message: "Missing required fields"
    })
  }

  const review = new Review(
    {

      productId : req.body.productId,
      userName : req.user.firstName + " " + req.user.lastName,
      rating : req.body.rating,
      comment : req.body.comment
    }
  )

 response =  await review.save();

 if(response){
  res.json({
    message: "Review added successfully"
  })
 }else{
  res.status(500).json({
    message: "Failed to add the review"
  })
 }

  }catch(err){

    res.status(500).json({
      message: "Failed to add the review",
      error : err
    })
 }



  }


export async function getAllReviews(req,res){
  try{
    
  if(req.user== null){
    res.status(403).json({
      message: "please login first"
    })

  }

  if(!req.user.role.toLowerCase() == "admin"){

    res.status(403).json({
      message: "You are not authorized to get all the reviews"
    })

  response = await Review.find();

  res.json(response)
  }





  }catch(e){

    res.status(500).json({
      message: "Failed to get all the reviews",
      error : e
    })  
  }
}




  










