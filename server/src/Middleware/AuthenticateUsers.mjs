import jwt from "jsonwebtoken"

function AuthenticateJWT(req, res, next) {
  const token = req.cookies.CMT
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function AuthenticateJWTAdmin(req, res, next) {
  const token = req.cookies.CMT
  if (!token) return res.sendStatus(403);

  if (token.role == "admin") {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }else{
    if (err) return res.sendStatus(403);
  }
}



export { AuthenticateJWT, AuthenticateJWTAdmin };
