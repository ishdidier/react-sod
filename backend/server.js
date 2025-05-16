const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(' MongoDB error:', err));

// Candidate Schema
const candidateSchema = new mongoose.Schema({
  fullName: String,
  postName: String,
  score: Number,
  result: {
    type: String,
    default: function () {
      return this.score >= 50 ? 'Pass' : 'Fail';
    }
  }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

// Routes
app.get('/api/candidates', async (req, res) => {
  const candidates = await Candidate.find();
  res.json(candidates);
});

app.post('/api/candidates', async (req, res) => {
  const candidate = new Candidate(req.body);
  await candidate.save();
  res.status(201).json(candidate);
});

app.put('/api/candidates/:id', async (req, res) => {
  const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(candidate);
});

app.delete('/api/candidates/:id', async (req, res) => {
  await Candidate.findByIdAndDelete(req.params.id);
  res.json({ message: 'Candidate deleted' });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
