import type { Request, Response } from "express";
import slug from 'slug';
import formidable from "formidable";
import { v4 as uuid } from "uuid";
import User from "../models/User";
import { generateJWT } from "../utils/jwt";
import { checkPassword, hashPassword } from "../utils/auth";
import cloudinary from "../config/cloudinary";

export const createAccount = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userExists = await User.findOne({ email });

        if(userExists) {
            const error = new Error('Ya existe un usuario con ese email');

            res.status(409).json({ error: error.message });

            return;
        }

        const handle = slug(req.body.handle, '_');
        
        const handleExists = await User.findOne({ handle });

        if(handleExists) {
            const error = new Error('Handle no disponible');

            res.status(409).json({ error: error.message });

            return;
        }

        const user = new User(req.body);

        user.password = await hashPassword(password);
        user.handle = handle;

        await user.save();

        res.status(201).send('Tu cuenta se creó correctamente');
    } catch (error) {
        console.error(error);
        
        res.status(500).json({ error: "Error al crear la cuenta" } )
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
    
        if(!user) {
            const error = new Error('No pudimos encontrar tu cuenta de DevTree');
    
            res.status(404).json({ error: error.message });
            
            return; 
        }
    
        const isPasswordCorrect = await checkPassword(password, user.password);

        if(!isPasswordCorrect) {
            const error = new Error('La contraseña es incorrecta');
        
            res.status(401).json({ error: error.message });
    
            return;
        }
    
        const token = generateJWT({ id: user.id });
    
        res.status(200).send(token);
    } catch(error) {
        console.error(error);

        res.status(500).json({ error: "Ocurrió un error al iniciar sesión" });
    }
}

export const getUser = async (req: Request, res: Response) => {
    res.status(200).send(req.user)   
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const handle = slug(req.body.handle, '_');
    
        const handleExists = await User.findOne({ handle });
    
        if(handleExists && handleExists.id !== req.user.id) {
            const error = new Error('Handle no disponible');
    
            res.status(409).json({ error: error.message });
    
            return;
        }

        req.user.handle = handle;
        req.user.description = req.body.description;
        req.user.links = req.body.links;

        await req.user.save();

        res.status(200).send('Perfil actualizado correctamente')   
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: "Ocurrio un error al actualizar el perfil" });
        
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    try {
        const form = formidable({ multiples: false });

        form.parse(req, (error, fields, files) => {
            const allowedTypes = [ 'jpeg', 'jpg', 'png', 'gif', 'webp', 'avif' ];

            const imageType = files.file[0].mimetype.split('/')[1];

            if(!allowedTypes.includes(imageType)) {
                const error = new Error('Tipo de archivo no soportado');
    
                res.status(415).json({ error: error.message });
        
                return;
            }
            
            cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function(error, result) {
                if(error) {
                    res.status(500).json({ error: "Ocurrio un error al subir la imagen" });

                    return;
                }

                if(result) {
                    req.user.image = result.secure_url;

                    await req.user.save();

                    res.status(200).json({ image: result.secure_url });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Ocurrio un error al subir la imagen" });
    }
}

export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ handle: req.params.handle }).select('-_id -__v -password');

        if(!user) {
            const error = new Error('No pudimos encontrar el handle');
            res.status(404).json({ error: error.message });
            return;
        } 

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Ocurrio un error al obtener el handle" });
    }
}

export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body;

        const userExists = await User.findOne({ handle });

        if(userExists) {
            const error = new Error(`${handle} ya está registrado en DevTree`);
            res.status(409).json({ error: error.message });
            return;
        } 

        res.status(200).json(`${handle} está disponible en DevTree`);
    } catch (error) {
        res.status(500).json({ error: "Ocurrio un error al obtener el handle" });
    }
}