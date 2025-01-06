const jwtMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token ausente');
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send('Token inválido');
      req.user = user;
      next();
    });
  };
  
  app.post('/login', (req, res) => {
    const { username } = req.body;
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
  