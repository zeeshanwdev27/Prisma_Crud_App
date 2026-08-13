import express from 'express'
import { createCategory, createProduct,  getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller'
import { validate } from '../middleware/validate.middleware'
import { createCategorySchema, createProductSchema, updateProductSchema } from '../schemas/product.schema'

const router = express.Router()

router.post('/createcategory', validate(createCategorySchema), createCategory)
router.post('/createproduct', validate(createProductSchema), createProduct)

router.get('/products', getProducts)
router.get('/products/:id', getProductById)
router.patch('/products/:id', validate(updateProductSchema), updateProduct)
router.delete('/products/:id', deleteProduct)

export default router