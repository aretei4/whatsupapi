const express = require("express");
const bodyParser = require("body-parser");
const Twilio = require('twilio');

var service = require('./service/service')
var constants = require('./service/constants')
const app = express();
app.use(bodyParser.json()); // Parse incoming JSON
let bookings = {};
app.post("/sms", (req, res) => {
    console.log("Received payload:", req.body);
var request = service.parseRequest(req)
var defaultResponse = constants.getMenList(request);
    // Construct JSON response
    const response = {
        messages: [
            defaultResponse
        ]
    };
	 res.setHeader("Content-Type", "application/json");
   res.status(200).send(JSON.stringify(response));
});

app.post('/api/sms', (req, res) => {
    const from = req.body.From; // User's phone number
    const body = req.body.Body; // User's response

    const twiml = new Twilio.twiml.MessagingResponse();

    // Handle the user's response
    if (body.trim() === '1') {
        // Option 1: Check room availability
        twiml.message('Rooms are available for the following dates: 2023-11-01 to 2023-11-10. Reply with "2" to book a room.');
    } else if (body.trim() === '2') {
        // Option 2: Book a room
        twiml.message('Please provide your check-in and check-out dates (e.g., "2023-11-01 to 2023-11-05"):');
        bookings[from] = { status: 'awaiting_dates' }; // Track the user's state
    } else if (bookings[from] && bookings[from].status === 'awaiting_dates') {
        // User is providing dates for booking
        const dates = body.trim();
        bookings[from] = { dates, status: 'booked' };
        twiml.message(`Your room has been booked for ${dates}. Thank you!`);
    } else if (body.trim() === '3') {
        // Option 3: Cancel a booking
        if (bookings[from] && bookings[from].status === 'booked') {
            twiml.message(`Your booking for ${bookings[from].dates} has been canceled.`);
            delete bookings[from]; // Remove the booking
        } else {
            twiml.message('You have no active bookings to cancel.');
        }
    } else if (body.trim() === '4') {
        // Option 4: Contact support
        twiml.message('Please describe your issue, and our support team will get back to you shortly.');
    } else {
        // Default response for invalid options
        twiml.message(`Invalid option. Please reply with:
1. Check room availability
2. Book a room
3. Cancel a booking
4. Contact support`);
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

// Start the server
const PORT = process.env.PORT || 3050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
