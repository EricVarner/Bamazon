var inquirer = require("inquirer");

var mysql = require("mysql");
// var inquirer = require("inquire')

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: "root",
  password: "Lordderp1",
  database: "bamazon_db",
  });

// connect to the mysql server and sql database
var connection = mysql.createConnection(connectionObject);
connection.connect(function (err) {
   if (err) throw err;
   console.log("");
   console.log("connected as id " + connection.threadId)
   console.log("");
   connection.query("SELECT * FROM products_table", function (err, res) {
       if (err) {
           console.log("===== ===== ===== ===== =====");
           console.log("ERROR :: ", err);
           console.log("===== ===== ===== ===== =====");
       }
       else {
           console.log("");
           console.log("RESULT :: ", res);
           questions();
           
       }
   });
});

  
  function bidAuction() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products_table", function(err, results) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer.prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].item_id);
            }
            return choiceArray;
          },
            name: 'name',
            type: "",
            message: "What auction would you like to place a bid in?"
          },
          {
            name: "item",
            type: "input",
            message: "How much would you like to buy?"
          }
        ])
        .then(function(answer) {
          // get the information of the chosen item
          var chosenItem;
          for (var i = 0; i < results.length; i++) {
            if (results[i].item_id === answer.choice) {
              chosenItem = results[i];
            }
          }
  
          // determine if bid was high enough
          if (chosenItem.stock_quantity > parseInt(answer.bid)) {
            // bid was high enough, so update db, let the user know, and start over
            connection.query(
              "UPDATE products_table SET ? WHERE ?",
              [
                {
                    stock_quantity: answer.bid
                  },
                  {
                    item_id: chosenItem.Id
                  }

              ],
              function(error) {
                if (error) throw err;
                console.log("successfully!");
                start();
              }
            );
          }
          else {
            // bid wasn't high enough, so apologize and start over
            console.log("Not enough quantity for purchase please start over");
        bidAuction();
          }
        });
    });
  }
  bidAuction();