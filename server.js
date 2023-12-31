const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;

const config = {
    user: 'sa',
    password: 'Imbatman',
    server: 'localhost',
    database: 'KitchenWardrobes',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


//Check for User
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            request.query(`SELECT * FROM dbo.Users WHERE userName = '${username}' AND passwordd = '${password}'`, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.');
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    if (result.recordset.length > 0) {
                        res.send('/success');
                    } else {
                        res.send('Invalid username or password');
                    } 
                }
            });
        }
    });
});



//Insertions
app.post('/submitOrder', (req, res) => {
    const { orderID, customerID, productID, orderDate, orderStatus, orderAddress } = req.body;

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();

            request.query(`
                INSERT INTO orders (orderID, customerID, productID, orderDate, orderStatus, orderAddress)
                VALUES (${orderID}, ${customerID}, ${productID}, '${orderDate}', '${orderStatus}', '${orderAddress}')
            `, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.', err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send('Order placed successfully');
                }
            });
        }
    });
});


app.post('/submitCustomer', (req, res) => {
    const { customerID, customerName, customerEmail, customerPhone } = req.body;

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            // Insert data into the 'customers' table
            request.query(`
                INSERT INTO customers(customerID, customerName, customerEmail, customerPhone)
                VALUES (${customerID}, '${customerName}', '${customerEmail}', '${customerPhone}')
            `, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.');
                    console.log(err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send('Customer added successfully');
                }
            });
        }
    });
});


app.post('/submitProduct', (req, res) => {
    const { productID, productName, productQuantity, productMaterial, productSize, productColor, productPrice } = req.body;


    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
         
            request.query(`
                INSERT INTO products (productID, productName, productQuantity, productMaterial, productSize, productColor, productPrice)
                VALUES (${productID}, '${productName}', ${productQuantity}, '${productMaterial}', ${productSize}, '${productColor}', ${productPrice})
            `, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.', err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send('Product added successfully');
                }
            });
        }
    });
});

app.post('/submitSupplier', (req, res) => {
    const { supplierID, productID, supplierName, supplierPhone } = req.body;

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
       
            request.query(`
                INSERT INTO supplier (supplierID, productID, supplierName, supplierPhone)
                VALUES (${supplierID}, ${productID}, '${supplierName}', '${supplierPhone}')
            `, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.', err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send('Supplier added successfully');
                }
            });
        }
    });
});

app.post('/submitEmployee', (req, res) => {
    const { employeeID, orderID, employeeName, employeePhone, employeeRole, employeeDepartment } = req.body;

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
         
            request.query(`
                INSERT INTO employee (employeeID, orderID, employeeName, employeePhone, employeeRole, employeeDepartment)
                VALUES (${employeeID}, ${orderID}, '${employeeName}', '${employeePhone}', '${employeeRole}', '${employeeDepartment}')
            `, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.', err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send('Employee added successfully');
                }
            });
        }
    });
});


//UPDATES
app.post('/updateCustomer', (req, res) => {
    const { customerID, customerName, customerEmail, customerPhone } = req.body;
    
    if (!customerID) {
        res.status(400).send('Customer ID is required for update.');
        return;
    }

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            let updateQuery = 'UPDATE customers SET ';
            
            if (customerName) {
                updateQuery += `customerName = '${customerName}', `;
            }
            
            if (customerEmail) {
                updateQuery += `customerEmail = '${customerEmail}', `;
            }
            
            if (customerPhone) {
                updateQuery += `customerPhone = '${customerPhone}', `;
            }
            
           
            updateQuery = updateQuery.slice(0, -2);

            updateQuery += ` WHERE customerID = ${customerID}`;
            
            request.query(updateQuery, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.', err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send('Customer updated successfully');
                }
            });
        }
    });
});

app.post('/updateEmployee', (req, res) => {
    const { employeeID, orderID, employeeName, employeePhone, employeeRole, employeeDepartment } = req.body;

    if (!employeeID) {
        res.status(400).send('Employee ID is required for update.');
        return;
    }

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            let updateQuery = 'UPDATE employee SET ';

            if (orderID) {
                updateQuery += `orderID = ${orderID}, `;
            }

            if (employeeName) {
                updateQuery += `employeeName = '${employeeName}', `;
            }

            if (employeePhone) {
                updateQuery += `employeePhone = '${employeePhone}', `;
            }

            if (employeeRole) {
                updateQuery += `employeeRole = '${employeeRole}', `;
            }

            if (employeeDepartment) {
                updateQuery += `employeeDepartment = '${employeeDepartment}', `;
            }

            updateQuery = updateQuery.slice(0, -2);

            updateQuery += ` WHERE employeeID = ${employeeID}`;

            request.query(updateQuery, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.', err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send(`Employee with ID ${employeeID} updated successfully`);
                }
            });
        }
    });
});

