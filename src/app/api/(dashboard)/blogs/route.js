import { NextResponse } from "next/server";
import connect from "../../../lib/db";
import Blog from "../../../lib/models/blog";
import { Types } from "mongoose";
import User from "../../../lib/models/users";
import Category from "../../../lib/models/category";

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchKeywords = searchParams.get("keywords");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    

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
    console.log("Database connected successfully");
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "user not found" }), {
        status: 400,
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category not found" }),
        {
          status: 400,
        }
      );
    }
    const filter = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    if (searchKeywords) {
      filter.$or = [
        {
          title: { $regex: searchKeywords, $options: "i" },
        },
        {
          description: { $regex: searchKeywords, $options: "i" },
        },
      ];
    }
    //for searching according to the dates of the blogs 

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
      };
    } else if(endDate) {
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }

    //todo working on this thing
    const blogs = await Blog.find(filter).sort({ createdAt: 1 }); // 1 for ascending, -1 for descending


    return new NextResponse(JSON.stringify({ blogs }), { status: 200 });
  } catch (error) {
    return new NextResponse("Error in fetching the all the  blogs" + error.message, {
      status: 500,
    });
  }
};

//post
export const POST = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const body = await request.json();
    const { title, description } = body;

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

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category not found" }),
        {
          status: 400,
        }
      );
    }

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });
    await newBlog.save();
    return new NextResponse(
      JSON.stringify({ message: "Blog is created", blog: newBlog }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse("Error in fetching the blogs", error.message, {
      status: 500,
    });
  }
};
