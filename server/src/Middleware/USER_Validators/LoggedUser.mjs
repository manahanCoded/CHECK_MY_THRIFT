import jwt from "jsonwebtoken"

function userLoggin(req, res, next) {
  const token = req.cookies.CMT 

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
      return next();
    }

    req.user = decoded; 
    next();
  });
}

export default userLoggin