DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
	id INTEGER(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(30) NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY(id)
);

#(id, product_name,department_name,price,stock_quantity);

INSERT INTO products VALUES
(1,"Samsung Galaxy S10+","Phones",1199.99,150),
(2,"iPhone XR","Phoens",1299.99,100),
(3,"Playstation 4","Video Games",350.00,250),
(4,"XBOX One X", "Video Games",499.99,200),
(5,"Nintendo Switch","Video Games", 249.99,150),
(6,'Vizeo 32" 4k UHD TV',"TV's",299.99,1200),
(7,'Samsung 60" 4k OLED TV', "TV's",1599.99, 140),
(8,'WD 1TB Blue Internal HD','Computer Hardware',49.99,350),
(9,'Seasonic 4TB Inter HD','Computer Hardware', 149.99, 235),
(10,'iMuto 30000 mAh Portable Charger','Electronics',45.99,432);

SELECT * FROM products;

SELECT product_name,stock_quantity FROM products WHERE id=1;