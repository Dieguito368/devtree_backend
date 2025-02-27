import mongoose from "mongoose";
import colors from 'colors';

export const connectDB = async () => {
    try {
        const url = process.env.DATABASE_URL;
    
        const connection = await mongoose.connect(url);

        const { host, port } = connection.connection;

        console.log(colors.bgGreen.bold(`MongoBD conectado en ${host}:${port}`));
    } catch (error) {
        console.log(colors.bgRed.bold(error.message));

        process.exit(1);        
    }
}