# Deployment Steps for Task Manager API on Vercel

## 1. Ensure Environment Variables
- Set the following environment variables in the Vercel dashboard:
  - JWT_SECRET
  - MONGO_URI

## 2. Build the Client
- Navigate to the client directory:
  ```bash
  cd client
  ```
- Run the build command:
  ```bash
  npm run build
  ```

## 3. Deploy the Server
- Deploy the server-side API using a service like Heroku or DigitalOcean.

## 4. Update API URL
- Update the `REACT_APP_API_URL` in the `vercel.json` file to point to the deployed server's URL.

## 5. Deploy on Vercel
- Use the Vercel CLI or the Vercel dashboard to deploy the application.
