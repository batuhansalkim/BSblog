import dbConnect from '../../../../../utils/dbConnect';
import { adminOnly } from '../../../../../middleware/auth';
import User from '../../../../../models/User';
import WriterApplication from '../../../../../models/WriterApplication';

async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const { id } = req.query;

        // Find application
        const application = await WriterApplication.findOne({
            user: id,
            status: 'pending'
        });

        if (!application) {
            return res.status(404).json({ error: 'Başvuru bulunamadı' });
        }

        // Update user role
        await User.findByIdAndUpdate(id, { role: 'writer' });

        // Update application status
        application.status = 'approved';
        await application.save();

        res.status(200).json({ message: 'Başvuru onaylandı' });
    } catch (error) {
        console.error('Approve application error:', error);
        res.status(500).json({ error: 'Başvuru onaylanırken bir hata oluştu' });
    }
}

export default adminOnly(handler); 