export default (req, res, next) => {
  res.status(500).send('<h1>Internal Server Error. Something Failed</h1>');
  next();
};
