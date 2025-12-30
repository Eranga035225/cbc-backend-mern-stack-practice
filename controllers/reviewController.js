import Review from "../models/review.js";

/* ================= ADD REVIEW ================= */
export async function addReview(req, res) {
  try {
    // AUTH CHECK
    if (!req.user) {
      return res.status(403).json({
        message: "Please login first",
      });
    }

    const { productId, rating, comment } = req.body;

    // VALIDATION
    if (!productId || !rating || !comment) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const review = new Review({
      productId,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      rating,
      comment,
    });

    await review.save();

    res.json({
      message: "Review added successfully",
    });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({
      message: "Failed to add the review",
      error: err.message,
    });
  }
}

/* ================= GET ALL REVIEWS (ADMIN) ================= */
export async function getAllReviews(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Please login first",
      });
    }

    if (req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to view reviews",
      });
    }

    const reviews = await Review.find().sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("Get reviews error:", err);
    res.status(500).json({
      message: "Failed to get reviews",
      error: err.message,
    });
  }
}
