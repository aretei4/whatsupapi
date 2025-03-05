const mongoose = require('mongoose');
const connectdb = require('./DbConnection')

var messageDao = {};
// Connect to MongoDB


// Define a schema


// Create a model

const userSchema = new mongoose.Schema({
		name: String,
		age: Number,
	});
	
	
	messageDao.saveMessage = async function(messg) {
		await connectdb();
	
		const User = mongoose.model('User', userSchema);
		
	 try {
			// Insert a document
			const newUser = new User({ name: 'Jane Doe', age: 25 });
			const savedUser = await newUser.save();
			console.log('Inserted document:', savedUser);
			 } catch (err) {
			console.error(err);
		} finally {
			// Close the connection
			mongoose.connection.close();
			console.log('Disconnected from MongoDB');
			return ""
		}
			
	}
messageDao.saveUser = async function() {
// CRUD Operations

    try {
        // Insert a document
        const newUser = new User({ name: 'Jane Doe', age: 25 });
        const savedUser = await newUser.save();
        console.log('Inserted document:', savedUser);

        // Find a document
        const foundUser = await User.findOne({ name: 'Jane Doe' });
        console.log('Found document:', foundUser);

        // Update a document
        const updatedUser = await User.updateOne({ name: 'Jane Doe' }, { age: 26 });
        console.log('Updated document:', updatedUser.modifiedCount);

        // Delete a document
        const deletedUser = await User.deleteOne({ name: 'Jane Doe' });
        console.log('Deleted document:', deletedUser.deletedCount);
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection
        mongoose.connection.close();
        console.log('Disconnected from MongoDB');
		return ""
    }
}

async function getDataFromMongoDB() {
    const users = await User.find({});
    return users;
}

module.exports = messageDao;