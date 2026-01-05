// include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;
 
//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
 
//initialize Express app
const app = express();
//helps app to read JSON data
app.use(express.json());
 
//start the server
app.listen(port, () => {
    console.log('Server running on port ' , port);
});
 
//Example Route: Get all cheesecakes
app.get('/allcheesecakes', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.Cheesecakes');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server error for allcheesecakes'});
    }
});
 
// Example Route: Create a new cheesecake
app.post('/addcheesecake', async (req, res) => {
    const { Cheesecake_name, Cheesecake_calories } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO Cheesecakes (Cheesecake_name, Cheesecake_calories) VALUES (?, ?)', [Cheesecake_name, Cheesecake_calories]);
        res.status(201).json({ message: 'Cheesecake '+Cheesecake_name+' added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add cheesecake '+cheesecake_name });
    }
});

// Example Route: Update a cheesecake by ID
app.put('/updatecheesecake/:id', async (req, res) => {
    const cheesecakeId = req.params.id;
    const { Cheesecake_name, Cheesecake_calories } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE Cheesecakes SET Cheesecake_name = ?, Cheesecake_calories = ? WHERE id = ?',
            [Cheesecake_name, Cheesecake_calories, cheesecakeId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cheesecake not found' });
        }
        res.json({ message: 'Cheesecake updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update cheesecake' });
    }
});

// Example Route: Delete a cheesecake by ID
app.delete('/deletecheesecake/:id', async (req, res) => {
    const cheesecakeId = req.params.id;
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'DELETE FROM Cheesecakes WHERE id = ?',
            [cheesecakeId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cheesecake not found' });
        }
        res.json({ message: 'Cheesecake deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete cheesecake' });
    }
});