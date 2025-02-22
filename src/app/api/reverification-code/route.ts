import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    // getting details from request json
    const { username } = await request.json();
    if (!username) {
      return Response.json(
        {
          success: false,
          message: "Username is missing",
        },
        { status: 400 }
      );
    }
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const user = await UserModel.findOneAndUpdate({ username }, { verifyCode, verifyCodeExpiry });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    // send verification email again
    const emailResponse = await sendVerificationEmail( user.email, user.username, verifyCode);

    if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message
          }, {status: 500}
        )
      }

    return Response.json(
      {
        success: true,
        message: "Verification code send successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
