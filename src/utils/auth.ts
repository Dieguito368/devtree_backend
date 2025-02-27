import bcypt from 'bcrypt';
import { Response } from 'express';

export const hashPassword = async (password: string) => {
    const salt = await bcypt.genSalt(10);

    return await bcypt.hash(password, salt);
}

export const checkPassword = async (enteredPassword: string, hashedPassword: string) => await bcypt.compare(enteredPassword, hashedPassword);
    
export const sendAuthError = (res: Response, message: string) => {
    res.status(401).json({ error: message });
}