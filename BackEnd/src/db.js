import mongoose from "mongoose"

export const connectDB = async () => {

try {
await mongoose.connect("mongodb+srv://Franklin:2rqJ7oJ6zz12@managerlinks.i25wptw.mongodb.net/")
console.log(">>> Database connected successfully")
}
catch (error) {
 console.error("Error connecting to the database", error)
}

}