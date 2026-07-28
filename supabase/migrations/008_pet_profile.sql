-- Rich pet profiles
ALTER TABLE public.pets
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS breed VARCHAR(50),
ADD COLUMN IF NOT EXISTS personality_tags TEXT[],
ADD COLUMN IF NOT EXISTS gotcha_date DATE;

-- Pet photos storage bucket (create via Dashboard: bucket name "pets", public)
-- Allow authenticated uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('pets', 'pets', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow authenticated upload pets photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pets');

CREATE POLICY "Allow public read pets photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'pets');
