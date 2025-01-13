import Product from '../models/Product.js'

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find()
		res.status(200).json(products)
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const getProductById = async (req, res) => {
	try {
		const { id } = req.params
		const product = await Product.findById(id)

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
