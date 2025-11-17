import mongoose from "mongoose"
import "dotenv/config"

export const connectDB = async () => {

try {
await mongoose.connect(process.env.SECRET_KEY_DB)
console.log(">>> Database connected successfully")
}
catch (error) {
 console.error("Error connecting to the database", error)
}

}