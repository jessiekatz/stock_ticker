const MongoClient = require('mongodb').MongoClient;
const fs = require("fs");
var readline = require('readline');
var myFile = readline.createInterface({
        input: fs.createReadStream("C:\\Users\\jessk\\Downloads\\companies-1.csv")
    });

//counter to not add first title row
let lineNum = 0;
myFile.on('line', function (line) {

    if (!(lineNum === 0)) {
        //split by commas
        let row = line.split(',');

        //connect mongo
        const connStr = "mongodb+srv://newuser:123@stock.1uj46pd.mongodb.net/?retryWrites=true&w=majority";
        client = new MongoClient(connStr);
        MongoClient.connect(connStr, async function(err, db) {
        if(err) { return console.log(err); }
    
        //getting Stock database, publiccompanies collection
        var dbo = db.db("Stock");
        var collection = dbo.collection('PublicCompanies');
        
        //adding each row of data
        var newData = {"company": row[0], "Ticker": row[1], "Price": row[2]};
        await collection.insertOne(newData, function(err, res) {
        if (err) { return console.log(err); }
        console.log("new document inserted");
        }); 
    db.close();
    });
    }
    lineNum++;
});

