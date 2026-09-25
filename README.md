CodeClash/
├─ Frontend/
│  ├─ src/
│  │  ├─ api/
│  │  │   └─ axios.js
│  │  ├─ components/
│  │  │   └─ Navbar.jsx
│  │  ├─ pages/
│  │  │   ├─ Home.jsx
│  │  │   ├─ Login.jsx
│  │  │   ├─ Register.jsx
│  │  │   ├─ ProblemList.jsx
│  │  │   ├─ ProblemDetail.jsx
│  │  │   └─ Profile.jsx
│  │  ├─ store/
│  │  │   └─ authStore.js
│  │  ├─ validation/
│  │  │   └─ authSchema.js
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ package.json
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ backend/
│  ├─ prisma/
│  │   └─ schema.prisma
│  ├─ src/
│  │  ├─ config/
│  │  │   └─ db.js
│  │  ├─ controllers/
│  │  │   ├─ authController.js
│  │  │   ├─ problemsController.js
│  │  │   └─ submissionsController.js
│  │  ├─ middlewares/
│  │  │   ├─ authMiddleware.js
│  │  │   └─ errorHandler.js
│  │  ├─ models/
│  │  │   └─ (optional if using Prisma)
│  │  ├─ routes/
│  │  │   ├─ auth.js
│  │  │   ├─ problems.js
│  │  │   └─ submissions.js
│  │  ├─ utils/
│  │  │   └─ validator.js
│  │  ├─ app.js
│  │  └─ server.js
│  ├─ .env
│  └─ package.json
├─ .gitignore
└─ README.md
