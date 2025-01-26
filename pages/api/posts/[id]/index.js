import dbConnect from '../../../../utils/dbConnect';
import Post from '../../../../models/Post';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const { id } = req.query;
        const post = await Post.findById(id)
            .populate('author', 'username')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username'
                },
                options: { sort: { createdAt: -1 } }
            });

        if (!post) {
            return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ error: 'Blog yazısı yüklenirken bir hata oluştu' });
    }
} 