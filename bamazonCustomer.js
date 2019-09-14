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
    // displayProducts();
    // initQuestions();
    // updateProduct("department_name","Phones","Phoens");
    // getQuantity("Samsung Galaxy S10+");
    // buyProduct("Samsung Galaxy S10+",10);
  });

  function displayProducts(){
    var query = connection.query("SELECT * FROM products", function(err, res) {
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
        // questions();
    });
}

function questions() {
    inq.prompt({
        name: "whatToBuy",
        type: "input",
        message: "Enter Product Id of item you wish to purchase."
    }).then(function(ans){
        buyProduct(ans.whatToBuy);
    })
}

function buyProduct(id) {
    console.log("Buy this product: "+id);
    
}

// function buyProduct(iten_name,how_many) {
//     var quantity = getQuantity(iten_name);
//     if(quantity>how_many){
//         console.log("You can buy");
//     }
//     connection.end
// }

function getQuantity(item_name) {
    var query = connection.query("SELECT stock_quantity FROM products WHERE product_name=?",[item_name],function(err,res){
        if(err) throw err;
        var quantity = res[0].stock_quantity;
        return quantity;
    })
}

function updateProduct(updateWhat, updateThis, removeThis){
    var query = connection.query("UPDATE products SET "+updateWhat+" = '" +updateThis +"' WHERE "+updateWhat+ " = '"+removeThis+"'",function(err,res){
        if(err) throw err;
        console.log(res.affectedRows + " record(s) updated.");
    });
    connection.end;
}
displayProducts();