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
    result = await client.query('SELECT * from todo WHERE id = $1', [req.params.id]);

    const move = result.rows[0];

    if (move === undefined) {
      throw new Error("Requested item does not exist.")
    }

    // open space at destination index
    if (move.item_index < req.body.index) {
      result = await client.query(
        `UPDATE todo SET item_index = item_index - 1 WHERE item_index > $1 AND item_index <= $2`,
        [move.item_index, req.body.index]);

    } else if (move.item_index > req.body.index) {
      result = await client.query(
        `UPDATE todo SET item_index = item_index + 1 WHERE item_index < $1 AND item_index >= $2`,
        [move.item_index, req.body.index]);
    }

    // update item index for moved row
    result = await client.query(
      'UPDATE todo SET item_index = $1 WHERE id = $2 RETURNING *',
      [req.body.index, move.id]
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
