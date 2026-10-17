# jthao-budget-capstone

A full-stack personal finance and budgeting web application built with **Next.js**, **Java Spring Boot**, **PostgreSQL**, and **Docker**.


## How to run the application

Once you have the project in your local machine open it using VSCode or navigate to it in your terminal. If using VSCode, open the terminal in VSCode, then navigate to the `frontend/` folder.

```bash
cd frontend/
```

Then run
```bash
npm install
```

Create a `.env.development` file in the root of your frontend folder to point to your backend API:
```yaml
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Start the Next.js development server:

```bash
npm run dev
```

Open up a new terminal in VSCode and navigate to the `backend/` folder.

```bash
cd backend/
```
Navigate in the terminal to the `src/db/` folder. Once in there, run
```bash
docker compose up -d
```

then open up a new terminal and navigate to the `backend/` folder again. This time, stay here and run 
```bash
docker compose up --build
```

The container will start up and you will be able to use the application on [http://localhost:3000](http://localhost:3000)