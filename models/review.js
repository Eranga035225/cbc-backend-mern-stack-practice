import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({

    productId: {
      type: String,
      required: true,
    },
  
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
   
  },

);

export default mongoose.model("Review", reviewSchema);























