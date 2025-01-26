import dbConnect from '../../../../../utils/dbConnect';
import { adminOnly } from '../../../../../middleware/auth';
import User from '../../../../../models/User';

async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const { id } = req.query;
        const { role } = req.body;

        // Validate role
        if (!['user', 'writer', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Geçersiz rol' });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Role change error:', error);
        res.status(500).json({ error: 'Rol değiştirirken bir hata oluştu' });
    }
}

export default adminOnly(handler); 