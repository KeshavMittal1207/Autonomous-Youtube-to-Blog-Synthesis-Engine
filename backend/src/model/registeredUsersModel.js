import mongoose from "mongoose";

const registeredUsersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique:true
    },
    userName: {
      type: String,
      required: true,
      trim:true
    },
    password: {
      type: String,
      required: function () {
        return this.auth === "local";
      },
    },
    name:{
      type:String,
      required:true,
      default:"Anonymous_User"
    },
    profilePic:{
       type:String,
       required:true,
       default:"https://ik.imagekit.io/priyanshu61103/profile-logo.png?updatedAt=1781732360830"
    },
    auth: {
      type: String,
      required: true,
      enum: ["local", "google"],
      default: "local",
    },
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserHistory",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const registeredUsersModel = mongoose.models.RegisteredUsers || mongoose.model("RegisteredUsers", registeredUsersSchema);

export default registeredUsersModel;
