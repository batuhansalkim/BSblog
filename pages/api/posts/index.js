import dbConnect from '../../../utils/dbConnect';
import Post from '../../../models/Post';
import { authOnly } from '../../../middleware/auth';

async function handler(req, res) {
    if (req.method === 'GET') {
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
    } else if (req.method === 'POST') {
        try {
            await dbConnect();

            const { title, content, excerpt, category, coverImage, isPublic } = req.body;

            // Validate required fields
            if (!title || !content || !excerpt || !category) {
                return res.status(400).json({ error: 'Lütfen tüm gerekli alanları doldurun' });
            }

            // Create new post
            const post = await Post.create({
                title,
                content,
                excerpt,
                category,
                coverImage,
                isPublic,
                author: req.user.id
            });

            res.status(201).json(post);
        } catch (error) {
            console.error('Create post error:', error);
            res.status(500).json({ error: 'Blog yazısı oluşturulurken bir hata oluştu' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

// Sadece POST istekleri için yetkilendirme gereksin
export default function handlerWithAuth(req, res) {
    if (req.method === 'GET') {
        return handler(req, res);
    }
    return authOnly(handler)(req, res);
} 