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
service.processMenu = function (body) {
	
}
service.parseRequest = function (req) {
	var parsereq={}
	const { Body, From } = req.body;
	parsereq.message = Body
	parsereq.from = From
	parsereq.messageId = req.body.MessageSid;
	parsereq.other = req.body
	console.log(" before sending"+JSON.stringify(parsereq))
	return parsereq;
	
}

module.exports = service;