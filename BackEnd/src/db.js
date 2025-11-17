import mongoose from "mongoose"

export const connectDB = async () => {

try {
await mongoose.connect(MONGO_URL)
console.log(">>> Database connected successfully")
}
catch (error) {
 console.error("Error connecting to the database", error)
}

}