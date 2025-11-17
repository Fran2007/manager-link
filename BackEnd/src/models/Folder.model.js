import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true, // Índice para búsquedas rápidas por usuario
    }
}, {
    timestamps: true
});

// Índice compuesto para búsquedas por usuario y fecha
FolderSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Folder", FolderSchema);

