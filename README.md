Equipment Lending Portal

This project was developed as part of the **FSAD Assignment — Phase 1**.  
It demonstrates a basic **Equipment Lending Management System** using a MERN-style architecture.

Overview
The application allows:
- Students to log in  and request equipment.
- Admins to view and approve requests.
- Equipment details and availability to be managed in a MongoDB database.

Tech Stack
Backend:
- Node.js  
- Express.js  
- MongoDB (Atlas)  
- JWT Authentication  

Frontend:
- React.js (deployed/tested on CodeSandbox)

How to Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/2024tm93649-bit/equipment-lending-portal.git
   cd equipment-lending-portal/backend
Install dependencies
bash
npm install

Add a .env file with 
ini
MONGO_URI = mongodb+srv://atlas_user:<SREE>@freecluster.osasl0w.mongodb.net/?appName=FreeCluster
JWT_SECRET =  secretkey
PORT = 5000

seed initial data
bash
node seed.js

Run the backend
npx nodemon server.js
Default Login Credentials

admin
email id - admin@example
password admin123

student 
student@example
password student123

AI usage policy
- Generating sample bolierplat code
- structuring folder organization
- explaining GIT nad deployment setup