app.post('/updateOrder', (req, res) => {
    const { orderID, customerID, productID, orderDate, orderStatus, orderAddress } = req.body;

    if (!orderID) {
        res.status(400).send('Order ID is required for update.');
        return;
    }

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            let updateQuery = 'UPDATE orders SET ';
            
            if (customerID) {
                updateQuery += `customerID = ${customerID}, `;
            }

            if (productID) {
                updateQuery += `productID = ${productID}, `;
            }

            if (orderDate) {
                updateQuery += `orderDate = '${orderDate}', `;
            }

            if (orderStatus) {
                updateQuery += `orderStatus = '${orderStatus}', `;
            }

            if (orderAddress) {
                updateQuery += `orderAddress = '${orderAddress}', `;
            }

            updateQuery = updateQuery.slice(0, -2);

            updateQuery += ` WHERE orderID = ${orderID}`;
            
            request.query(updateQuery, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.', err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send(`Order with ID ${orderID} updated successfully`);
                }
            });
        }
    });
});



app.post('/updateProduct', (req, res) => {
    const { productID, productName, productQuantity, productMaterial,productSize, productColor, productPrice  } = req.body;

    if (!productID) {
        res.status(400).send('Product ID is required for update.');
        return;
    }

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            let updateQuery = 'UPDATE products SET ';
            
            if (productName) {
                updateQuery += `productName = '${productName}', `;
            }

            if (productQuantity) {
                updateQuery += `productQuantity = '${productQuantity}', `;
            }

            if ( productMaterial) {
                updateQuery += ` productMaterial = '${ productMaterial}', `;
            }

            if (productSize) {
                updateQuery += `productSize= '${productSize}', `;
            }

            if (productColor) {
                updateQuery += `productColor= '${productColor}', `;
            }
            

            if (productPrice) {
                updateQuery += `productPrice= '${productPrice}', `;
            }

            updateQuery = updateQuery.slice(0, -2);

            updateQuery += ` WHERE productID = ${productID}`;
            
            request.query(updateQuery, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.', err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send(`Product with ID ${productID} updated successfully`);
                }
            });
        }
    });
});


app.post('/updateSupplier', (req, res) => {
    const { supplierID, productID, supplierName, supplierPhone } = req.body;
    
    if (!supplierID) {
        res.status(400).send('Customer ID is required for update.');
        return;
    }

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            let updateQuery = 'UPDATE supplier SET ';
            
            if (productID) {
                updateQuery += `productID = '${productID}', `;
            }
            
            if (supplierName) {
                updateQuery += `supplierName = '${supplierName}', `;
            }
            
            if (supplierPhone) {
                updateQuery += `supplierPhone = '${supplierPhone}', `;
            }
            
            updateQuery = updateQuery.slice(0, -2);

            updateQuery += ` WHERE supplierID = ${supplierID}`;
            
            request.query(updateQuery, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.', err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send('Supplier updated successfully');
                }
            });
        }
    });
});


//Deletions
app.post('/deleteCustomer', (req, res) => {
    const { customerId } = req.body;

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            // Delete data from the 'customers' table based on customerID
            request.query(`
                DELETE FROM employee WHERE orderID= ${customerId};
                DELETE FROM orders WHERE customerID=${customerId};
                DELETE FROM customers WHERE customerID = ${customerId};
            `, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.');
                    console.log(err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    // Check the affected rows to confirm deletion
                    const rowCount = result.rowsAffected[0];

                    if (rowCount > 0) {
                        res.send('Customer deleted successfully');
                    } else {
                        res.send('No customer found with the specified ID');
                    }
                }
            });
        }
    });
});


app.post('/deleteProduct', (req, res) => {
    const { productID } = req.body;

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            request.query(`
                DELETE FROM orderDetails WHERE productID = ${productID};
                DELETE FROM productSupplier WHERE productID = ${productID};
                DELETE FROM orders WHERE productID = ${productID};
                DELETE FROM employee WHERE orderID IN (SELECT orderID FROM orders WHERE productID = ${productID});
                DELETE FROM supplier WHERE productID = ${productID};
                DELETE FROM category WHERE productID = ${productID};
                DELETE FROM products WHERE productID = ${productID};
            `, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.');
                    console.log(err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send('Product deleted successfully');
                }
            });
        }
    });
});


