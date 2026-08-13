import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { Prisma } from '../generated/prisma/client'
import { CreateCategoryInput, CreateProductInput, UpdateProductInput } from '../schemas/product.schema'



export const createCategory = async (req: Request<{}, {}, CreateCategoryInput>, res: Response) => {
  try {
    const category = await prisma.category.create({
      data: { name: req.body.name }
    })
    return res.status(201).json({ message: 'Category created', category })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Category already exists' })
    }
    console.log(error.message, 'Something went wrong')
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createProduct = async (req: Request<{}, {}, CreateProductInput>, res: Response) => {
  const { productName, description, price, stock, categoryId } = req.body

  try {
    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!categoryExists) return res.status(400).json({ message: 'Category does not exist' })

    const product = await prisma.product.create({
      data: {
        productName,
        description,
        price: new Prisma.Decimal(price),
        stock: stock ?? 0,
        category: { connect: { id: categoryId } }
      }
    })

    return res.status(201).json({ message: 'Product created successfully', product })
  } catch (error: any) {
    console.log(error.message, 'Something went wrong')
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getProducts = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1)
  const limit = Math.min(Number(req.query.limit) || 10, 100)
  const skip = (page - 1) * limit

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count()
    ])

    return res.status(200).json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.log(error.message, 'Something went wrong')
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getProductById = async (req: Request<{ id: string }>, res: Response) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid product id' })

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    })

    if (!product) return res.status(404).json({ message: 'Product not found' })

    return res.status(200).json({ product })
  } catch (error: any) {
    console.log(error.message, 'Something went wrong')
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateProduct = async (
  req: Request<{ id: string }, {}, UpdateProductInput>,
  res: Response
) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid product id' })

  const { productName, description, price, stock, categoryId } = req.body

  try {
    if (categoryId !== undefined) {
      const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } })
      if (!categoryExists) return res.status(400).json({ message: 'Category does not exist' })
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(productName !== undefined && { productName }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: new Prisma.Decimal(price) }),
        ...(stock !== undefined && { stock }),
        ...(categoryId !== undefined && { category: { connect: { id: categoryId } } })
      }
    })

    return res.status(200).json({ message: 'Product updated', product })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found' })
    }
    console.log(error.message, 'Something went wrong')
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteProduct = async (req: Request<{ id: string }>, res: Response) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid product id' })

  try {
    await prisma.product.delete({ where: { id } })
    return res.status(200).json({ message: 'Product deleted' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found' })
    }
    console.log(error.message, 'Something went wrong')
    return res.status(500).json({ message: 'Server error' })
  }
}