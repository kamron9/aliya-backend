import Category from '../models/Category.js'

export const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find()
		res.status(200).json(categories)
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const getCategoryById = async (req, res) => {
	try {
		const { id } = req.params
		const category = await Category.findById(id)
		if (!category) {
			return res.status(404).json({ message: 'Kategoriya topilmadi' })
		}
		res.status(200).json(category)
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const createCategory = async (req, res) => {
	try {
		const { title } = req.body
		const category = new Category({ title })
		await category.save()
		res.status(201).json(category)
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const updateCategory = async (req, res) => {
	try {
		const { id } = req.params
		const { title } = req.body
		const updatedCategory = await Category.findByIdAndUpdate(id, title, {
			new: true,
			runValidators: true,
		})
		if (!updatedCategory) {
			return res.status(404).json({ message: 'Kategoriya topilmadi' })
		}
		res.status(200).json({ message: 'Kategoriya yangilandi', category: updatedCategory })
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const deleteCategory = async (req, res) => {
	try {
		const { id } = req.params
		await Category.findByIdAndDelete(id)
		res.status(200).json({ message: 'Kategoriya o‘chirildi' })
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

