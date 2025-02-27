import { Router } from 'express';
import { body, param } from 'express-validator';
import { createAccount, getUser, getUserByHandle, login, searchByHandle, updateProfile, uploadImage } from './handlers';
import { handleInputErrors } from './middleware/validation';
import { authenticate } from './middleware/auth';

const router = Router();

router.post('/auth/register', 
    body('handle')
        .notEmpty().withMessage('El handle es obligatorio'),    
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),    
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email no válido'),    
    body('password')
        .isLength({ min: 8 }).withMessage('El password debe contener más de 8 caracteres')
        .notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors, 
    createAccount   
);

router.post('/auth/login', 
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email no válido'),    
    body('password')
        .notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    login
);

router.get('/user', authenticate, getUser);

router.patch('/user',
    body('handle')
        .notEmpty().withMessage('El handle es obligatorio'),    
    handleInputErrors,
    authenticate, 
    updateProfile
);

router.post('/user/image', 
    authenticate,
    uploadImage
);

router.get('/:handle', getUserByHandle);

router.post('/search',
    body('handle')
        .notEmpty().withMessage('El handle es obligatorio'),
    handleInputErrors,
    searchByHandle
);

export default router;