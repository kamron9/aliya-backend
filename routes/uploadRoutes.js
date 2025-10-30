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

    const fileName = `${Date.now()}_${file.originalname}`;
    const fileBuffer = file.buffer;

    console.log('📤 Uploading to Supabase Storage:', fileName);

    // Supabase Storage ga yuklash
    const { data, error } = await supabase.storage
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
    const { data: publicUrlData } = supabase.storage
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
