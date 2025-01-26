require('dotenv').config();
const mongoose = require('mongoose');

const samplePosts = [
    {
        title: "Blog Sitemi Oluşturdum!",
        content: `<h2>Yeni Blog Sitemin Hikayesi</h2>
        <p>Merhaba! Uzun zamandır planladığım kişisel blog sitemi sonunda hayata geçirdim. Bu platformda hem günlük deneyimlerimi hem de teknik bilgi içerikli yazılarımı sizlerle paylaşacağım.</p>
        
        <h3>Blog Sitemin Özellikleri</h3>
        <ul>
            <li>Modern ve kullanıcı dostu arayüz</li>
            <li>Kategori sistemi ile kolay içerik organizasyonu</li>
            <li>Yazar başvuru sistemi</li>
            <li>Yorum ve beğeni sistemi</li>
        </ul>

        <h3>Neler Paylaşacağım?</h3>
        <p>Bu blogda iki farklı türde içerik bulacaksınız:</p>
        <ol>
            <li>Günlük blog yazıları: Deneyimlerim, düşüncelerim ve yaşadığım ilginç olaylar</li>
            <li>Teknik içerikler: Yazılım, teknoloji ve dijital dünya hakkında bilgilendirici yazılar</li>
        </ol>

        <p>Umarım paylaşımlarım sizler için faydalı ve ilham verici olur. Yorumlarınızı ve geri bildirimlerinizi bekliyorum!</p>`,
        excerpt: "Kişisel blog sitemi nasıl oluşturduğumu ve neler paylaşacağımı anlattığım ilk yazım.",
        coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        isPublic: true
    },
    {
        title: "Yazılım Dünyasında İlk Adımlarım",
        content: `<h2>Yazılım Yolculuğum</h2>
        <p>Yazılım dünyasına olan ilgim küçük yaşlarda başladı. Bu yazıda, nasıl başladığımı ve neler öğrendiğimi sizlerle paylaşacağım.</p>
        
        <h3>Öğrendiğim Teknolojiler</h3>
        <ul>
            <li>HTML, CSS ve JavaScript temel web teknolojileri</li>
            <li>React ve Next.js ile modern web geliştirme</li>
            <li>Node.js ile backend geliştirme</li>
            <li>MongoDB ile veritabanı yönetimi</li>
        </ul>

        <h3>Gelecek Hedeflerim</h3>
        <p>Yazılım alanında kendimi sürekli geliştirmeyi hedefliyorum. Özellikle:</p>
        <ul>
            <li>Yapay zeka ve makine öğrenmesi</li>
            <li>Mobil uygulama geliştirme</li>
            <li>Siber güvenlik</li>
        </ul>

        <p>Bu blog üzerinden öğrenme sürecimi ve deneyimlerimi düzenli olarak paylaşacağım.</p>`,
        excerpt: "Yazılım dünyasına nasıl adım attığımı ve gelecek hedeflerimi anlattığım teknik bir yazı.",
        coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
        isPublic: true
    }
];

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'writer'], default: 'user' }
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    isPublic: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

async function seedPosts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı');

        // Model tanımlamaları
        const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
        const User = mongoose.models.User || mongoose.model('User', userSchema);
        const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

        // Admin kullanıcısını bul
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            throw new Error('Admin kullanıcısı bulunamadı');
        }

        // Kategorileri bul
        const personalCategory = await Category.findOne({ slug: 'personal' });
        const softwareCategory = await Category.findOne({ slug: 'software' });

        if (!personalCategory || !softwareCategory) {
            throw new Error('Kategoriler bulunamadı');
        }

        // Mevcut yazıları temizle
        await Post.deleteMany({});
        console.log('Mevcut yazılar silindi');

        // Yeni yazıları ekle
        const posts = await Post.create([
            {
                ...samplePosts[0],
                category: personalCategory._id,
                author: admin._id
            },
            {
                ...samplePosts[1],
                category: softwareCategory._id,
                author: admin._id
            }
        ]);

        console.log('Yazılar başarıyla eklendi:', posts);

    } catch (error) {
        console.error('Hata:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB bağlantısı kapatıldı');
    }
}

seedPosts(); 