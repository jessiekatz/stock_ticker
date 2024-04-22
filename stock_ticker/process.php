<!DOCTYPE html>
<head>
    

</head>
<body>
    <?php
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            if (isset($_GET['fileInput']) && isset($_GET['submission'])) {

                // Get the values of 'fileInput' and 'submission'
                $fileInput = $_GET['fileInput'];
                $submission = $_GET['submission'];

                // Output the values
                echo "Input: $fileInput<br>";
                echo "Submission: $submission";
                echo "<script>"
                    //connect mongo
                echo    'const connStr = "mongodb+srv://newuser:123@stock.1uj46pd.mongodb.net/?retryWrites=true&w=majority";'
                echo    'client = new MongoClient(connStr);'
                echo    'MongoClient.connect(connStr, async function(err, db) { if(err) { return console.log(err); }'
                
                    //getting Stock database, publiccompanies collection
                echo    'var dbo = db.db("Stock");'
                echo    'var collection = dbo.collection('PublicCompanies');'
                echo    'await coll.find($submission,{title:1}).toArray('
                echo     '  async function(err, items) {'
                echo    '       if (err) {console.log("Error: " + err);} '
                echo           'else { console.log("Items: ");'
                echo                        'await items.forEach(function(item){   console.log(item.title + ' by ' + item.author);})}' 
                echo            'client.close();});'  //end find

                echo "</script>"
                
            } else {
                echo "One or more parameters are missing.";
            }
        } else {
            echo "Form submission error";
        }
    ?>


</body>
</html>