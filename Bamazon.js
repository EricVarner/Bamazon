var inquirer = require("inquirer");

var mysql = require("mysql");
// var inquirer = require("inquire')

var connectionObject={
host: '127.0.0.1',
port: 3306,
user: "Eric",
password: "12345",
database: "bamazon_db",

};
function questions(){
    inquirer.prompt(
        [
        {
            name: 'name',
            type: 'input',
            message: 'what is the ID of the product you would like to buy?',
        },
        {
            name: 'buy',
            type: 'input',
            message: 'how many units of the product they would like to buy?'
        }]);
        
        }

var connection = mysql.createConnection(connectionObject);
connection.connect(function (err) {
   if (err) throw err;
   console.log("");
   console.log("connected as id " + connection.threadId)
   console.log("");
   connection.query("SELECT * FROM products_table", function (err, res) {
       if (err) {
           console.log("ERROR :: ", err);
       }
       else {
           console.log("");
           console.table(res);
           questions();
           updateProduct(answer);
       }
   });
});


     
      function updateProduct(answer) {
        console.log("Updating all Products quantities...\n");
        var query = connection.query(
          "UPDATE products_table SET ? WHERE ?",
          [
            {
              stock_quantity: answer.name
            },
            {
              item_id: answer.buy
            }
          ],
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            // // Call deleteProduct AFTER the UPDATE completes
            // deleteProduct();
          }

        );
      

        // logs the actual query being run
        console.log(query.sql);
      }
     