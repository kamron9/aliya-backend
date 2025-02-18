import Carousel from '../models/Carousel.js'

export const getCarousel = async (req, res) => {
	try {
		const carousel = await Carousel.findOne()
		res.status(200).json(carousel)
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const createCarousel = async (req, res) => {
	try {
		const { title, image, description } = req.body
		const carousel = new Carousel({ title, image, description })
		await carousel.save()
		res.status(201).json(carousel)
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const updateCarousel = async (req, res) => {
	try {
		const { id } = req.params
		const { title, image, description } = req.body
		const updatedCarousel = await Carousel.findByIdAndUpdate(
			id,
			{ title, image, description },
			{
				new: true,
				runValidators: true,
			}
		)
		if (!updatedCarousel) {
			return res.status(404).json({ message: 'Karousel topilmadi' })
		}
		res
			.status(200)
			.json({ message: 'Karousel yangilandi', carousel: updatedCarousel })
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}

export const deleteCarousel = async (req, res) => {
	try {
		const { id } = req.params
		const deletedCarousel = await Carousel.findByIdAndDelete(id)
		if (!deletedCarousel) {
			return res.status(404).json({ message: 'Karousel topilmadi' })
		}
		res.status(200).json({ message: 'Karousel o`chirildi' })
	} catch (error) {
		res.status(500).json({ message: 'Xatolik', error: error.message })
	}
}
