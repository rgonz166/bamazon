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
        choices:["View Products for Sale", "View Low Inventory", "Add Inventory", "Add New Product","Exit"]
    }).then(function(ans){
        switch(ans.selection){
            case "View Products for Sale":
                allProducts();
                break;
            case "View Low Inventory":
                lowQuantity();
                break;
            case "Add Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
                connection.end();
                break;
        }
            
    })
  }

  var allProducts = function(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        printTable(res);
        setTimeout(function(){questions()},500);
  });
}

var lowQuantity = function(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",function(err,res){
        if(err) throw err;
        // check if no stock low
        if(res[0] === undefined){
            console.log("No products need Re-stocking yet");
            questions();
        }else{
            printTable(res);
            setTimeout(function(){questions()},500);
        }
    });
}

var addInventory = function(){
    inq.prompt({
        type:"number",
        name: "id",
        message: "Which product would you like to restock?(id)"
    }
    ).then(function(ans){
        var chosenId = ans.id;
        connection.query("SELECT * FROM products WHERE id=?",[chosenId],function(err,res){
            if(err) throw err;
            if(res.length === 0){
                console.log("No such id.");
                addInventory();
            }else{
                inq.prompt({
                        type:"number",
                        name:"amount",
                        message:"How many will you be adding?"
                    }
                ).then(function(ans2){
                    var amount = ans2.amount + res[0].stock_quantity;
                    connection.query("UPDATE products SET stock_quantity=? WHERE id=?",[amount,chosenId],function(error,results){
                        if(error) throw error;
                        console.log(ans2.amount + " has been added to "+res[0].product_name);
                        console.log("Total stock amount is now: " + amount);
                        questions();
                    })
                })
            }
        })
    })
    // connection.query("UPDATE products SET")
}

var addProduct = function(){
    inq.prompt([{
        type:"input",
        name:"item",
        message:"Enter item name."
    },
    {
        type:"input",
        name:"department",
        message:"Enter department name."
    },
    {
        type:"number",
        name:"price",
        message:"Enter price per product."
    },
    {
        type:"number",
        name:"quantity",
        message:"How much stock do you have?"
    }]).then(function(ans){
        connection.query("INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES (?,?,?,?)",[ans.item,ans.department,ans.price,ans.quantity],function(err,res){
            if(err) throw err;
            console.log("Inserted.");
            questions();
        })
    })
    
}

// Prints table
function printTable(res){
    var table = new Table({
        head: ["Id","Product Name","Price","Quantity"],
        colWidths: [5,50,12,12],
        style: {
            compact: true
        }
    });
    for (var i = 0; i < res.length; i++) {
        table.push([res[i].id,res[i].product_name,res[i].price,res[i].stock_quantity]);
    }
    console.log(table.toString());
    console.log("");
}