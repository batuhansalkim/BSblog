import dbConnect from '../../../../utils/dbConnect';
import { authOnly } from '../../../../middleware/auth';
import Post from '../../../../models/Post';
import Comment from '../../../../models/Comment';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const { id } = req.query;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Yorum içeriği boş olamaz' });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
        }

        const comment = await Comment.create({
            content,
            user: userId,
            post: id
        });

        post.comments.push(comment._id);
        await post.save();

        // Populate user info before sending response
        await comment.populate('user', 'username');

        res.status(201).json(comment);
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ error: 'Yorum eklenirken bir hata oluştu' });
    }
}

export default authOnly(handler); 