import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Userlogin } from './data.interface';

const generateJWT = (name: string, email: string) => {
    const payload = { name, email };
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET_JWT_SEED!, {
            expiresIn: '12h'
        }, (error, token) => {
            if (error) {
                console.log(error);
                reject( error );
            } else {
                resolve( token );
            }
        });
    });
}

const authMiddleware = (req: Request<void, void, Userlogin>, resp: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
          return resp.status(401).json({ message: 'No se ha proporcionado un token de autenticación' });
        }
      const decoded = jwt.verify(token, process.env.SECRET_JWT_SEED!);
      next();
    } catch (error) {
      console.error(error);
      resp.status(401).json({ message: 'Token de autenticación inválido' });
    }
  };

export {
    generateJWT,
    authMiddleware
}