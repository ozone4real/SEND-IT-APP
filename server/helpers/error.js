export default (req, res, next) => {
  res.status(500).json({ message: 'Internal server error' });
};
