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
    displayProducts();
  });

    var displayProducts = function(){
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
        buy();
    });
}

function buy() {
    inq.prompt({
        name: "product",
        type: "input",
        message: "Enter Product Id of item you wish to purchase."
    }).then(function(ans){
        var selected = ans.product;
        connection.query("SELECT * FROM products WHERE id=?",[selected],function(err,res){
            if(err) throw err;
            // Will check if the id selected doesnt exist
            if(res.length===0){
                console.log("The id chosen does not exist!");
                buy();
            }
            else{
                // If it does exist, prompt how many to buy
                inq.prompt({
                    name:"amount",
                    type: "number",
                    message: "How many would you like to buy?"
                }).then(function(ans2){
                    var amount = ans2.amount;
                    var stockId = res[0].id;
                    var inStock = res[0].stock_quantity;
                    var stockName = res[0].product_name;
                    var stockPrice = res[0].price;
                    var newAmount = inStock - amount;
                    if(amount > inStock){
                        console.log("Sorry we only have "+inStock+" of "+stockName+" in stock.");
                        buy();
                    }else{
                        console.log("You are buying "+amount+" "+stockName+" at $"+stockPrice+" each.");
                        connection.query("UPDATE products SET stock_quantity=? WHERE id=?",[newAmount,stockId],function(error,results){
                            if(error) throw error;
                            console.log("Thank you for your purchase!");
                        });
                        connection.end;
                    }
                })
            }
        })
    })
}

function updateProduct(updateWhat, updateThis, removeThis){
    var query = connection.query("UPDATE products SET "+updateWhat+" = '" +updateThis +"' WHERE "+updateWhat+ " = '"+removeThis+"'",function(err,res){
        if(err) throw err;
        console.log(res.affectedRows + " record(s) updated.");
    });
    connection.end;
}