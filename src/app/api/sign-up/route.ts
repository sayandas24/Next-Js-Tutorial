import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

// sing-up user route;
export async function POST(request: Request) {
  console.log("sign-up route");
  await dbConnect();
  try {
    // accessing data from frontend
    const { username, email, password } = await request.json();
    // finding user if present? with username
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // if username already exists
    if (existingUserVerifiedByUsername) { 
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        // if user email already registered
        return Response.json(
          {
            success: false,
            message: "User already registered with this email"
          }, {status: 400}
        )
      } else {
        // user with this email is present but not verified
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

        await existingUserByEmail.save()
      }


    } else {
      // make the password encrypt with 10 values(string)
      const hashedPassword = await bcrypt.hash(password, 10);

      // user model has a expiry date, so expiry date is gonna be currDate + 1 hour
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      // creating new user if not exist
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      // saving new user
      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email, username, verifyCode
    )

    // if not email success
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message
        }, {status: 500}
      )
    }

    // if email response true
    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email"
      }, {status: 201}
    )


  } catch (error) {
    console.log("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
