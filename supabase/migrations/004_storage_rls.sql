-- =============================================
-- Storage RLS — 允许登录用户上传自己的音频
-- =============================================

-- audio-uploads: 登录用户可上传、读取自己的文件
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audio-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to read own uploads"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'audio-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- tts-output: 登录用户可读取 TTS 文件
CREATE POLICY "Allow users to read TTS output"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'tts-output'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
