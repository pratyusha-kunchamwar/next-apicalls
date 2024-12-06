import { NextResponse } from "next/server";
import connect from "../../../../lib/db";
import Blog from "../../../../lib/models/blog";
import { Types } from "mongoose";
import User from "../../../../lib/models/users";
import Category from "../../../../lib/models/category";
import { request } from "http";

//to get single blog we are using this
export const GET = async (request, context) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

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

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Blog id  not found" }),
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

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }
    return new NextResponse(JSON.stringify({ blog }));
  } catch (error) {
    return new NextResponse("Error in fetching blogs" + error.message, {
      status: 500,
    });
  }
};

//to patch req
//only user has permission to update the blog
export const PATCH = async (request, context) => {
  const blogId = context.params.blog;
  try {
    const body = await request.json();
    const { title, description } = body;

    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "userId not found" }), {
        status: 400,
      });
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Blog id  not found" }),
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

    const blog = await Blog.findById({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "blog not found" }), {
        status: 400,
      });
    }

    const updateBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({ message: "Blog Updated", blog: updateBlog }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in Editing the blogs" + error.message, {
      status: 500,
    });
  }
};

//to delete
export const DELETE = async (request, context) => { 
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "userId not found" }), {
        status: 400,
      });
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Blog id  not found" }),
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

    const blog = await Blog.findById({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "blog not found" }), {
        status: 400,
      });
    }

    await Blog.findByIdAndDelete(blogId);

    return new NextResponse(JSON.stringify({ message: "Blog is deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error in Deleting  the blogs" + error.message, {
      status: 500,
    });
  }
};
