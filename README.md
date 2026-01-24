<div align="center">
	<br />
	<p>
		<a href="https://clean-bubble.vercel.app"><img src="https://i.postimg.cc/y6jk535j/clean-bubble-logo.png" width="200" alt="Clean-Bubble" /></a>
	</p>
	<br />
	<p>
		<a href="https://discord.gg/6DhssCN2Ph"><img src="https://img.shields.io/badge/Join_our-_Discord-5865F2?logo=discord&logoColor=white" alt="Discord server" />
        </a>
		<a href="https://clean-bubble.vercel.app"><img src="https://img.shields.io/badge/Live-site-brightgreen" alt="live site" /></a>
		<a href="https://github.com/discordjs/discord.js/commits/main"><img src="https://img.shields.io/github/last-commit/subhajeetch/clean-bubble.svg?logo=github&logoColor=ffffff" alt="Last commit." /></a>
        <a href="https://www.mongodb.com/">
  <img src="https://img.shields.io/badge/MongoDB-%2347A248.svg?logo=mongodb&logoColor=ffffff" alt="MongoDB" />
</a>
<a href="https://www.brevo.com/">
  <img src="https://img.shields.io/badge/Brevo-0092FF.svg?logo=mailbox&logoColor=ffffff" alt="Brevo" />
</a>
<a href="https://ui.shadcn.com/">
  <img src="https://img.shields.io/badge/shadcn%2Fui-%23000000.svg?logo=react&logoColor=white" alt="shadcn/ui" />
</a>
<a href="https://zustand-demo.pmnd.rs/">
  <img src="https://img.shields.io/badge/Zustand-%23F7B500.svg?logoColor=ffffff" alt="Zustand" />
</a>
	</p>
    <p>
    <strong>Clean Bubble</strong> is a complete one-product e-commerce website with all essential features, including order-slip printing and advanced store analytics.
    </p>
</div>

---

Full Project Overview: https://youtu.be/8kkdYQgnLtY
 <br />
![Screenshot 1](https://i.postimg.cc/bNDfbd72/Screenshot-2025-11-23-200032.png)

<details>
  <summary><h1 style="font-size: 30px;">📸 Screenshots</h1></summary>

  <br />
  ![Screenshot 2](https://i.postimg.cc/Nj6V7Xp1/Screenshot-2025-11-23-200047.png)
  ![Screenshot 3](https://i.postimg.cc/BtWY2ZFh/Screenshot-2025-11-23-200228.png)
  ![Screenshot 4](https://i.postimg.cc/25cfhv5D/pic-1-profile.jpg)
  ![Screenshot 5](https://i.postimg.cc/L6tKvGsh/pic-1-profile-(2).jpg)
  ![Screenshot 6](https://i.postimg.cc/mDzK95q9/Screenshot-2025-11-23-200332.png)
  ![Screenshot 7](https://i.postimg.cc/wB3rKr90/Screenshot-2025-11-23-200341.png)
<img width="1919" height="1079" alt="Screenshot 2025-11-23 200407" src="https://github.com/user-attachments/assets/ca9e1f04-45e6-4017-9961-0f4d73eec8f1" />
  ![Screenshot 9](https://i.postimg.cc/Y0XgwdrD/pic-1-profile-(1).jpg)
  
<img width="1919" height="1079" alt="Screenshot 2025-11-23 202348" src="https://github.com/user-attachments/assets/3d6a39b6-4045-4fba-a869-729907a6de2b" />

</details>

<br>

## 📄 Project overview

Clean Bubble is a demo web app showing a production-like split between a Next.js (React) frontend and an Express/MongoDB backend. The frontend uses modern patterns (App Router, server and client components, shadcn/ui-like components, Tailwind CSS). The backend exposes REST endpoints and uses cookies / JWTs for auth.






## ⚙️ Tech stack

- Frontend: Next.js (app dir), React 19, Tailwind CSS, sonner (toasts), axios, zustand, shadcn/ui, lucide-react
- Backend: Node + Express, Mongoose (MongoDB), dotenv, cookie-parser, JWT
- Dev tools: nodemon (backend), Next dev (frontend)


## 🖥️ Local development

Open **two terminals:** one for backend, one for frontend.

**Backend (from project root):**

```powershell
cd backend
npm install
# Create a .env file (see example below)
npm run dev
```

Notes:
- The backend `dev` script runs `nodemon api/index.js`. If you prefer a one-off run use `npm start` or `node api/index.js`.

**Frontend (from project root):**

```powershell
cd frontend
npm install

# Create a .env.local file (see example below)
# Update fronted/mine.config.js with your backend url

npm run dev
```

Open your browser at `http://localhost:3000` (Next.js dev server).

## 💭 Build & production

Frontend (build):

```powershell
cd frontend
npm run build
# For production start (this repo's package.json defines a `start` script)
npm run start
```



> Note: The `frontend/package.json` `start` script sets NODE_ENV in its command. On Windows you may need to adapt or use `cross-env` if you change that script.


<br>

## 📟 Environment variables


**For Backend:**
Create a `.env` file in the `backend/` folder with at least:

```
MOMGO_URI=your_mongo_uri_here
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
EMAIL_API_KEY=brevo_api_key
EMAIL_API_URL=https://api.brevo.com/v3/smtp/email
EMAIL_SENDER_EMAIL=email_that_you_used_in_brevo_must_be_verified
```
check `backend/env.example` for full information

If your frontend communicates with a backend running locally, ensure CORS / allowed origins include `http://localhost:3000` (see `backend/api/index.js`).

<br>

**For Backend:**
Create a `.env.local` file in the `frontend/` folder with:

```
LOCATION_IQ_API_KEY=your_locationiq_api_key_here

# same as backend
MONGODB_URI=your_mongodb_uri_here
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```
check `frontend/env.local.example` for full information


## 🫂 Contributing

> Feel free to contribute.

## 📃 License & contact

Project is licensed under the MIT License. Feel free to use, edit, and build upon the code however you wish.

---

