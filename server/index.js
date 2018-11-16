import express from 'express';
import parcels from './routes/parcels';
import users from './routes/users';
import auth from './routes/auth';

const app = express();

app.use('/api/v1/parcels', parcels);
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

const port = process.env.PORT || 8000;
app.listen(port, () => { console.log(`listening on port ${port}....`); });

export default app;