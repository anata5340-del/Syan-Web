import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { jwtVerify } from "jose";

const router = createRouter<any, any>();

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { otp, token } = req.body; // Get OTP and email from the request body
    if (!token || !otp) {
      return res.status(400).json({
        success: false,
        error: "Missing OTP or Token",
      });
    }
    // Verify the JWT
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    if (payload.otp !== otp) {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }
    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);

    const errorMessage =
      error.name === "JWTExpired" ? "OTP expired" : "Invalid or tampered token";

    return res.status(400).json({ success: false, error: errorMessage });
  }
});
export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
