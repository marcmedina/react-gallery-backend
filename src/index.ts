import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { routes } from './routes';

const app = express();
const port = process.env.port || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
  type: "*/*"
}));
app.use(cors());

routes(app);

app.listen( 3001, () => {
  console.log( `server started at http://localhost:${ port }` );
});

module.exports = app;