import dbConnect from '../../../../utils/dbConnect';
import { writerOnly } from '../../../../middleware/auth';
import Post from '../../../../models/Post';

async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            await dbConnect();

            const posts = await Post.find({ author: req.user.id })
                .sort({ createdAt: -1 });

            res.status(200).json(posts);
        } catch (error) {
            console.error('Get writer posts error:', error);
            res.status(500).json({ error: 'Yazılar yüklenirken bir hata oluştu' });
        }
    } else if (req.method === 'POST') {
        try {
            await dbConnect();

            const { title, content, category, coverImage, excerpt } = req.body;

            // Validate required fields
            if (!title || !content || !category || !excerpt) {
                return res.status(400).json({ error: 'Lütfen tüm gerekli alanları doldurun' });
            }

            // Create new post
            const post = await Post.create({
                title,
                content,
                category,
                coverImage,
                excerpt,
                author: req.user.id,
                likes: [],
                dislikes: [],
                comments: [],
                views: 0
            });

            res.status(201).json(post);
        } catch (error) {
            console.error('Create post error:', error);
            res.status(500).json({ error: 'Yazı oluşturulurken bir hata oluştu' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default writerOnly(handler); 