import dbConnect from '../../../utils/dbConnect';
import { adminOnly } from '../../../middleware/auth';
import Post from '../../../models/Post';
import User from '../../../models/User';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        // Get total posts
        const totalPosts = await Post.countDocuments();

        // Get total users
        const totalUsers = await User.countDocuments();

        // Get total comments (across all posts)
        const posts = await Post.find();
        const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0);

        // Get pending writer applications
        const pendingApplications = await User.countDocuments({
            role: 'user',
            writerApplication: { $exists: true, $ne: null }
        });

        res.status(200).json({
            totalPosts,
            totalUsers,
            totalComments,
            pendingApplications
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'İstatistikler yüklenirken bir hata oluştu' });
    }
}

export default adminOnly(handler); 