import jwt, { JwtPayload } from 'jsonwebtoken';

export const generateJWT = (payload: JwtPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15d"
    });
}

export const verifyJWT = (token: string) =>  jwt.verify(token, process.env.JWT_SECRET)

export const decodeJWT = (token: string) => jwt.decode(token)