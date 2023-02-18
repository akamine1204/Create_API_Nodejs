require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const databaseUtils = require('./src/utils/databaseUtils');
const initRoutes = require('./src/routes');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'src', 'public')));
app.use(cors());
app.use(morgan('dev'));
// Mounting routes
initRoutes(app);
// Initialize server
const server = http.createServer(app);
// Initialize socket
const io = new Server(server, {
  connectTimeout: 20000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
// Init event handle
io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);
  io.on('disconnect', () => {
    console.log(`Someone exited`);
  });
});

databaseUtils
  .connectToDb()
  .then(() => {
    console.log('Connect to database successfully');
    server.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Can not connect to database');
    console.log(`Error: ${err.message}`);
  });
