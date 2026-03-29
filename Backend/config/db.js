import mongoose from "mongoose";

const connectDB= async()=>{
    try {
        const conn= mongoose.connect("mongodb+srv://bijaykarki123:123456787654321@cluster0.srfk3uz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
            dbName: "Furniture"
        });
        console.log('Database connected');
    } catch (error) {
        console.log(error);
        
    }
}

export default connectDB;