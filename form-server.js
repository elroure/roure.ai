import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), 'messages.json');

app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Load messages from file
const loadMessages = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
};

// Save messages to file
const saveMessages = (messages) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
};

// Handle form submission from Formspree
app.post('/form-contact', (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).send('Missing required fields');
    }

    // Save to file
    const messages = loadMessages();
    messages.push({
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });
    saveMessages(messages);

    // Log to console
    console.log(`✅ New message from ${name} (${email}): ${message.substring(0, 50)}...`);

    // Redirect to success page or send JSON response
    res.json({ success: true, message: 'Message saved successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// API to get all messages (for admin)
app.get('/messages', (req, res) => {
  const messages = loadMessages();
  res.json(messages);
});

app.listen(PORT, () => {
  console.log(`✅ Contact form server running on http://localhost:${PORT}`);
  console.log(`📨 Form submissions will be saved to ./messages.json`);
  console.log(`📋 View all messages at http://localhost:${PORT}/messages`);
});
