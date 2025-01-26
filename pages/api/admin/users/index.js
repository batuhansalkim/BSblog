import dbConnect from '../../../../utils/dbConnect';
import { adminOnly } from '../../../../middleware/auth';
import User from '../../../../models/User';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        // Get all users except the current admin
        const users = await User.find({ _id: { $ne: req.user.id } })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json(users);
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ error: 'Kullanıcılar yüklenirken bir hata oluştu' });
    }
}

export default adminOnly(handler); 