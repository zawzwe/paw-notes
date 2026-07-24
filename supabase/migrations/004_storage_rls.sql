-- =============================================
-- Storage RLS — 允许登录用户上传自己的音频
-- =============================================

-- audio-uploads: 登录用户可上传、读取
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio-uploads');

CREATE POLICY "Allow authenticated read uploads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'audio-uploads');

-- tts-output: 登录用户可读
CREATE POLICY "Allow authenticated read tts"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'tts-output');
