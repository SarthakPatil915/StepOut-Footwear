@echo off
echo 🚀 Starting StepOut E-Commerce Setup...

REM Backend Setup
echo 📦 Setting up Backend...
cd backend
call npm install
echo ✅ Backend dependencies installed

REM Seed data
echo 🌱 Seeding sample data...
call npm run seed
echo ✅ Sample data seeded

REM Frontend Setup
echo 📦 Setting up Frontend...
cd ..\frontend
call npm install
echo ✅ Frontend dependencies installed

echo.
echo ======================================
echo ✅ Setup Complete!
echo ======================================
echo.
echo 📝 To run the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm start
echo.
echo 🌐 Access:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:5000
echo.
echo 👨‍💼 Admin Demo Credentials:
echo   Email: admin@stepout.com
echo   Password: StepOut@123
echo.
pause
