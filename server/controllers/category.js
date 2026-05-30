// const Category = require('../models/category')
// const Product = require('../models/product')
// const Sub = require('../models/sub')
// const slugify = require('slugify')

const Category = require('../models/category');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { audit } = require('../utils/audit');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .populate('postsCount')
    .sort({ order: 1, name: 1 })
    .lean();
  sendSuccess(res, { data: categories });
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).populate('postsCount');
  if (!category) throw new AppError('Category not found.', 404);
  sendSuccess(res, { data: category });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ ...req.body, createdBy: req.user._id });
  await audit('CREATE_CATEGORY', { userId: req.user._id, resourceType: 'Category', resourceId: category._id, req });
  sendSuccess(res, { statusCode: 201, message: 'Category created.', data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) throw new AppError('Category not found.', 404);
  await audit('UPDATE_CATEGORY', { userId: req.user._id, resourceType: 'Category', resourceId: category._id, req });
  sendSuccess(res, { message: 'Category updated.', data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new AppError('Category not found.', 404);
  await audit('DELETE_CATEGORY', { userId: req.user._id, resourceType: 'Category', resourceId: category._id, req });
  sendSuccess(res, { message: 'Category deleted.' });
});

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };

// exports.create = async (req, res) => {
//     try{
//         const { name } = req.body;
//         const newCategory = await new Category({ 
//             name, 
//             slug: slugify(name),
//         }).save();
//         res.json(newCategory)
//     }catch(err){
//         // console.log(err);
//         res.status(400).send("Create Category Failed")
//     }
// }
// exports.list = async (req, res) => {
//     res.json(await Category.find({}).sort({ createdAt: -1 }).exec())
// }

// exports.remove = async (req, res) => {
//     try{
//         const deleted = await Category.findOneAndDelete({slug: req.params.slug})
//         res.json(deleted)
//     }
//     catch(err){
//         res.status(400).send('Create Delete Failed')
//     }
// }
// exports.read = async (req, res) => {
//     let category = await Category.findOne({slug: req.params.slug}).exec()
    
//     const products = await Product.find({ category })
//     .populate('category')
//     .exec()
//     res.json({category,products,})
// }
// exports.update = async (req, res) => {
//     const {name} = req.body
//     try{
//         const updated = await Category.findOneAndUpdate({slug: req.params.slug}, { name, slug: slugify(name)}, {new: true})
//         res.json(updated)
//     }
//     catch(err){
//         res.status(400).send('Create Update Failed')
//     }
// }

// exports.getSubs = async(req,res) => {
//     const newSubs = await Sub.find({parent: req.params._id}).exec()
//     res.json(newSubs);
// }
