import mongoose, { Schema, model } from 'mongoose';
import { ICategory } from '../interface/common';



const categorySchema = new Schema<ICategory>({
  specializationId: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, 
  isListed: { type: Boolean, default: true },
});

// Create the Category model
const CategoryModel = model<ICategory>('Category', categorySchema);
export default CategoryModel;