app.post('/deleteOrder', (req, res) => {
    const { orderID} = req.body;

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            request.query(`
                DELETE FROM employee WHERE orderID=${orderID};
                DELETE FROM orders WHERE orderID= ${orderID};
            `, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.');
                    console.log(err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send('Order deleted successfully');
                }
            });
        }
    });
});


app.post('/deleteEmployee', (req, res) => {
    const { employeeID} = req.body;

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            request.query(`
                DELETE FROM employee WHERE employeeID=${employeeID};
            `, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.');
                    console.log(err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send('Employee deleted successfully');
                }
            });
        }
    });
});

app.post('/deleteSupplier', (req, res) => {
    const { supplierID} = req.body;

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            request.query(`
                DELETE FROM supplier WHERE supplierID=${supplierID};
            `, (err, result) => {
                if (err) {
                    console.log('Failed to execute SQL query.');
                    console.log(err);
                    res.status(500).send('Failed to execute SQL query');
                } else {
                    res.send('Supplier deleted successfully');
                }
            });
        }
    });
});

//ROUTES
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/login.html');
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/success.html');
});

app.get('/addRecord', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/AddRecords.html');
});

app.get('/updateRecord', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/UpdateRecords.html');
});

app.get('/deleteRecord', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/DeleteRecords.html');
});

app.get('/customers', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/customers.html');
});

app.get('/products', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/products.html');
});

app.get('/orders', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/orders.html');
});
app.get('/suppliers', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/suppliers.html');
});

app.get('/employees', (req, res)=>{
    res.sendFile(__dirname + '/HTML Files/employees.html')
})

app.get('/updateCustomer', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/updateCustomer.html');
});

app.get('/updateEmployee', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/updateEmployee.html');
})

app.get('/updateOrders', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/updateOrders.html');
})
app.get('/updateProduct', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/updateProduct.html');
});

app.get('/updateSupplier', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/updateSupplier.html');
});

app.get('/deleteCustomer', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/deleteCustomer.html');
});
app.get('/deleteOrder', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/deleteOrder.html');
});
app.get('/deleteSupplier', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/deleteSupplier.html');
});
app.get('/deleteProduct', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/deleteProduct.html');
});

app.get('/deleteEmployee', (req, res) => {
    res.sendFile(__dirname + '/HTML Files/deleteEmployee.html');
});

//Routes for CSS Files
app.get('/LoginCSS', (req, res) => {
    res.sendFile(__dirname + '/CSS Files/login.css');
});
app.get('/EmployeeCSS', (req, res)=>{
    res.sendFile(__dirname + '/CSS Files/employees.css')
})

app.get('/CustomersCSS', (req, res) => {
    res.sendFile(__dirname + '/CSS Files/customers.css');
});

app.get('/ProductsCSS', (req, res) => {
    res.sendFile(__dirname + '/CSS Files/products.css');
});

app.get('/UpdateCustomerCSS', (req, res) => {
    res.sendFile(__dirname + '/CSS Files/updateCustomer.css');
});

app.get('/UpdateSupplierCSS', (req, res) => {
    res.sendFile(__dirname + '/CSS Files/updateSupplier.css');
});
app.get('/updateEmployeeCSS', (req, res) => {
    res.sendFile(__dirname + '/CSS Files/updateEmployee.css');
})

app.get('/updateOrdersCSS', (req, res) => {
    res.sendFile(__dirname + '/CSS Files/updateOrders.css');
})
app.get('/backgroundImage', (req, res)=>{
    res.sendFile(__dirname + '/CSS Files/flat-cartoon-kitchen-with-furniture-cozy-kitchen-interior-with-window-cupboard-dishes-toaster_212889-5330.avif');
})

app.get('/OrdersCSS', (req, res) => {
    res.sendFile(__dirname + '/CSS Files/orders.css');
});

app.get('/SuccessCSS', (req, res) => {
    res.sendFile(__dirname + '/CSS Files/success.css');
}); 

app.get('/updateProductCSS', (req, res) => {
    res.sendFile(__dirname + '/CSS Files/updateProduct.css');
});

app.get('/deleteCustomerCSS', (req, res)=>{
    res.sendFile(__dirname + '/CSS Files/deleteCustomer.css');
})


//Listen 
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
