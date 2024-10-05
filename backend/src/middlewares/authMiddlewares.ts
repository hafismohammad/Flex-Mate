// import { NextFunction, Request, Response } from "express";

// const jwt = require('jsonwebtoken');

// // Middleware to verify Access Token
// const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.sendStatus(401); // No token found

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403); // Token is invalid or expired
//     req.user = user;
//     next(); // Token is valid, proceed to the route
//   });
// };

// module.exports = authenticateToken;
