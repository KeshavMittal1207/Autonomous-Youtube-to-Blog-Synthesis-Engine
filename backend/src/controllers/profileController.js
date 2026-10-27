import { imageKit } from "../config/imageKitConfig.js";
import registeredUsersModel from "../model/registeredUsersModel.js";
import historyModel from "../model/historyModel.js";
import fs from "fs";

export async function profileController(req, resp) {
  try {
    const { email } = req.params;
    const result = await registeredUsersModel.findOne({ email }).populate("history");
    if (result) {
      return resp
        .status(200)
        .send({
          message: "Profile Data Fetched from Database",
          result,
          success: true,
        });
    }
    return resp
      .status(400)
      .send({ message: "Data Not Found in Database", success: false });
  } catch (error) {
    return resp.status(500).send({ message: error.message || error, success: false });
  }
}

export async function editProfileController(req, resp) {
  try {
    const { email } = req.params;
    const updatedData = req.body;
    const img = req.file;
    if (img) {
      const imgPath = await imageKit.files.upload({
        file: fs.createReadStream(img.path),
        fileName: img.filename,
      });
      const imgUrl = imageKit.helper.buildSrc({
        urlEndpoint: process.env.IMAGEKIT_URLENDPOINT,
        src: imgPath.filePath,
      });

      updatedData.profilePic = imgUrl;
      fs.unlink(img.path, (error) => {
        if (error) console.log(error);
      });
    }

    const result = await registeredUsersModel.updateOne(
      { email },
      { $set: updatedData }
    );

    if (result.matchedCount !== 0) {
      return resp
        .status(200)
        .send({
          message: "Profile Updated Successfully in Database",
          success: true,
        });
    }

    if (result.modifiedCount !== 0) {
      return resp
        .status(404)
        .send({
          message: "No Changes made in Profile",
          success: false,
        });
    }

    return resp
      .status(404)
      .send({ message: "Profile Not Updated in Database", success: false });
  } catch (error) {
    console.log(error);
    return resp.status(500).send({ message: error.message || error, success: false });
  }
}
