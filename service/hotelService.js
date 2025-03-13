var hotelService = {};

let bookings = {};
hotelService.processHotelReq = function (reque,twiml) {
	const body = reque.message;
	const from = reque.from;
	
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
		const dynamicLink = "http://3.109.96.126/hotel/hotel.html";
		
        twiml.message(`Check out price in our website: ${dynamicLink}
			Please reply with:
			1. Check room availability
			2. Book a room
			3. Cancel a booking
			4. Contact support`);
    }
}

module.exports = hotelService;