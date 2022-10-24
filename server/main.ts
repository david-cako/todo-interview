import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import pg from 'pg';

const app: Express = express();
const client = new pg.Client({
  connectionString: 'postgresql://local:local@localhost:5432/interview',
});

app.use(cors());
app.use(express.json());

// Route to get all todos
app.get('/todo', async (_: Request, res: Response) => {
  const result = await client.query('SELECT * from todo ORDER BY item_index ASC');
  res.send(result.rows);
});

// Route to create a todo
app.post('/todo', async (req: Request, res: Response) => {
  const result = await client.query(
    'INSERT INTO todo (label) VALUES ($1) RETURNING *',
    [req.body.label]
  );
  res.send(result.rows[0]);
});

// Route to toggle the 'done' state of a todo
app.put('/todo/:id', async (req: Request, res: Response) => {
  const result = await client.query(
    'UPDATE todo SET done = NOT done WHERE id = $1 RETURNING *',
    [req.params.id]
  );
  res.send(result.rows[0]);
});

// Route to update the sort index a todo
app.put('/todo/index/:id', async (req: Request, res: Response) => {
  try {
    await client.query('BEGIN');
    let result = await client.query('SELECT * from todo');

    // find existing row
    const itemIdx = result.rows.findIndex(item => item.id === parseInt(req.params.id));

    // splice and reorder
    const [row] = result.rows.splice(itemIdx, 1);

    result.rows.splice(req.body.index, 0, row);

    const query = result.rows.map((r, idx) => `UPDATE todo SET item_index = ${idx} WHERE id = ${r.id};`);

    await client.query(
      query.join("")
    );
    await client.query('COMMIT');
    res.send(result.rows);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
});

app.listen(8080, async () => {
  await client.connect();
  console.log('Server is running at https://localhost:8080');
});
