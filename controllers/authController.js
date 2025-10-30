import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const SECRET_KEY = process.env.SECRET_KEY || 'Aliya-store@1234';

export const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res
        .status(403)
        .json({ message: 'Adminni faqat mavjud admin yaratishi mumkin' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin yaratildi' });
  } catch (error) {
    res.status(500).json({ message: 'Xatolik', error: error.message });
  }
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  console.log('🔐 Login attempt:', { username: username });

  try {
    if (!username || !password) {
      return res.status(400).json({
        message: "Username va parol to'ldirilishi shart!",
        received: { username: !!username, password: !!password },
      });
    }

    const admin = await Admin.findOne({ username });

    console.log('👤 Admin found:', !!admin);

    if (!admin) {
      return res.status(404).json({ message: 'Admin topilmadi' });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    console.log('🔑 Password valid:', isValid);

    if (!isValid) {
      return res.status(401).json({ message: "Parol noto'g'ri" });
    }

    const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: '7d' });

    console.log('✅ Login successful, token generated');

    res.status(200).json({ message: 'Login muvaffaqiyatli', token });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Xatolik', error: error.message });
  }
};
