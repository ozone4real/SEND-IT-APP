import express from 'express';
import router from './routes';
import createTables from './db/migrations';
import error from './helpers/error';


createTables();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/', router);
app.use(error);

const port = process.env.PORT || 8000;
app.listen(port, () => { console.log(`listening on port ${port}....`); });

export default app;
