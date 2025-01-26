const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Kategori adı gereklidir'],
        unique: true,
    },
    slug: {
        type: String,
        required: [true, 'Kategori slug\'ı gereklidir'],
        unique: true,
    }
});

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema); 