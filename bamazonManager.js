var mysql = require("mysql");
var Table = require('cli-table2');
var inq = require('inquirer');
var password = require('./password.js');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Enter password in the password.js file
  password: password,
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    questions();
  });

  var questions = function(){
    inq.prompt({
        type:"list",
        name:"selection",
        message: "Choose an option below.",
        choices:["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(ans){
        switch(ans.selection){
            case "View Products for Sale":
                allProducts();
                break;
            case "View Low Inventory":
                console.log("Picked 2");
                break;
            case "Add to Inventory":
                console.log("Picked 3");
                break;
            case "Add New Product":
                console.log("Picked 4");
                break;
        }
            
    })
  }

  var allProducts = function(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        
        var table = new Table({
            head: ["Id","Product Name","Price","Quantity"],
            colWidths: [4,44,12,12],
            style: {
                compact: true
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id,res[i].product_name,res[i].price,res[i].stock_quantity]);
        }
        console.log(table.toString());
        console.log("");
        setTimeout(function(){questions()},500);
  });
}