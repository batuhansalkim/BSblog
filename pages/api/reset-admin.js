import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        // Yeni şifreyi hashle
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Admin kullanıcısının şifresini güncelle
        const updatedUser = await User.findOneAndUpdate(
            { email: 'admin@example.com' },
            { $set: { password: hashedPassword } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Admin kullanıcısı bulunamadı' });
        }

        res.status(200).json({ message: 'Admin şifresi başarıyla sıfırlandı' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Şifre sıfırlama hatası' });
    }
} 