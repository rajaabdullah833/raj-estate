import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    listingType: {
      type: String,
      required: true,
    }, listingSubType: {
      type: String,
      required: true,
    }, name: {
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
      type: String, 
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
