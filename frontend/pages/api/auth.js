import dbConnect from './_utils/db';
import User from './_models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'mySecretAdminKey';
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

export default async function handler(req, res) {
  try {
    // Connect to database
    await dbConnect();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      message: 'Database connection failed. Please check your environment variables.',
      error: error.message 
    });
  }

  if (req.method === 'POST') {
    const { action } = req.query;

    if (action === 'register') {
      try {
        const { name, email, password, role = 'user', adminSecret = '' } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }

        // Handle role assignment
        let assignedRole = 'user';
        if (role === 'admin') {
          if (adminSecret !== ADMIN_SECRET) {
            return res.status(403).json({ message: 'Invalid admin secret' });
          }
          assignedRole = 'admin';
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashed, role: assignedRole });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
      } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error during registration', error: err.message });
      }
    } else if (action === 'login') {
      try {
        const user = await User.findOne({ email: req.body.email });

        if (user && await bcrypt.compare(req.body.password, user.password)) {
          const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '2h' }
          );
          res.json({ token });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login', error: err.message });
      }
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 