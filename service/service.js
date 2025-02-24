var constants = require('./constants')
var service = {};
let conversationState=[];
var defaultResponse = "Welcome! Utkal Hosptial ! Please choose an option:\n"
				+"1. Order Status\n"
				+"2. Customer Support\n"
				+"3. Latest Offers\n"
				+"4. Exit;"
				
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
	parsereq.to = req.body.To
	parsereq.messageId = req.body.MessageSid;
	parsereq.other = req.body
	//console.log(" before sending"+JSON.stringify(parsereq))
	return parsereq;
	
}
service.coversation = function (req) {
	 // 
	var request = service.parseRequest(req)
	const userMessage = request.message;
	const  fromNumber = request.from;
	defaultResponse = constants.getMenList(request);
	if (!conversationState[fromNumber]) {
        conversationState[fromNumber] = { step: 1 };
    }

    const state = conversationState[fromNumber];
	var reply = "Sorry, I didn’t understand that."
    switch (state.step) {
        case 1:
            reply =defaultResponse;
				
			//"Hi! welcome to Utkal Hospital, may I Know your name?";
            state.step = 2;
            break;
        case 2:
            state.name = userMessage;
            reply ='Nice to meet you,'+state.name +'! How old are you?';
            state.step = 3;
            break;
        case 3:
            state.age = userMessage;
            reply ="Got it, "+state.name+". You are "+state.age+" years old. What is your favorite time for appointment ?";
            state.step = 4;
            break;
        case 4:
            state.color = userMessage;
            reply ="Awesome, "+state.name+"! Your appointment  is fixed at "+state.color+". Thanks for chatting!";
            delete conversationState[fromNumber]; // Reset conversation
            break;
        default:
            reply ="Sorry, I didn’t understand that.";
            break;
    }
	return reply;
}

module.exports = service;