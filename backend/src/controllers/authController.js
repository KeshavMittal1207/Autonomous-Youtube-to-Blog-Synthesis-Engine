import pendingUsersModel from "../model/pendingUsersModel.js";
import registeredUsersModel from "../model/registeredUsersModel.js";
import { transport } from "../service/nodemailerService.js";
import jwt from "jsonwebtoken";
import { passwordVerificationService } from "../service/passwordVerificationService.js";
import { OAuth2Client } from "google-auth-library";

export async function verificationController(req, resp) {
  try {
    const { auth } = req.body;
    if (auth == "local") {
      const { email, password } = req.body;
      const result2 = await registeredUsersModel.findOne({ email });
      if (result2)
        return resp.status(409).send({
          message: "Account Already Exists , Please try to Login",
          success: false,
        });
      const otp = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, 0);
      const pendingData = { email, password, otp };
      const result = await pendingUsersModel.create(pendingData);
      if (result) {
        const mailOptions = {
          from: "Autonomous Youtube To Blog Synthesis Engine Team",
          to: email,
          subject: "Otp Verification",
          text: `Hello ${email} , Your Otp for verification is ${otp}.`,
        };

        transport.sendMail(mailOptions, (error) => {
          if (error) {
            return resp
              .status(500)
              .send({ message: "Operation Failed", success: false });
          }
          return resp.status(200).send({ message: "Mail Sent", success: true });
        });
      } else {
        return resp
          .status(400)
          .send({ message: "Data Not Saved in Database", success: false });
      }
    } else {
      const client = new OAuth2Client(process.env.CLIENT_ID);
      const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
      const { token } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
      });
      const { email, name } = ticket.getPayload();
      const result2 = await registeredUsersModel.findOne({ email });
      if (result2) {
        return resp.status(400).send({
          message: "Your Account Alreasy Exists.Please Login",
          success: false,
        });
      }
      const userName =
        email.split("@")[0] +
        Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, 0);
      const result = await registeredUsersModel.create({
        email,
        auth,
        userName,
        name,
      });
      if (result) {
        const payload = { email, userName };
        jwt.sign(
          payload,
          JWT_SECRET_KEY,
          { expiresIn: "10d" },
          (error, token) => {
            if (error)
              return resp.status(500).send({ message: error, success: false });

            return resp.status(200).send({
              message: "Account Created Successfully",
              payload,
              token,
              success: true,
            });
          },
        );
      } else {
        return resp
          .status(400)
          .send({ message: "Account Not Created", success: false });
      }
    }
  } catch (error) {
    return resp.status(500).send({ message: error.message, success: false });
  }
}

export async function signUpController(req, resp) {
  try {
    const { email, otp } = req.body;
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const result = await pendingUsersModel.findOne({ email });
    if (!result)
      return resp
        .status(404)
        .send({ message: "Unauthorized User", success: false });
    if (result.otp != otp)
      return resp
        .status(404)
        .send({ message: "Unauthorized OTP", success: false });
    const password = result.password;
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, 0);
    const userName = email.split("@")[0] + randomNum;
    const userData = { email, password, userName };
    const result2 = await registeredUsersModel.create(userData);
    if (!result2)
      return resp
        .status(500)
        .send({ message: "Internal Server Error", success: false });

    const payload = { email, userName };
    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "10d" }, (error, token) => {
      if (error)
        return resp
          .status(500)
          .send({ message: `JWT Error: ${error}`, success: false });
      console.log(token);
      return resp.status(201).send({
        message: "User Account Created Successfully",
        token,
        payload,
        success: true,
      });
    });
  } catch (error) {
    return resp
      .status(500)
      .send({ message: `Error Catched: ${error}`, success: false });
  }
}

export async function loginController(req, resp) {
  try {
    const { auth } = req.body;
    if (auth == "local") {
      const { email, password } = req.body;
      const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
      const result = await registeredUsersModel.findOne({ email });
      if (result) {
        const verdict = await passwordVerificationService(
          password,
          result.password,
        );
        if (verdict == true) {
          const payload = { email, userName: result.userName };
          jwt.sign(
            payload,
            JWT_SECRET_KEY,
            { expiresIn: "10d" },
            (error, token) => {
              if (error)
                return resp
                  .status(500)
                  .send({ message: `JWT Error:${error}`, success: false });
              return resp.status(200).send({
                message: "Account Exists",
                token,
                payload,
                success: true,
              });
            },
          );
        } else {
          return resp
            .status(500)
            .send({ message: "Wrong Password", success: false });
        }
      } else {
        return resp
          .status(500)
          .send({ message: "Account Doesn't Exists", success: false });
      }
    } else {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
      const { token } = req.body;
      const ticket = await client.verifyIdToken({
        idToken : token,
        audience : process.env.GOOGLE_CLIENT_ID,
      });
      const { email, name } = ticket.getPayload();
      const result = await registeredUsersModel.findOne({ email });
      if (result) {
        if (result.auth == "local")
          return resp.status(400).send({
            message:
              "This email is registered with a password. Please log in using your email and password",
            success: false,
          });
        const payload = { email, userName: result.userName };
        jwt.sign(
          payload,
          JWT_SECRET_KEY,
          { expiresIn: "10d" },
          (error, token) => {
            if (error) {
              return resp.status(500).send({ message: error, success: false });
            }
            return resp.status(200).send({
              message: "Account Verified Successfully",
              success: true,
              payload,
              token
            });
          },
        );
      } else {
        const userName =
          email.split("@")[0] +
          Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, 0);
        const result2 = await registeredUsersModel.create({
          email,
          name,
          userName,
          auth,
        });
        if (result2) {
          const payload = { email, userName };
          jwt.sign(payload,JWT_SECRET_KEY,{ expiresIn: "10d" },(error, token) => {
              if (error) {
                return resp
                  .status(500)
                  .send({ message: error, success: false });
              }
              return resp.status(200).send({
                message: "Account Created Successfully",
                success: true,
                payload,
                token,
              });
            },
          );
        } else {
          return resp.status(500).send({
            message: "Account Not Created",
            success: false,
          });
        }
      }
    }
  } catch (error) {
    return resp
      .status(500)
      .send({ message: `Error Catched:${error}`, success: false });
  }
}
