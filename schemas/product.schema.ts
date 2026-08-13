import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required')
})

export const createProductSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().nonnegative().optional(),
  categoryId: z.number().int('categoryId must be an integer')
})

export const updateProductSchema = createProductSchema.partial()

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>