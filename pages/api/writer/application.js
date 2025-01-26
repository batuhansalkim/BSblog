import dbConnect from '../../../utils/dbConnect';
import { authOnly } from '../../../middleware/auth';
import WriterApplication from '../../../models/WriterApplication';

async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const application = await WriterApplication.findOne({
                user: req.user.id
            }).sort({ createdAt: -1 });

            res.status(200).json({ application });
        } catch (error) {
            console.error('Get application error:', error);
            res.status(500).json({ error: 'Başvuru bilgileri alınırken bir hata oluştu' });
        }
    } else if (req.method === 'POST') {
        try {
            // Check if user already has a pending application
            const existingApplication = await WriterApplication.findOne({
                user: req.user.id,
                status: 'pending'
            });

            if (existingApplication) {
                return res.status(400).json({ error: 'Zaten bekleyen bir başvurunuz bulunuyor' });
            }

            const { message } = req.body;

            if (!message || message.trim().length === 0) {
                return res.status(400).json({ error: 'Başvuru mesajı boş olamaz' });
            }

            const application = await WriterApplication.create({
                user: req.user.id,
                message,
                status: 'pending'
            });

            res.status(201).json(application);
        } catch (error) {
            console.error('Create application error:', error);
            res.status(500).json({ error: 'Başvuru oluşturulurken bir hata oluştu' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default authOnly(handler); 