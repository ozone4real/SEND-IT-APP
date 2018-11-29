export default (req, res, next) => {
  res.status(500).json({ message: 'Route does not exist' });
  next();
};
