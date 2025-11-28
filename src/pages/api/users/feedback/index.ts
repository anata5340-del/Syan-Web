import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
const SibApiV3Sdk = require("sib-api-v3-typescript");

const router = createRouter<any, any>();

// Initialize the Brevo API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { userId, id, message, type } = req.body;

    // Validate required fields
    if (!userId || !id || !message || !type) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Create the email object
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = `New Feedback from User: ${userId}`;
    sendSmtpEmail.htmlContent = `
      <p><strong>For ${
        type === "question" ? "Question" : type === "note" ? "Note" : "Video"
      }:</strong> ${id}</p>
      <p><strong>Message:</strong>${message}</p>
    `;
    sendSmtpEmail.sender = {
      name: "SYAN Feedback",
      email: "info@syanacademy.com", // Replace with a verified sender email
    };
    sendSmtpEmail.to = [{ email: "feedback@syanacademy.com" }];

    // Send the email
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return res.json({
      success: true,
      message: "Feedback sent successfully",
    });
  } catch (error) {
    console.error("Error sending feedback:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to send feedback" });
  }
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
