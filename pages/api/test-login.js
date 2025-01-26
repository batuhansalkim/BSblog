import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    try {
        await dbConnect();

        const user = await User.findOne({ email: 'admin@example.com' });
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        // Test şifresi ile karşılaştır
        const isMatch = await bcrypt.compare('admin123', user.password);

        res.status(200).json({
            passwordMatch: isMatch,
            passwordLength: user.password.length,
            passwordStart: user.password.substring(0, 10) + '...'
        });
    } catch (error) {
        console.error('Test login error:', error);
        res.status(500).json({ error: 'Test başarısız' });
    }
} 