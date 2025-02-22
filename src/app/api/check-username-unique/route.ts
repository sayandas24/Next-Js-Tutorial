import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

// check username is unique or not
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

// check username is available or not when user is typing
export async function GET(request: Request) {

  await dbConnect();
   
  try {
    // getting the whole url
    // extracting the ?query
    const { searchParams } = new URL(request.url);
    const queryParam = {
      // getting the username from query
      username: searchParams.get("username"),
    };
    // validate using zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    // if parsing safe then i'll get the result
    console.log(result); // TODO: remove

    // if any error in result
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }
    // if username is good>
    const { username } = result.data;
     
    // if user present and verified
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
        return Response.json({
            success: false,
            message: "Username is already taken"
        }, {status: 400})
    }
    // else case
    return Response.json({
        success: true,
        message: "Username is available"
    }, {status: 200})


  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
