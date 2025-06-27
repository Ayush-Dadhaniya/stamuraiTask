import dbConnect from './_utils/db';
import User from './_models/User';

export default async function handler(req, res) {
  // Connect to database
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const users = await User.find().select('name email'); // Select 'name' and 'email' fields
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 