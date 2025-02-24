const express = require("express");
const bodyParser = require("body-parser");
var service = require('./service/service')
var constants = require('./service/constants')
const app = express();
app.use(bodyParser.json()); // Parse incoming JSON

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

    res.json(response); // Send JSON response
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
