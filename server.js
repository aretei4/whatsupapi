require("dotenv").config();
var service = require('./service/service')
const express = require("express");
const twilio = require("twilio");

const app = express();
const port = process.env.PORT || 3050;

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

app.post("/smsbk", (req, res) => {
	const { Body, From } = req.body;
	 const from = req.body.From;  // Sender's WhatsApp number
    const messageSid = req.body.MessageSid;  // Unique message ID
    console.log(`Received message: "${Body}" from ${From}`);
	const reque = service.parseRequest(req)
    // Process the message
    const replyMessage = service.processMessage(Body);

    // Create Twilio XML response
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(replyMessage);

    // Send XML response back to Twilio
    res.set("Content-Type", "text/xml");
    res.send(twiml.toString());
});

app.post("/api/sms", (req, res) => {
	const reque = service.parseRequest(req)
	const { Body, From } = req.body;
	const frm = req.body.From;  // Sender's WhatsApp number
	const messageSid = req.body.MessageSid;  // Unique message ID
	console.log(`Received message: "${Body}" from ${From}`);
	var replyMessage = "Don't recevie message please try once"
	if(Body){
		replyMessage = service.coversation(req)
	}
	
	console.log(" reply message "+replyMessage);
	// Create Twilio XML response
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(replyMessage);

    // Send XML response back to Twilio
    res.set("Content-Type", "text/xml");
    res.send(twiml.toString());
});
// Send an SMS via Twilio API
app.post("/api/smsbk", async (req, res) => {
    const from = req.body.From;
    const body = req.body.Body.trim().toLowerCase();

    if (body === "menu") {
        // Create Interactive Message JSON
        const interactiveMessage = {
            type: "interactive",
            interactive: {
                type: "button",
                body: { text: "Welcome! Please choose an option:" },
                action: {
                    buttons: [
                        { type: "reply", reply: { id: "order_food", title: "🍔 Order Food" } },
                        { type: "reply", reply: { id: "check_status", title: "📦 Check Status" } },
                        { type: "reply", reply: { id: "contact_support", title: "📞 Contact Support" } }
                    ]
                }
            }
        };

        try {
            await client.messages.create({
                from: twilioNumber,
                to: from,
                contentType: "application/json",
                content: JSON.stringify(interactiveMessage)
            });

            res.status(200).send("Interactive message sent.");
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).send("Failed to send message.");
        }
    } else {
        // Default response
        try {
            await client.messages.create({
                from: twilioNumber,
                to: from,
                body: "Type 'menu' to see the available options."
            });

            res.status(200).send("Default message sent.");
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).send("Failed to send message.");
        }
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
