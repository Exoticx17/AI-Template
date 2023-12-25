const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const modelRoutes = require('./routes/modelRoutes');

const app = express();

// Middleware
const corsOpts = {
    credentials: true,
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type'],
  };
  
  // Combine the cors and bodyParser middleware
  app.use(cors(corsOpts));
  app.use(bodyParser.json());
  

// Use express.json() instead of bodyParser.json()
app.use(bodyParser.json());

app.use(methodOverride('_method'));
app.use(cookieParser());

// Routes
app.use('/user', userRoutes);
app.use('/model', modelRoutes)

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));


