import dbConnect from '../../../../utils/dbConnect';
import { adminOnly } from '../../../../middleware/auth';
import User from '../../../../models/User';
import WriterApplication from '../../../../models/WriterApplication';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        // Get all pending applications with user information
        const applications = await WriterApplication.find({ status: 'pending' })
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json(applications);
    } catch (error) {
        console.error('Admin applications error:', error);
        res.status(500).json({ error: 'Başvurular yüklenirken bir hata oluştu' });
    }
}

export default adminOnly(handler); 