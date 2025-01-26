import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Kullanıcı girişi gerektiren route'lar için middleware
export function authOnly(handler) {
    return async (req, res) => {
        try {
            // Token'ı header'dan al
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Yetkilendirme başarısız' });
            }

            const token = authHeader.split(' ')[1];
            
            // Token'ı doğrula
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Kullanıcı bilgilerini request'e ekle
            req.user = decoded;
            
            // Asıl handler'ı çalıştır
            return handler(req, res);
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({ error: 'Yetkilendirme başarısız' });
        }
    };
}

// Sadece admin kullanıcılar için middleware
export function adminOnly(handler) {
    return async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Yetkilendirme başarısız' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Admin kontrolü
            if (decoded.role !== 'admin') {
                return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
            }
            
            req.user = decoded;
            return handler(req, res);
        } catch (error) {
            console.error('Admin auth middleware error:', error);
            return res.status(401).json({ error: 'Yetkilendirme başarısız' });
        }
    };
}

// Sadece yazarlar için middleware
export function writerOnly(handler) {
    return async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Yetkilendirme başarısız' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Yazar kontrolü
            if (decoded.role !== 'writer' && decoded.role !== 'admin') {
                return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
            }
            
            req.user = decoded;
            return handler(req, res);
        } catch (error) {
            console.error('Writer auth middleware error:', error);
            return res.status(401).json({ error: 'Yetkilendirme başarısız' });
        }
    };
} 