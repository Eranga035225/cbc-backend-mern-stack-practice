import Review from "../models/review.js";

export async function addReview(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Please login first",
      });
    }

    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const review = new Review({
      productId,
      userName: req.user.firstName + " " + req.user.lastName,
      rating,
      comment,
    });

    await review.save();

    res.json({
      message: "Review added successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to add the review",
      error: err.message,
    });
  }
}

export async function getAllReviews(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Please login first",
      });
    }

    if (req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to get all reviews",
      });
    }

    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);

  } catch (err) {
    res.status(500).json({
      message: "Failed to get reviews",
      error: err.message,
    });
  }
}
