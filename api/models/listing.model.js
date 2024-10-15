import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    lounge: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: String, // Or change to Number based on your needs
      required: true,
    },
    parking: {
      type: Boolean,
    },
    pool: {
      type: Boolean,
    },
    garden: {
      type: Boolean,
    },
    gym: {
      type: Boolean,
    },
    balcony: {
      type: Boolean,
    },
    gatedCommunity: {
      type: Boolean,
    },
    securityServices: {
      type: Boolean,
    },
    conciergeServices: {
      type: Boolean,
    },
    propertyAge: {
      type: String,
      required: true,
    },
    propertyCondition: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [String], // Stores multiple image URLs
      required: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Listing', listingSchema);
