var constants = {};
var menuForOrder = {
  "to": "whatsapp:+1234567890",
  "from": "whatsapp:+TwilioNumber",
  "interactive": {
    "type": "list",
    "header": {
      "type": "text",
      "text": "Choose an option"
    },
    "body": {
      "text": "Select an option from below:"
    },
    "footer": {
      "text": "Reply with your choice"
    },
    "action": {
      "button": "View Options",
      "sections": [
        {
          "title": "Services",
          "rows": [
            {
              "id": "order_status",
              "title": "Check Order Status",
              "description": "Track your order"
            },
            {
              "id": "contact_support",
              "title": "Contact Support",
              "description": "Talk to a representative"
            }
          ]
        }
      ]
    }
  }
}

constants.getMenList=function(req){
	menuForOrder.to = req.to;
	menuForOrder.from = req.from;
	return menuForOrder;	
}
module.exports =constants;