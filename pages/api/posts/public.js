import dbConnect from '../../../utils/dbConnect';
import Post from '../../../models/Post';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const posts = await Post.find({ isPublic: true })
            .populate('author', 'username')
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Fetch posts error:', error);
        res.status(500).json({ error: 'Blog yazıları yüklenirken bir hata oluştu' });
    }
} 