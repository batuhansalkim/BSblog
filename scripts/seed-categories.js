require('dotenv').config();
const mongoose = require('mongoose');

const categories = [
    { name: 'Software', slug: 'software' },
    { name: 'History', slug: 'history' },
    { name: 'Personal', slug: 'personal' },
    { name: 'HipHop', slug: 'hiphop' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Art', slug: 'art' },
    { name: 'Science', slug: 'science' },
    { name: 'Literature', slug: 'literature' }
];

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true }
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

async function seedCategories() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı');

        // Mevcut kategorileri sil
        await Category.deleteMany({});
        console.log('Mevcut kategoriler silindi');

        // Yeni kategorileri ekle
        const result = await Category.insertMany(categories);
        console.log('Kategoriler başarıyla eklendi:', result);

    } catch (error) {
        console.error('Hata:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedCategories(); 