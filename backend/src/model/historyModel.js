import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    blogDraft: {
      type: String,
      required: true,
    },
    readabilityScore: {
      type: Number,
      default: 0,
    },
    seoScore: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: "",
    },
    evaluation: {
      type: String,
      default: "approved",
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const historyModel = mongoose.models.UserHistory || mongoose.model("UserHistory", historySchema);

export default historyModel;
