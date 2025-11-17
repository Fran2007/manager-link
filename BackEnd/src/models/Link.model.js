import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true, // Índice para búsquedas rápidas por usuario
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        required: true,
        index: true, // Índice para búsquedas rápidas por carpeta
    }
}, {
    timestamps: true
});

// Índice compuesto para búsquedas por carpeta y fecha
LinkSchema.index({ folder: 1, createdAt: -1 });
// Índice compuesto para búsquedas por usuario y carpeta
LinkSchema.index({ user: 1, folder: 1 });

export default mongoose.model("Link", LinkSchema);

