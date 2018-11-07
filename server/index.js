import express from 'express';
import orders from './routes/orders';

const app = express();

app.use('/api/v1', orders);

const { port } = process.env;
app.listen(port, () => { console.log(`listening on port ${port}....`); });
export default app;

