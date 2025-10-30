import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import { SUPABASE_ADMIN_KEY, SUPABASE_KEY, SUPABASE_URL } from '../tokens.js';

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Supabase client (anon key for uploads)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Supabase admin client (for bucket creation)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY);

// Initialize bucket if it doesn't exist
const initBucket = async () => {
  try {
    console.log('🔍 Checking for uploads bucket...');
    const { data: buckets, error: listError } =
      await supabaseAdmin.storage.listBuckets();

    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }

    const hasUploadsBucket = buckets?.some(bucket => bucket.name === 'uploads');

    if (!hasUploadsBucket) {
      console.log('📁 Creating uploads bucket...');
      const { data, error } = await supabaseAdmin.storage.createBucket(
        'uploads',
        {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 10485760, // 10MB
        }
      );

      if (error) {
        console.error('❌ Error creating bucket:', error);
        console.log(
          '⚠️  Please create "uploads" bucket manually in Supabase dashboard'
        );
      } else {
        console.log('✅ Uploads bucket created successfully');
      }
    } else {
      console.log('✅ Uploads bucket already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing bucket:', error);
  }
};

// Initialize bucket on startup
initBucket();

// Helper function to sanitize filename
const sanitizeFilename = filename => {
  // Get file extension first
  const parts = filename.split('.');
  const extension = parts.length > 1 ? parts[parts.length - 1] : '';
  const nameWithoutExt =
    parts.length > 1 ? parts.slice(0, -1).join('.') : filename;

  // Sanitize the name part
  const sanitizedName = nameWithoutExt
    .replace(/[^\p{L}\p{N}\-_]/gu, '_') // harflar (har qanday tilda), raqamlar, -, _
    .replace(/\s+/g, '_')
    .toLowerCase()
    .substring(0, 50);

  // Return sanitized name with extension
  return extension
    ? `${sanitizedName}.${extension.toLowerCase()}`
    : sanitizedName;
};

router.post('/uploads', upload.any(), async (req, res) => {
  try {
    console.log('📤 Upload request received:', {
      files: req.files,
      body: req.body,
    });

    const file = req.files?.[0] || req.file;

    if (!file) {
      return res.status(400).json({ error: 'Fayl yuklanmadi!' });
    }

    // Sanitize filename and create unique name
    const sanitizedName = sanitizeFilename(file.originalname);
    const fileName = `${Date.now()}_${sanitizedName}`;
    const fileBuffer = file.buffer;

    console.log('📝 Original filename:', file.originalname);
    console.log('📝 Sanitized filename:', fileName);

    console.log('📤 Uploading to Supabase Storage:', fileName);

    // Supabase Storage ga yuklash (use admin key to bypass RLS)
    const { data, error } = await supabaseAdmin.storage
      .from('uploads') // Supabase'da 'uploads' bucket yaratishingiz kerak
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error('❌ Supabase Upload Error:', error);
      return res.status(500).json({
        error: 'Rasm yuklashda xatolik yuz berdi!',
        message: error.message,
      });
    }

    // Public URL olish
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(fileName);

    const fileUrl = publicUrlData.publicUrl;

    console.log('✅ File uploaded successfully to Supabase:', fileUrl);

    res.json({
      message: 'Fayl muvaffaqiyatli yuklandi!',
      url: fileUrl,
    });
  } catch (error) {
    console.error('❌ Upload Error:', error);
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({
      error: 'Rasm yuklashda xatolik yuz berdi!',
      message: error.message,
    });
  }
});

export default router;
