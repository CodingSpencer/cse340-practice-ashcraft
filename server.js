import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Import MVC components
import { setupDatabase, testConnection } from './src/models/setup.js';
import routes from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/global.js';

import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import flash from 'connect-flash'; // 💡 Make sure this package is imported!
import { caCert } from './src/models/db.js';
import { startSessionCleanup } from './src/utils/session-cleanup.js';

/**
 * Server Configuration
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'development';
const PORT = process.env.PORT || 3000;

const app = express();

/**
 * 1. Configure Express Settings & Static Assets
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public'))); 

/**
 * 2. Request Body Parsers (MUST be before sessions and routes!)
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * 3. Session Middleware Configuration
 */
const pgSession = connectPgSimple(session);

app.use(session({
    store: new pgSession({
        conObject: {
            connectionString: process.env.DB_URL,
            ssl: {
                ca: caCert,
                rejectUnauthorized: true,
                checkServerIdentity: () => { return undefined; }
            }
        },
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV.includes('dev') !== true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Start automatic session cleanup background task
startSessionCleanup();

/**
 * 4. Flash Message Configuration (MOVED UP ⬆️)
 * Must be immediately after session, but before routes!
 */
app.use(flash()); // Initializes req.flash utility

app.use((req, res, next) => {
  res.locals.messages = req.flash(); 
  next();
});

/**
 * 5. Global Application Middleware (Can safely use session & flash now)
 */
app.use(addLocalVariables);

/**
 * 6. Application Routes (MOVED DOWN ⬇️)
 * Routes are now fully supercharged with session, flash, and local variables.
 */
app.use('/', routes);

/**
 * 7. Error Handling Middleware (MUST be at the very bottom of the chain)
 */
// Catch-all 404 Handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
    if (res.headersSent || res.finished) {
        return next(err);
    }

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        nodeEnv: NODE_ENV 
    };

    try {
        res.status(status).render(`errors/${template}`, context);
    } catch (renderErr) {
        if (!res.headersSent) {
            res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
        }
    }
});

/**
 * 8. Development WebSocket Server (Live Reloading)
 */
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

/**
 * 9. Start Server
 */
app.listen(PORT, async () => {
    try {
        await setupDatabase();
        await testConnection();
        console.log(`Server is running on http://127.0.0.1:${PORT}`);
    } catch (dbError) {
        console.error('Database initialization failed:', dbError);
    }
});