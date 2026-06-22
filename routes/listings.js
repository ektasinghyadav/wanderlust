const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../utils/cloudConfig");
const upload = multer({ storage });
const listingController = require("../controllers/listings");
const reviewController = require("../controllers/reviews");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

router.get("/", wrapAsync(listingController.index));
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.post("/", isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createListing));
router.get("/:id", wrapAsync(listingController.showListing));
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.updateListing));
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Review routes
router.post("/:id/reviews", isLoggedIn, wrapAsync(reviewController.createReview));
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
