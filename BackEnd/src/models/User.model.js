import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },                                      //<--- sirve para decirle lo que voy a guardar
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
        MaxKeylength: 50
    },
    password: {
        type: String,
        required: true,
        unique: true,
        trim:true
    }
},{
    timestamps: true
})

export default mongoose.model("User", UserSchema) /// <--- esto es para interactuar con la base de datos con los metodos de mongoose