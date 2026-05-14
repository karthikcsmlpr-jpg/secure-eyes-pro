import { query, initializeDatabase } from './_lib/db.js';
import { verifyToken, extractToken } from './_lib/jwt.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET and PUT
  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize database table if needed
    await initializeDatabase();

    // Extract and verify token
    const token = extractToken(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.userId;

    if (req.method === 'GET') {
      // Get user profile
      const users = await query(
        'SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = users[0];

      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      });
    }

    if (req.method === 'PUT') {
      // Update user profile
      const { name, email } = req.body;

      // Build update query dynamically
      const updates = [];
      const params = [];

      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }

      if (email !== undefined) {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if email is already taken by another user
        const existingUsers = await query(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, userId]
        );
        if (existingUsers.length > 0) {
          return res.status(409).json({ error: 'Email is already in use' });
        }

        updates.push('email = ?');
        params.push(email);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      params.push(userId);

      await query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        params
      );

      // Fetch updated user
      const users = await query(
        'SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      const user = users[0];

      return res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      });
    }
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
