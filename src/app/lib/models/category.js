import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  title: { type: "string", require: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;
