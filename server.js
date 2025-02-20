require("dotenv").config();
var service = require('./service/service')
const express = require("express");
const twilio = require("twilio");

const app = express();
const port = process.env.PORT || 8080;

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handle incoming messages from Twilio
app.post("/subu/sms", (req, res) => {
    const { Body, From } = req.body;
    console.log(`Received message: "${Body}" from ${From}`);
		 console.log(service.processMessage(Body))
    const twiml = new twilio.twiml.MessagingResponse();
	

  
  twiml.message(`You subash said: "${Body}"`);

    res.type("text/xml").send(twiml.toString());
});

app.post("/sms", (req, res) => {
	  console.log(`📩 Message from: ${req}`);
    const from = req.body.From;  // Sender's WhatsApp number
    const body = req.body.Body;  // Message text
    const messageSid = req.body.MessageSid;  // Unique message ID

    console.log(`📩 Message from: ${from}`);
    console.log(`💬 Message: ${body}`);
    console.log(`🔹 Message SID: ${messageSid}`);

    // Process the message
    const replyMessage = service.processMessage(body);

    // Create Twilio XML response
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(replyMessage);

    // Send XML response back to Twilio
    res.set("Content-Type", "text/xml");
    res.send(twiml.toString());
});

// Send an SMS via Twilio API
app.post("/send-sms", async (req, res) => {
    const { to, message } = req.body;

    try {
        const response = await client.messages.create({
            body: message,
            from: twilioNumber,
            to: to,
        });

        res.json({ success: true, sid: response.sid });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
