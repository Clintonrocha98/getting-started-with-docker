import express, { Request, Response } from "express";
import { Pool } from "pg";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({ origin: true }));

const pool = new Pool({
  user: "postgres",
  host: "postgres",
  database: "postgres",
  password: "password",
  port: 5432,
});

async function createTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        ID SERIAL PRIMARY KEY,
        task VARCHAR(255)
      )
    `;
    await pool.query(createTableQuery);
    console.log("Tabela 'tasks' criada com sucesso");
  } catch (error) {
    console.error("Erro ao criar a tabela:", error);
  }
}

createTable();

app.post("/tasks", async (req: Request, res: Response) => {
  const { task } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (task) VALUES ($1) RETURNING *",
      [task]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).send("Erro interno do servidor");
  }
});

app.get("/tasks", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).send("Erro interno do servidor");
  }
});

app.delete("/tasks/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.status(200).send(`Task deleted with ID: ${id}`);
  } catch (error) {
    res.status(500).send("Erro interno do servidor");
  }
});

app.listen(3000, () => {
  console.log("server run in locahost: 3000!!!!");
});
