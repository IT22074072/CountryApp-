// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://kithsiri02:KNZjcHdbqQRMzKtV@cluster0.dqxbqpd.mongodb.net/CountryApp?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = process.env.JWT_SECRET || "3c7e8b76a92d4b58bbcf7309f6e761a8b8c0c1234567890abcdef1234567890";

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schemas and Models
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

userSchema.methods.comparePassword = async function (receivedPassword) {
  return await bcrypt.compare(receivedPassword, this.password);
};

const User = mongoose.model("User", userSchema);

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  countryId: { type: String, required: true },
  isFavorite: { type: Boolean, default: true },
}, { timestamps: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

// Authentication Middleware
const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(id).select("_id username email");
    req.userId = id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Request is not authorized" });
  }
};

// Auth Routes
app.post("/api/auth/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, email });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Favorite Routes
app.post('/api/favorites/add', requireAuth, async (req, res) => {
  const { countryCode } = req.body;

  try {
    const existingFavorite = await Favorite.findOne({
      userId: req.userId,
      countryId: countryCode
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    const favorite = await Favorite.create({
      userId: req.userId,
      countryId: countryCode
    });

    res.json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/favorites/all', requireAuth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
});

app.delete('/api/favorites/remove', requireAuth, async (req, res) => {
  const { countryCode } = req.body;

  try {
    const result = await Favorite.findOneAndDelete({
      userId: req.userId,
      countryId: countryCode
    });

    if (!result) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
