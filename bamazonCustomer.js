var mysql = require("mysql");
var inquirer = require("inquirer");

var inquirerPrompts = 
	[
		{      		
			name: "productid",
	 		type: "input",
      		message: "\n          Enter the ID of the product you would like to purchase?",
      	},
      	{
      		name: "qty",
      		type: "input",
      		message: "\n          How much would you like to purchase?",
      	}
	]
var connection = mysql.createConnection(
{
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password", //use actual password
	database: "bamazon"
}
);
connection.connect(function(error){
	if (error) throw error;
	console.log("connected as id" + connection.threadId);
		// addSong();
		afterConnection();
});
	function afterConnection(response) {
		console.log("    -------------------------");
		console.log("\n     Welcome to Bamazon Bikes")
		console.log("\n    -------------------------");
		console.log("\n     -------Inventory-------")
		connection.query("SELECT * FROM products", 
			function(error,response){
			if(error) throw error;
			for(var i = 0; i<response.length;i++){
				console.log("\n     ID: " + response[i].id + " - " + "Item: " + response[i].product_name + " - " + "Department: " + response[i].department_name + " - " + "Price: " + "$" + response[i].price + " - " + "Stock: " + response[i].stock);
				};
				console.log("\n     -------End Inventory-------")
			purchaseProduct();	
		});
	}
function purchaseProduct() {
	inquirer.prompt(inquirerPrompts).then(function (answer){
		var query = 'SELECT id, product_name, price, stock FROM products WHERE ?';
		connection.query(query, {id:answer.productid}, function(error,response){
			if(response[0].stock >= answer.qty){
				newStock = response[0].stock - answer.qty;
				console.log("\n          Your total for " + answer.qty + " " + response[0].product_name + " is $" + (answer.qty*response[0].price));		
				connection.query('UPDATE bamazon.products SET ? WHERE ?',
					[{
						stock: newStock
					},
					{
						id: answer.productid
					}],
				function(error,response) {
					console.log("\n          The product stock has been updated");
					console.log("\n");
					connection.end();
				});
			}
			else {
				console.log("\n         Please select a different amount.")
				purchaseProduct();
			}
		})
	})
}
