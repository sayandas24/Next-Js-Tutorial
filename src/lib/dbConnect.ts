import mongoose from "mongoose";

// type of the object? that will received here
type ConnectionObject = {
  isConnection?: number;
};
// Only connection is accepted
const connection: ConnectionObject = {};

// Promise<void> <-this means it returns promise (Void type)
async function dbConnect(): Promise<void> {
  if (connection.isConnection) {
    //if database already connected before then return
    console.log("Already connected to DB");
    return;
  }

  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URI}/mystrymsg` || "");

    // checking if database connection fully ready?(readyState)
    // pass data true/false to -> connection.isConnection (condition)
    connection.isConnection = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed: ", error);
    process.exit; // exit process if not connected
  }
}

export default dbConnect;
