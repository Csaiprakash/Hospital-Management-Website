const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PatientsModel = require('./model/Patients');
const ContactsModel = require('./model/Contact');
const AppointModel = require('./model/Appoint');
const path = require('path');
const QRCode = require('qrcode'); // Make sure you have installed this library
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://csaiprakash77:omsai2244@cluster0.pnjmgu4.mongodb.net/Healthcare')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.static(path.join(__dirname, 'build')));

// Generate QR code endpoint
app.post('/generate-qrcode', async (req, res) => {
  try {
    const { name } = req.body;
    const upiId = '8309614542@ybl'; // Replace with your UPI ID
    const qrData = `upi://pay?pa=${upiId}&pn=${name}&am=${200}&cu=INR`;

    const qrCode = await QRCode.toDataURL(qrData);

    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/check-availability', (req, res) => {
  const { doctor, date, slot } = req.body;

  const isAvailable = !appointments.some(appointment => 
    appointment.doctor === doctor && 
    appointment.date === date && 
    appointment.slot === slot
  );

  res.send({ available: isAvailable });
});


// Store appointment endpoint
app.post('/appointment', async (req, res) => {
  try {
    const { name, doctor, age, date, slot } = req.body;
    const patient = await AppointModel.create({ name, doctor, age, date, slot });
    res.json({ patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/contact', (req, res) => {
  ContactsModel.create(req.body)
    .then(contacts => res.json(contacts))
    .catch(err => res.json(err));
});

app.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const user = await PatientsModel.create({ name, phone, email, password });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/check', async (req, res) => {
  try {
    const { phone, email } = req.query;
    const phoneExists = await PatientsModel.exists({ phone });
    const emailExists = await PatientsModel.exists({ email });

    res.json({ phoneExists, emailExists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




app.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const patient = await PatientsModel.findOne({ phone });
    if (!patient) {
      return res.status(404).json({ message: 'User not exists' });
    }
    if (patient.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json(err);
  }
});




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
