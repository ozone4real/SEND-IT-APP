import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import router from './routes';
import createTables from './db/migrations';
import error from './helpers/error';

const swaggerDocument = YAML.load('./server/docs/docs.yaml');
const app = express();

createTables();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.static('UI'));

app.use('/api/v1/', router);
app.use(error);

const port = process.env.PORT || 8000;
app.listen(port, () => { console.log(`listening on port ${port}....`); });

export default app;
