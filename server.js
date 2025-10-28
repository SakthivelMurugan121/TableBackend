// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Initialize 10 tables with reservation details
let tables = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  isReserved: false,
  customerName: '',
  date: '',
  time: '',
}));

// ✅ GET all tables
app.get('/tables', (req, res) => {
  res.json(tables);
});

// ✅ GET specific table details
app.get('/tables/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const table = tables.find(t => t.id === id);

  if (table) {
    res.json(table);
  } else {
    res.status(404).json({ message: 'Table not found' });
  }
});

// ✅ POST: Reserve a table
app.post('/reserve/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { customerName, date, time } = req.body;

  const table = tables.find(t => t.id === id);

  if (!table) {
    return res.status(404).json({ message: 'Table not found' });
  }

  if (table.isReserved) {
    return res.status(400).json({ message: `Table ${id} is already reserved.` });
  }

  if (!customerName || !date || !time) {
    return res.status(400).json({ message: 'Please provide customerName, date, and time.' });
  }

  table.isReserved = true;
  table.customerName = customerName;
  table.date = date;
  table.time = time;

  res.json({
    message: `✅ Table ${id} successfully reserved by ${customerName} on ${date} at ${time}.`,
    table,
  });
});

// ✅ POST: Cancel a reservation
app.post('/cancel/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const table = tables.find(t => t.id === id);

  if (!table) {
    return res.status(404).json({ message: 'Table not found' });
  }

  if (!table.isReserved) {
    return res.status(400).json({ message: 'This table is not currently reserved.' });
  }

  const cancelledBy = table.customerName;
  table.isReserved = false;
  table.customerName = '';
  table.date = '';
  table.time = '';

  res.json({
    message: `❌ Reservation for Table ${id} by ${cancelledBy} has been cancelled.`,
    tables,
  });
});

// ✅ GET: Filter available or reserved tables
app.get('/filter', (req, res) => {
  const { status } = req.query; // status = "reserved" or "available"
  let filtered;

  if (status === 'reserved') {
    filtered = tables.filter(t => t.isReserved);
  } else if (status === 'available') {
    filtered = tables.filter(t => !t.isReserved);
  } else {
    filtered = tables;
  }

  res.json(filtered);
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
