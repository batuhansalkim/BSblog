import dbConnect from '../../../../utils/dbConnect';
import { adminOnly } from '../../../../middleware/auth';
import Post from '../../../../models/Post';

async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const posts = await Post.find()
                    .populate('author', 'username')
                    .sort({ createdAt: -1 });

                res.status(200).json(posts);
            } catch (error) {
                console.error('Admin posts error:', error);
                res.status(500).json({ error: 'Blog yazıları yüklenirken bir hata oluştu' });
            }
            break;

        case 'POST':
            try {
                const { title, content, excerpt, category, isPublic } = req.body;

                // Validate required fields
                if (!title || !content || !excerpt || !category) {
                    return res.status(400).json({ error: 'Tüm alanları doldurunuz' });
                }

                // Create post
                const post = await Post.create({
                    title,
                    content,
                    excerpt,
                    category,
                    isPublic,
                    author: req.user.id,
                });

                res.status(201).json(post);
            } catch (error) {
                console.error('Create post error:', error);
                res.status(500).json({ error: 'Blog yazısı oluşturulurken bir hata oluştu' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).json({ error: `Method ${method} not allowed` });
    }
}

export default adminOnly(handler); 