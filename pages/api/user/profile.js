import dbConnect from '../../../utils/dbConnect';
import { authOnly } from '../../../middleware/auth';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const { username, email, currentPassword, newPassword } = req.body;

        // Check if username is taken
        const existingUser = await User.findOne({
            username,
            _id: { $ne: req.user.id }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Bu kullanıcı adı zaten kullanılıyor' });
        }

        // Check if email is taken
        const existingEmail = await User.findOne({
            email,
            _id: { $ne: req.user.id }
        });

        if (existingEmail) {
            return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanılıyor' });
        }

        // Get current user
        const user = await User.findById(req.user.id);

        // Update basic info
        user.username = username;
        user.email = email;

        // Update password if provided
        if (newPassword) {
            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Mevcut şifre yanlış' });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        // Return user without password
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Profil güncellenirken bir hata oluştu' });
    }
}

export default authOnly(handler); 