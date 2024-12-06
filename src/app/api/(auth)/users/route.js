import { NextResponse } from "next/server";
import connect from "../../../lib/db.js";
import User from "../../../lib/models/users.js";
import { Types } from "mongoose";

//get
export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse("Error while fetching users" + error.message, {
      status: 500,
    });
  }
};

//post
export const POST = async (request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "user is created", user: newUser }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error while fetching users" + error.message, {
      status: 500,
    });
  }
};
//put
export const PATCH = async (request) => {
  try {
    const body = await request.json();
    const { userId, newUser } = body;
    await connect();
    if (!userId || !newUser) {
      return NextResponse(
        JSON.stringify({ message: "Id or new User Name Not found" }),
        {
          status: 400,
        }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse(JSON.stringify({ message: "Invalid UserId" }), {
        status: 400,
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUser },
      { new: true }
    );
    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: " User not found in the database" })
      );
    }

    return new NextResponse(
      JSON.stringify({ message: " User is Updated", user: updatedUser })
    );
  } catch (error) {
    return new NextResponse("Error in updating the user");
  }
};
//for delete

export const DELETE = async (request) => {
  try {
    //search params to get from url
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    console.log(userId);

    if (!userId) {
      return NextResponse(
        JSON.stringify({ message: "Id or new User Name Not found" }),
        {
          status: 400,
        }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse(JSON.stringify({ message: "Invalid UserId" }), {
        status: 400,
      });
    }

    await connect();
    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );
    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 400 }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "User is deleted", user: deletedUser }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in deleting the user " + error.message, {
      status: 500,
    });
  }
};
