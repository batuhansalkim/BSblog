import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    try {
        await dbConnect();

        // Önce mevcut kullanıcıyı bul
        const user = await User.findOne({ email: 'admin@example.com' });
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        // Şifreyi bcrypt ile hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Kullanıcının şifresini güncelle
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Şifre başarıyla güncellendi' });
    } catch (error) {
        console.error('Fix admin error:', error);
        res.status(500).json({ error: 'İşlem başarısız' });
    }
} 