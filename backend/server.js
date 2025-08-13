require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const mockRoutes = require("./routes/mock");
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const registrationRoutes = require('./routes/registrationRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

connectDB();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// CSRF protection - used cookie-based token for browser clients
if (process.env.NODE_ENV === 'production') {
  app.use(csurf({ cookie: true }));
}

// Routes


app.use('/api/registration', registrationRoutes);
app.use('/api/verify', verificationRoutes);
app.use('/mock', mockRoutes);

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
