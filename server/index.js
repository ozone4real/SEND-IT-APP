import express from 'express';
import parcels from './routes/parcels';
import users from './routes/users';
import auth from './routes/auth';
import createTables from './db/migrations';
import error from './helpers/error';

createTables();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/parcels', parcels);
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);
app.use(error);


const port = process.env.PORT || 8000;
app.listen(port, () => { console.log(`listening on port ${port}....`); });

export default app;
