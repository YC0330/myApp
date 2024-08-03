// require('dotenv-flow').config();
// require('express-async-errors');
// const path = require('path');
// const cors = require('cors');
// const express = require('express');
// const cookieParser = require('cookie-parser');
// const fallback = require('@blocklet/sdk/lib/middlewares/fallback');

// const { name, version } = require('../package.json');
// const logger = require('./libs/logger');

// const app = express();

// app.set('trust proxy', true);
// app.use(cookieParser());
// app.use(express.json({ limit: '1 mb' }));
// app.use(express.urlencoded({ extended: true, limit: '1 mb' }));
// app.use(cors());

// const router = express.Router();
// router.use('/api', require('./routes'));

// app.use(router);

// const isProduction = process.env.NODE_ENV === 'production' || process.env.ABT_NODE_SERVICE_ENV === 'production';

// if (isProduction) {
//   const staticDir = path.resolve(__dirname, '../dist');
//   app.use(express.static(staticDir, { maxAge: '30d', index: false }));
//   app.use(fallback('index.html', { root: staticDir }));

//   // eslint-disable-next-line no-unused-vars
//   app.use((err, req, res, next) => {
//     logger.error(err.stack);
//     res.status(500).send('Something broke!');
//   });
// }

// const port = parseInt(process.env.BLOCKLET_PORT, 10);

// const server = app.listen(port, (err) => {
//   if (err) throw err;
//   logger.info(`> ${name} v${version} ready on ${port}`);
// });

// module.exports = {
//   app,
//   server,
// };
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fallback = require('@blocklet/sdk/lib/middlewares/fallback');
const { sequelize } = require('./models/db');
const logger = require('./libs/logger');
const userRouter = require('./routes/user');

const { name, version } = require('../package.json');

const app = express();

app.set('trust proxy', true);
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cors());

// 测试数据库连接
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// 使用用户路由
app.use('/api', userRouter);

const isProduction = process.env.NODE_ENV === 'production' || process.env.ABT_NODE_SERVICE_ENV === 'production';

if (isProduction) {
  const staticDir = path.resolve(__dirname, '../dist');
  app.use(express.static(staticDir, { maxAge: '30d', index: false }));
  app.use(fallback('index.html', { root: staticDir }));

  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
  });
} else {
  // app.get('/', (req, res) => {
  //   res.send('Development server is running');
  // });
  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
  });
}


const port = parseInt(process.env.BLOCKLET_PORT, 10) || 3001;

const server = app.listen(port, (err) => {
  if (err) throw err;
  logger.info(`> ${name} v${version} ready on http://localhost:${port}`);
});

module.exports = {
  app,
  server,
};
