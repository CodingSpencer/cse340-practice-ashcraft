// Import Express with ESM syntax
import express from "express";

// Creat an instance of Express application
const app = express();

// Add Enviorment Variables (added change)
const name = process.env.NAME;

// Define a root handler for the root URL
app.get("/", (req, res) => {
    res.send(`Hello, ${name}!`);
});

app.get('/new-route', (req, res) => {
    res.send('This is a new route!');
});

// Define the port number
const PORT = process.env.PORT || 3000;

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running http://127.0.0.1:${PORT}`);
});