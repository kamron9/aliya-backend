import Product from '../models/Product.js'
import Category from '../models/Category.js'
export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find().populate('category', 'title')
		res.status(200).json(products)
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const getProductById = async (req, res) => {
	try {
		const { id } = req.params
		const product = await Product.findById(id).populate('category', 'title')

		if (!product) return res.status(404).json({ message: 'Mahsulot topilmadi' })

		res.status(200).json(product)
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}
export const createProduct = async (req, res) => {
	try {
		const product = new Product(req.body)
		await product.save()
		res.status(201).json(product)
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const updateProduct = async (req, res) => {
	try {
		const { id } = req.params
		const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		})

		if (!updatedProduct)
			return res.status(404).json({ message: 'Mahsulot topilmadi' })

		res
			.status(200)
			.json({ message: 'Mahsulot yangilandi', product: updatedProduct })
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}
export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params
		await Product.findByIdAndDelete(id)
		res.status(200).json({ message: 'Mahsulot o‘chirildi' })
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}




export const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.query
    const category = await Category.findOne({ urlSlug: slug })
    if (!category) {
      return res.status(404).json({ message: 'Kategoriya topilmadi' })
    }
    const products = await Product.find({ category: category._id }).populate('category', 'title')

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: 'Xatolik', error: error.message })
  }
}
