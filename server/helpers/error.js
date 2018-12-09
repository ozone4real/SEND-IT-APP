export default (req, res, next) => {
  res.status(404).json({ message: 'Route/resource does not exist' });
  next();
};
