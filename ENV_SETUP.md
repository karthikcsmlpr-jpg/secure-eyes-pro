# Environment Setup Guide

## Local Development Setup

### 1. Get Railway MySQL Credentials

1. Go to [Railway.app](https://railway.app)
2. Create a new MySQL database
3. Click your MySQL plugin
4. Go to "Connect" tab
5. Copy the connection string or individual credentials:
   - `DB_HOST`: database host
   - `DB_PORT`: usually 3306
   - `DB_USER`: username
   - `DB_PASSWORD`: password
   - `DB_NAME`: database name

### 2. Create `.env.local` File

Create a `.env.local` file in your project root:

```env
# Railway MySQL
DB_HOST=your-railway-host
DB_PORT=3306
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-super-secret-key-change-me-in-production
```

### 3. Install Dependencies

```bash
npm install mysql2 jsonwebtoken bcryptjs
```

### 4. Test Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and test:
- Registration page → POST `/api/register`
- Login page → POST `/api/login`
- Profile page → GET `/api/profile`

---

## Vercel Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "Add serverless backend API"
git push origin main
```

### 2. Connect to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect configuration
4. Click "Deploy"

### 3. Add Environment Variables in Vercel

After deployment:

1. Go to your Vercel project dashboard
2. Click **Settings**
3. Click **Environment Variables**
4. Add each variable:

| Key | Value |
|-----|-------|
| `DB_HOST` | Your Railway host |
| `DB_PORT` | 3306 |
| `DB_USER` | Your Railway user |
| `DB_PASSWORD` | Your Railway password |
| `DB_NAME` | Your Railway database |
| `JWT_SECRET` | A strong random string |

5. Click "Save"
6. Redeploy:
   - Go to "Deployments"
   - Click the latest deployment
   - Click "Redeploy"

### 4. Test Deployed API

After redeployment, test endpoints:

```bash
# Register
curl -X POST https://your-app.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123",
    "fullName": "Test User"
  }'

# Login
curl -X POST https://your-app.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

---

## JWT_SECRET Generation

Generate a strong secret for production:

### Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Using OpenSSL
```bash
openssl rand -hex 32
```

---

## Troubleshooting

### "Cannot connect to database"

Check:
1. Railway credentials are correct
2. Database is running (check Railway dashboard)
3. Environment variables are set in Vercel

### "Module not found"

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### "Token verification failed"

Ensure:
1. `JWT_SECRET` is same in local and Vercel
2. Token hasn't expired (7 days max)
3. Token format: `Bearer <token>`

---

## Security Checklist

- [ ] Change default `JWT_SECRET` in production
- [ ] Use strong database passwords
- [ ] Set environment variables in Vercel
- [ ] Use HTTPS only (Vercel provides this)
- [ ] Regularly update dependencies

---

## Support Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [JWT.io](https://jwt.io)
