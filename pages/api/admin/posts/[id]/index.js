import dbConnect from '../../../../../utils/dbConnect';
import { adminOnly } from '../../../../../middleware/auth';
import Post from '../../../../../models/Post';

async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const post = await Post.findById(id).populate('author', 'username');

                if (!post) {
                    return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
                }

                res.status(200).json(post);
            } catch (error) {
                console.error('Get post error:', error);
                res.status(500).json({ error: 'Blog yazısı yüklenirken bir hata oluştu' });
            }
            break;

        case 'PUT':
            try {
                const { title, content, excerpt, category, isPublic } = req.body;

                // Validate required fields
                if (!title || !content || !excerpt || !category) {
                    return res.status(400).json({ error: 'Tüm alanları doldurunuz' });
                }

                const post = await Post.findByIdAndUpdate(
                    id,
                    { title, content, excerpt, category, isPublic },
                    { new: true }
                );

                if (!post) {
                    return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
                }

                res.status(200).json(post);
            } catch (error) {
                console.error('Update post error:', error);
                res.status(500).json({ error: 'Blog yazısı güncellenirken bir hata oluştu' });
            }
            break;

        case 'DELETE':
            try {
                const post = await Post.findByIdAndDelete(id);

                if (!post) {
                    return res.status(404).json({ error: 'Blog yazısı bulunamadı' });
                }

                res.status(200).json({ message: 'Blog yazısı başarıyla silindi' });
            } catch (error) {
                console.error('Delete post error:', error);
                res.status(500).json({ error: 'Blog yazısı silinirken bir hata oluştu' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).json({ error: `Method ${method} not allowed` });
    }
}

export default adminOnly(handler); 