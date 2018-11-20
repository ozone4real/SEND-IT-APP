export default (req, res, next) => {
  res.status(500).send('<h1>Internal Server Error. Something failed</h1>');
  next();
};
