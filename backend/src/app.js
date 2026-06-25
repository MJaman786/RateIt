import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import notFoundHandler from './middlewares/notFound.middleware.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import authRoute from './modules/auth/auth.routes.js';
import cookieParser from 'cookie-parser';
import adminRoute from './modules/admin/admin.routes.js';
import userRatingRoute from './modules/rating/rating.routes.js';
import ownerRoute from './modules/owner/owner.routes.js';
import swaggerDocument from './docs/swagger.js';

const app = express();

// ─── Middlewares ───────────────────────────────
app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:5173'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
    })
);

app.use(express.json());                    // parses JSON body
app.use(express.urlencoded({ extended: true })); // parses form data
app.use(cookieParser());                    // parse cookie
app.use(morgan('dev'));                     // logs requests

// ─── Health Check ──────────────────────────────
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});
app.get('/', (req, res) => {
    res.type('text/plain');

    res.send(`
        ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗     ██████╗ ██╗   ██╗███╗   ██╗███╗   ██╗██╗███╗   ██╗ ██████╗                 
        ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗    ██╔══██╗██║   ██║████╗  ██║████╗  ██║██║████╗  ██║██╔════╝                 
        ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝    ██████╔╝██║   ██║██╔██╗ ██║██╔██╗ ██║██║██╔██╗ ██║██║  ███╗                
        ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗    ██╔══██╗██║   ██║██║╚██╗██║██║╚██╗██║██║██║╚██╗██║██║   ██║                
        ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║    ██║  ██║╚██████╔╝██║ ╚████║██║ ╚████║██║██║ ╚████║╚██████╔╝    ██╗██╗██╗██╗
        ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝     ╚═╝╚═╝╚═╝╚═╝                                                                                                                            
    `);
});

// ─── Routes ───────────────────────────────────

// ─── Routes Mount Pipeline ────────────────────
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/admin', adminRoute);      
app.use('/api/v1/user', userRatingRoute);  
app.use('/api/v1/owner', ownerRoute);     
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ─── Error Handlers (must be last) ────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
