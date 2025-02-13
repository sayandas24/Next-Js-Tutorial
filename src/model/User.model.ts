import mongoose, { Schema, Document } from "mongoose";

// Interface is like class without implementation
export interface Message extends Document {
  content: string; // in mongoose string is in small
  createdAt: Date;
}

// Schema<Message> :this is only type safety
const MessageSchema: Schema<Message> = new Schema({
  content: {
    // from Message interface;
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// User schema
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[]; // Message type array (from interface)
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"], // if not true custom msg will show
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please user valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: {
    type: [MessageSchema], // refer-ing the messageSchema array
  },
});

// If model not exist in mongoDB then the or|| will create a model in mongoDb
// model type accepted from mongoDb only this type: mongoose.Model<User> === User type
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
