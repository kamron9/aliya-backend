import jwt from 'jsonwebtoken'

const SECRET_KEY = 'Aliya-store@1234'

export const verifyToken = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token) return res.status(403).json({ message: 'Token mavjud emas' })

	try {
		const decoded = jwt.verify(token, SECRET_KEY)
		req.adminId = decoded.id // Admin ID-ni saqlash
		next()
	} catch (error) {
		res.status(401).json({ message: 'Noto‘g‘ri yoki muddati o‘tgan token' })
	}
}
