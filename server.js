// Import Express with ESM syntax
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

/**
 * Declare Important Variables
 */
// Define the port number
const NODE_ENV = process.env.NODE_ENV || "production";
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creat an instance of Express application
const app = express();

app.use((req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';
    // Continue to the next middleware or route handler
    next();
});

// Set EJS as Template Engine
app.set("view engine", "ejs");

// Tell Express where to find the views
app.set("views", path.join(__dirname, "src/views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a root handler for the root URL
app.get('/', (req, res) => {
    const title = 'Welcome Home';
    res.render('home', { title });
});


app.get('/products', (req, res) => {
    const title = 'Our Products';
    res.render('products', { title });
});

app.get('/about', (req, res) => {
    const student = {
        name: 'Spencer Ashcraft',
        age: 22,
        desc: "💻 I’m a Software Engineering student at Brigham Young University - Idaho with a passion for coding, Linux 🐧, and all things tech. I love diving into projects where I can learn by doing, whether that’s building software, experimenting with hardware, or exploring new technologies.",
        major: 'Software Engineering',
        hobbies: [
            "🏓 Ping Pong",
            "🥏 Disc Golf",
            "📚 Reading",
            "🎵 Pop Culture Music",
            "🛠️ Home Labs",
            "🎬 Movies",
            "🧱 Legos",
            "and more!"
        ]
    };

    res.render('student', { student });
});

// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');
    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });
        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });
        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running http://127.0.0.1:${PORT}`);
});