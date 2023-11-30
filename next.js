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
                        res.send({ filename: './success.html' });
                    } else {
                        res.send('Invalid username or password');
                    }
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});