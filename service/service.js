var service = {};
service.processMessage = function (body) {
	 if (body === "hi") {
        return "Hello! How can I help you?";
    } else if (body === "1") {
        return "You selected Option 1!";
    } else {
        return "Sorry, I didn't understand that.";
    }
}
module.exports = service;