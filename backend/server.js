const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import models and initialize
const db = require('./src/models');
const Role = db.role;

// Initialize roles function
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  initial(); // Initialize roles
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

// Simple route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to JWT Authentication API',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        signin: 'POST /api/auth/signin',
        refresh: 'POST /api/auth/refreshtoken'
      },
      test: {
        public: 'GET /api/test/all',
        user: 'GET /api/test/user',
        moderator: 'GET /api/test/mod',
        admin: 'GET /api/test/admin'
      },
      user: {
        profile: 'GET /api/user/profile'
      }
    }
  });
});

// Routes
require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);

// Handle 404
app.use('*', (req, res) => {
  res.status(404).send({
    message: 'Route not found'
  });
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}`);
});