import connect from "../../../lib/db";
import Category from "../../../lib/models/category";
import User from "../../../lib/models/users";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

//catagiry was seen by those user only who are created that catagiriy

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Id not found" }), {
        status: 400,
      });
    }
    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "user not found in the database" }),
        { status: 400 }
      );
    }

    //category with use id

    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });

    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new NextResponse("Error in fetching Categories", error.message, {
      status: 500,
    });
  }
};

//post
export const POST = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }
    await connect();
    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });
    await newCategory.save();

    return new NextResponse(
      JSON.stringify({ message: "Category created sucessfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Errro in creating the category", error.message, {
      status: 500,
    });
  }
};
