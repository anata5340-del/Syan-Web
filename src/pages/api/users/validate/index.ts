import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import crypto from "crypto";
import { SignJWT } from "jose";
const SibApiV3Sdk = require("sib-api-v3-typescript");

const router = createRouter<any, any>();

// Initialize the Brevo API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, // Pass the key type
  process.env.BREVO_API_KEY! // Pass the actual API key
);

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { type, email } = req.body; // Get email and type (e.g., "email", "password")
    if (!email || !type) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Create a JWT token for the OTP
    const token = await new SignJWT({ otp })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("5m") // OTP valid for 5 minutes
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    // Create the email object for Brevo
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = `SYAN OTP Code`;
    sendSmtpEmail.htmlContent = `<strong>Your OTP code for ${type} update is: ${otp}</strong>`;
    sendSmtpEmail.sender = {
      name: "SYAN",
      email: "info@syanacademy.com", // Replace with your verified sender email
    };
    sendSmtpEmail.to = [{ email }];

    // Send the email
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      token,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to send OTP" });
  }
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
