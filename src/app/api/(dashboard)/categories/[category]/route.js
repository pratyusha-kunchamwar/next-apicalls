import connect from "../../../../lib/db";
import Category from "../../../../lib/models/category";
import User from "../../../../lib/models/users";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const PATCH = async (request, context) => {
  const categoryId = context.params.category;

  try {
    const body = await request.json();
    const { title } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    console.log("Category ID from context.params:", categoryId);

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "userId not found" }), {
        status: 400,
      });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "CategoryId not found" }),
        {
          status: 400,
        }
      );
    }
    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "user not found" }), {
        status: 400,
      });
    }
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category not found" }),
        {
          status: 400,
        }
      );
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Catogery Updated",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      "Error While updateing the category",
      error.message,
      {
        status: 500,
      }
    );
  }
};
//delete
export const DELETE = async (request, context) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "userId not found" }), {
        status: 400,
      });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "CategoryId not found" }),
        {
          status: 400,
        }
      );
    }
    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "user not found" }), {
        status: 400,
      });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }
    await Category.findByIdAndDelete(categoryId);
    return new NextResponse(JSON.stringify({ message: "Category deleted" }), {
      status: 200,
    });
  } catch (error) {
    return NextResponse("Error in deleteing the Category" + error.message, {
      status: 500,
    });
  }
};
