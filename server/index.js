import express from 'express';
import orders from './routes/orders';
import users from './routes/users';

const app = express();

app.use('/api/v1/parcels', orders);
app.use('/api/v1/users', users);

const port = process.env.PORT || 3000;
app.listen(8080, () => { console.log('listening on port 8080....'); });

export default app;
