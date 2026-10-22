import dotenv from "dotenv";

dotenv.config();

import express, { type Express, type Request, type Response } from "express";
import { createNewUser } from "./lib/ops.ts";

const PORT = 3000;
const app: Express = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    // Explicitly typing the form fields
    const data = req.body;

    // Simple validation check
    if (!data || !data.name || !data.email || !data.password) {
      res.status(400).send("All fields are required.");
      return;
    }

    await createNewUser(data.email, data.password, data.name);

    res.status(201).send(`Account created successfully for ${data.name}!`);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Something went wrong during registration.");
  }
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
