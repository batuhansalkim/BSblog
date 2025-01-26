import dbConnect from '../../../../utils/dbConnect';
import { authOnly } from '../../../../middleware/auth';
import Post from '../../../../models/Post';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const { id } = req.query;
        const userId = req.user.id;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
        }

        // Remove from dislikes if exists
        if (post.dislikes.includes(userId)) {
            post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
        }

        // Toggle like
        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ error: 'Beğeni işlemi sırasında bir hata oluştu' });
    }
}

export default authOnly(handler); 