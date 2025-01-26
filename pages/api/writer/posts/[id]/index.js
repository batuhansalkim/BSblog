import dbConnect from '../../../../../utils/dbConnect';
import { writerOnly } from '../../../../../middleware/auth';
import Post from '../../../../../models/Post';
import Comment from '../../../../../models/Comment';

async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            await dbConnect();

            const post = await Post.findOne({ _id: id, author: req.user.id });

            if (!post) {
                return res.status(404).json({ error: 'Yazı bulunamadı' });
            }

            res.status(200).json(post);
        } catch (error) {
            console.error('Get post error:', error);
            res.status(500).json({ error: 'Yazı yüklenirken bir hata oluştu' });
        }
    } else if (req.method === 'PUT') {
        try {
            await dbConnect();

            const { title, content, category, coverImage, excerpt } = req.body;

            // Validate required fields
            if (!title || !content || !category || !excerpt) {
                return res.status(400).json({ error: 'Lütfen tüm gerekli alanları doldurun' });
            }

            const post = await Post.findOne({ _id: id, author: req.user.id });

            if (!post) {
                return res.status(404).json({ error: 'Yazı bulunamadı' });
            }

            // Update post
            post.title = title;
            post.content = content;
            post.category = category;
            post.coverImage = coverImage;
            post.excerpt = excerpt;
            post.updatedAt = Date.now();

            await post.save();

            res.status(200).json(post);
        } catch (error) {
            console.error('Update post error:', error);
            res.status(500).json({ error: 'Yazı güncellenirken bir hata oluştu' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await dbConnect();

            // Find post and check ownership
            const post = await Post.findOne({
                _id: id,
                author: req.user.id
            });

            if (!post) {
                return res.status(404).json({ error: 'Yazı bulunamadı' });
            }

            // Delete all comments associated with the post
            await Comment.deleteMany({ post: id });

            // Delete the post
            await post.deleteOne();

            res.status(200).json({ message: 'Yazı başarıyla silindi' });
        } catch (error) {
            console.error('Delete post error:', error);
            res.status(500).json({ error: 'Yazı silinirken bir hata oluştu' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default writerOnly(handler); 