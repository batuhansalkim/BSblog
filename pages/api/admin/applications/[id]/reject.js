import dbConnect from '../../../../../utils/dbConnect';
import { adminOnly } from '../../../../../middleware/auth';
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

        // Update application status
        application.status = 'rejected';
        await application.save();

        res.status(200).json({ message: 'Başvuru reddedildi' });
    } catch (error) {
        console.error('Reject application error:', error);
        res.status(500).json({ error: 'Başvuru reddedilirken bir hata oluştu' });
    }
}

export default adminOnly(handler); 