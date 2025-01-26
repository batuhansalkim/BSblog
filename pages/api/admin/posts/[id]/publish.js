import dbConnect from '../../../../../utils/dbConnect';
import { adminOnly } from '../../../../../middleware/auth';
import Post from '../../../../../models/Post';

async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const { id } = req.query;
        const { isPublic } = req.body;

        const post = await Post.findByIdAndUpdate(
            id,
            { isPublic },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Publish toggle error:', error);
        res.status(500).json({ error: 'Blog yazısı güncellenirken bir hata oluştu' });
    }
}

export default adminOnly(handler); 