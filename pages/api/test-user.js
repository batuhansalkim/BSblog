import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const user = await User.findOne({ email: 'admin@example.com' });

        if (!user) {
            return res.status(404).json({ error: 'Admin kullanıcısı bulunamadı' });
        }

        // Güvenlik için şifreyi ve hassas bilgileri çıkarıyoruz
        const { password, ...userWithoutPassword } = user.toObject();

        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error('Test user error:', error);
        res.status(500).json({ error: 'Veritabanı hatası' });
    }
} 