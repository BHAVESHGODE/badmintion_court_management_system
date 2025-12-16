# badminton-court-management-system

A premium MERN stack application for booking badminton courts.

## Project Structure

- `client/`: React + Vite frontend (Tailwind CSS)
- `server/`: Express + MongoDB backend

## Deployment Instructions

### 1. Backend (Server) - Recommend: Render / Railway
1. Create a new Web Service on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Connection String.
   - `JWT_SECRET`: A secure random string.
   - `PORT`: `5000` (or leave default).

### 2. Frontend (Client) - Recommend: Vercel
1. Create a new Project on [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Set **Root Directory** to `client`.
4. Vercel should auto-detect Vite. 
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_API_BASE_URL`: The URL of your deployed Backend (e.g., `https://your-api.onrender.com/api`).
6. Deploy!

## Local Development

1. **Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
