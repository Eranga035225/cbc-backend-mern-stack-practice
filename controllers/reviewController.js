export async  function addReview(req,res){

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








}