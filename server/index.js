import express from 'express';
import orders from './routes/orders';
import users from './routes/users';

const app = express();

app.use('/api/v1/parcels', orders);
app.use('/api/v1/users', users);

const { port } = process.env;
app.listen(port, () => { console.log(`listening on port ${port}....`); });

export default app;
