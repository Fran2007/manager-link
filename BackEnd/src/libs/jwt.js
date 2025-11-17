import jwt from "jsonwebtoken";

import { TOKEN_SECRET } from "../config.js";


export function createAccessToken(payload) {

 return new Promise((resovle, reject) => {
     jwt.sign(
          payload,
          TOKEN_SECRET,
          {expiresIn: 86400}, // 24 hours
          (err, token) => {
               if(err) reject(err);
               resovle(token);
          }
     )
   })

}
  
  