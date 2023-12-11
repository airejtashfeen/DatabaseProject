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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

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

    // Validate product data here if needed

    sql.connect(config, (err) => {
        if (err) {
            console.log('Failed to connect to SQL Server.', err);
            res.status(500).send('Failed to connect to the database');
        } else {
            const request = new sql.Request();
            // Insert data into the 'products' table
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

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/success.html');
});


app.get('/addRecord', (req, res) => {
    res.sendFile(__dirname + '/AddRecords.html');
});

app.get('/updateRecord', (req, res) => {
    res.sendFile(__dirname + '/UpdateRecords.html');
});

app.get('/deleteRecord', (req, res) => {
    res.sendFile(__dirname + '/DeleteRecords.html');
});

app.get('/customers', (req, res) => {
    res.sendFile(__dirname + '/customers.html');
});

app.get('/products', (req, res) => {
    res.sendFile(__dirname + '/products.html');
});

app.get('/suppliers', (req, res) => {
    res.sendFile(__dirname + '/suppliers.html');
});
app.get('/backgroundImage', (req, res)=>{
    res.sendFile(__dirname + '/flat-cartoon-kitchen-with-furniture-cozy-kitchen-interior-with-window-cupboard-dishes-toaster_212889-5330.avif');
})

app.get('/SuccessCSS', (req, res) => {
    res.sendFile(__dirname + '/success.css');
});

app.get('/LoginCSS', (req, res) => {
    res.sendFile(__dirname + '/login.css');
});

app.get('/CustomersCSS', (req, res) => {
    res.sendFile(__dirname + '/customers.css');
});

app.get('/ProductsCSS', (req, res) => {
    res.sendFile(__dirname + '/products.css');
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
