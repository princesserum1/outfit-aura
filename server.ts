import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // API Route for sending Twilio SMS notifications
  app.post("/api/send-sms", async (req: any, res: any) => {
    const { to, orderId, status, customerName, total } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    const cleanTo = to.trim();
    const messageBody = `Aura Outfit Order Update! Dear ${customerName || "Customer"}, your order #${orderId} status has changed to: "${status}". Total: Rs. ${total?.toLocaleString() || "0"}. Thank you for shopping with us!`;

    // Gracefully handle missing Twilio keys
    if (!sid || !token || !fromNumber) {
      console.warn("Twilio credentials missing in environment variables. SMS simulation mode triggered.");
      return res.json({
        success: true,
        simulated: true,
        message: "SIMULATED SMS (Missing Twilio secrets in Settings): " + messageBody,
        warning: "To send actual SMS, please configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in the Secrets / Settings panel."
      });
    }

    try {
      // Lazy-load twilio to prevent module-level crashes
      const twilioModule = await import("twilio");
      const client = twilioModule.default(sid, token);

      const message = await client.messages.create({
        body: messageBody,
        from: fromNumber,
        to: cleanTo
      });

      console.log(`Twilio SMS sent successfully! SID: ${message.sid}`);
      return res.json({
        success: true,
        simulated: false,
        messageSid: message.sid,
        message: "SMS notification sent successfully!"
      });
    } catch (error: any) {
      console.error("Twilio API returned an error:", error);
      return res.status(500).json({
        error: "Twilio SMS Delivery failed",
        details: error.message || String(error)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
