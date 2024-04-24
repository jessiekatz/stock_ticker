var http = require('http');
var url = require('url');
const MongoClient = require('mongodb').MongoClient;
var port = process.env.PORT || 3000;
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  if (req.url === '/favicon.ico') {
    // Ignore requests to favicon.ico
    res.writeHead(204); // No content response
    res.end();
    return;
  }
  if (req.url == "/") {
    res.write('<form method="GET" action="process">');
    res.write('<input id="fileInput" type="text" name="fileInput" placeholder="Enter a ticker or company" required /><br>');
    res.write('<input type="radio" id="Ticker" name="submission" value="ticker">');
    res.write('<label for="ticker">Ticker</label>');
    res.write('<input type="radio" id="company" name="submission" value="company">');
    res.write('<label for="company">Company</label><br>');
    res.write('<button id="submitBtn" type="submit">Submit</button>');
    res.write('</form>');
  
  } else if (req.url.startsWith("/process")) {
    
    var parsedUrl = url.parse(req.url, true);
    var formData = parsedUrl.query;
    var submissionType = formData.submission;
    var userInput = formData.fileInput;
    
    //connect mongo
    const connStr = "mongodb+srv://newuser:123@stock.1uj46pd.mongodb.net/?retryWrites=true&w=majority";
    MongoClient.connect(connStr, async function(err, db) {
      if(err) { 
        console.log(err);
        return;
      }

      //getting Stock database, publiccompanies collection
      var dbo = db.db("Stock");
      var coll = dbo.collection('PublicCompanies');

      // Filter based on submission type
      var filter = {};
      if (submissionType === "ticker") {
        filter.Ticker = userInput;
      } else if (submissionType === "company") {
        filter.company = userInput;
      }

      await coll.find(filter).toArray(async function(err, items) {
        if (err) { 
          console.log("Error: " + err); 
        } else {        
            res.write('<!DOCTYPE html>');
            res.write('<html>');
            res.write('<table>');
            res.write('<tr>');
            res.write('<th>Company</th>');
            res.write('<th>Ticker</th>');
            res.write('<th>Price</th>');
            res.write('</tr>');
            items.forEach(function(item) {   
                console.log("Company:"+item.company);
                console.log("Ticker:"+item.Ticker);
                console.log("Price:"+item.Price);

                res.write('<tr>');
                res.write('<td>' + item.company + '</td>');
                res.write('<td>' + item.Ticker + '</td>');
                res.write('<td>' + item.Price + '</td>');
                res.write('</tr>');
            });
            res.write('</table>');
            res.write('</body>');
            res.write('</html>');
        }
        db.close();
        res.end();
      });
    });
  }
}).listen(8080);
