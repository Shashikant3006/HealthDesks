import mongoose from 'mongoose';

const connectDB= async()=>{
    try {
        const con= await mongoose.connect(process.env.MONGO_URI);
        console.log('Database Connected');
    } catch (error) {
        console.log(`Error ${error.message}`);
    }
}
export default connectDB;