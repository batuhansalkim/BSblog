import dbConnect from '../../../utils/dbConnect';
import { writerOnly } from '../../../middleware/auth';
import Post from '../../../models/Post';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const posts = await Post.find({ author: req.user.id });

        const stats = {
            totalPosts: posts.length,
            totalLikes: posts.reduce((sum, post) => sum + post.likes.length, 0),
            totalComments: posts.reduce((sum, post) => sum + post.comments.length, 0),
            totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0)
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error('Get writer stats error:', error);
        res.status(500).json({ error: 'İstatistikler yüklenirken bir hata oluştu' });
    }
}

export default writerOnly(handler); 