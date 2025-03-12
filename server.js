require("dotenv").config();
var service = require('./service/service')
var hotel = require('./service/hotelService')
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
const userSessions = {};

// Handle incoming messages from Twilio
app.post("/api/sms", (req, res) => {
    const { Body, From } = req.body;
    console.log(`Received message: "${Body}" from ${From}`);
	
	timeOut(req.body.To)
			
		 console.log(service.processMessage(Body))
    const twiml = new twilio.twiml.MessagingResponse();
		const reque = service.parseRequest(req)
	hotel.processHotelReq(reque,twiml)

  
 // twiml.message(`You subash said: "${Body}"`);

    res.type("text/xml").send(twiml.toString());
});


// Endpoint to send a WhatsApp message
app.post('/api/send-sms', async (req, res) => {
    const toNumber = req.body.to; // The recipient's WhatsApp number
    const messageBody = req.body.message; // The message to send

    try {
        // Send the WhatsApp message
        const message = await client.messages.create({
            body: messageBody,
            from: twilioNumber, // Replace with your Twilio WhatsApp number
            to: `whatsapp:${toNumber}`
        });

        console.log(`Message sent to ${toNumber}: ${message.sid}`);
        res.status(200).send(`Message sent: ${message.sid}`);
    } catch (error) {
        console.error(`Error sending message: ${error.message}`);
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.post("/api/smsbk", (req, res) => {
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

function timeOut(userNumber){

// Store the session with a timestamp
			userSessions[userNumber] = {
				lastMessageSentAt: new Date(),
				timeout: 60 // 10 minutes (600 seconds)
			};
			
    // Set a timeout to check for user response
    setTimeout(async () => {
        if (userSessions[userNumber] && !userSessions[userNumber].responded) {
            console.log(`User ${userNumber} did not respond in time. Sending timeout message.`);

            // Send a timeout message
           // await client.messages.create({
            //    body: 'Sorry, you didn\'t respond in time. Please try again later.',
             //   from: 'whatsapp:'+twilioNumber,
             //   to: userNumber
           // });

            // Clean up the session
            delete userSessions[userNumber];
        }
    }, userSessions[userNumber].timeout * 1000);

}
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
