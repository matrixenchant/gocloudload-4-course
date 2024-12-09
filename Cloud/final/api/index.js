// Import necessary modules
const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/user');
const Event = require('./models/event');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registers'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/', (req, res) => {
  res.send('Welcome to the Event Management API!');
});

sequelize
  .sync({ force: false, alter: true })
  .then(() => {
    console.log('Database connected and models synced! \n\n\n\n\n\n\n\n\n\n');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
