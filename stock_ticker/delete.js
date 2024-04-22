const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL
const url = "mongodb+srv://newuser:123@stock.1uj46pd.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
MongoClient.connect(url, async function(err, client) {
    try {
        // Handle connection errors
        if (err) {
            throw err;
        }

        // Access the database
        const db = client.db("Stock");
        
        // Access the collection
        const collection = db.collection('PublicCompanies');

        // Delete all documents in the collection
        await collection.deleteMany({});

        console.log("All documents deleted successfully.");
    } catch (error) {
        // Handle errors
        console.error("An error occurred:", error);
    } finally {
        // Close the connection
        client.close();
    }
}); // end connect
