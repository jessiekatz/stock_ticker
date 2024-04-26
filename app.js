const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;
require('request');

const port = process.env.PORT || 3000;


http.createServer(async function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  


  if (req.url == "/") {
    res.write(`
    <style>
        /* CSS styles */
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&family=VT323&display=swap');
        form {
            margin: 20px;
            padding: 20px;
            width: 300px;
            font-family: "Source Sans 3", sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            font-style: normal;
        }
        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 1em;
            border: none;
            border-bottom: 1px solid #ccc;
        }
        input[type="text"]:focus {
            border: none;
        }
        input[type="radio"] {
            margin: 1em 0.25em;
            padding: 0.5em 0em;
        }
        label {
            margin-right: 10px;
        }
        button {
            margin-top: 1em;
            padding: 10px 20px;
            background-color: rgb(0,0,102);
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: "Source Sans 3", sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            font-size: 1em;
            font-style: normal;
        }
        button:hover {
            background-color: #0056b3;
        }
    </style>

        <form method="GET" action="/process">
        <h1>Stock Search</h1>
            <input id="fileInput" type="text" name="fileInput" placeholder="Enter a ticker or company" required /><br>
            <input type="radio" id="Ticker" name="submission" value="ticker">
            <label for="ticker">Ticker</label>
            <input type="radio" id="company" name="submission" value="company">
            <label for="company">Company</label><br>
            <button id="submitBtn" type="submit">Submit</button>
        </form>`);

    res.end();
  } else if (req.url.startsWith("/process")) {
    const parsedUrl = url.parse(req.url, true);
    const formData = parsedUrl.query;
    const submissionType = formData.submission;
    const userInput = formData.fileInput;

    // Connect to MongoDB
    const connStr = "mongodb+srv://newuser:1@stock.1uj46pd.mongodb.net/?retryWrites=true&w=majority";

    try {
      const client = await MongoClient.connect(connStr);
      const dbo = client.db("Stock");
      const coll = dbo.collection('PublicCompanies');

      const filter = {};
      if (submissionType === "ticker") {
        filter.Ticker = userInput;
      } else if (submissionType === "company") {
        filter.company = userInput;
      }

      const items = await coll.find(filter).toArray();

      res.write(`<!DOCTYPE html>
      <html>
      <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&family=VT323&display=swap');

            html {
                background-color: #000;
            }
            body {
                color: #fff;
                font-family: "VT323", monospace;
                font-weight: 400;
                font-style: normal;
                
            }
            tr {
                text-align: center;
            }
            th {
                padding: 1em;
                text-align: center;
                font-size: 1.75em;
                color: #6BED14;
            }
            td {
                padding: 0.5em;
                text-align: left;
                font-size: 1.25em;
            }
        </style>
      </head>
      <body>
          <table>
              <tr>
                  <th>Company</th>
                  <th>Ticker</th>
                  <th>Price</th>
                  <th>Current Price</th>
              </tr>`);

      for (const item of items) {
        res.write(`<tr>
                <td>${item.company}</td>
                <td>${item.Ticker}</td>
                <td>${item.Price}</td>`);
        
        var urlS = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${item.Ticker}&apikey=9MC1EZH7GNMDH6L2`;
        let dh;
        async function fetchData() {
            try {
              const response = await fetch(urlS);
              const data = await response.json();
              console.log(data);
            //   dh = data['Global Quote']['03. high'];
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          }

          await fetchData();
          console.log("Company: " +item.company+'\n'+ "Ticker: "+item.Ticker+'\n'+"Price: "+item.Price+
                        '\n'+"Current Price: "+dh);
          res.write(`<td> ${dh} </td>
                    </tr>`);





        res.write('</tr>');
      }

      res.write('</table>');
      res.write('</body>');
      res.write('</html>');
      res.end();

      client.close();
    } catch (err) {
      console.error('Error:', err);
      res.end();
    }
  }
}).listen(port, () => {
  console.log(`Server running on port ${port}`);
});
