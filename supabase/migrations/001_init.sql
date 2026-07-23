-- =============================================
-- PawNotes 数据库初始化
-- =============================================

-- 1. profiles — 扩展 Supabase Auth 用户信息
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname    VARCHAR(100),
    preferred_locale VARCHAR(10) DEFAULT 'zh' CHECK (preferred_locale IN ('zh', 'en')),
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 自动创建 profile（新用户注册时）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, preferred_locale)
    VALUES (NEW.id, 'zh');
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. recordings — 录音/上传记录
-- =============================================
CREATE TABLE IF NOT EXISTS public.recordings (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source        VARCHAR(20) NOT NULL CHECK (source IN ('realtime', 'upload')),
    species       VARCHAR(10) NOT NULL CHECK (species IN ('cat', 'dog')),
    duration_sec  NUMERIC(6,2),
    file_path     TEXT,
    status        VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recordings_user_id ON recordings(user_id);
CREATE INDEX IF NOT EXISTS idx_recordings_status ON recordings(status);
CREATE INDEX IF NOT EXISTS idx_recordings_created_at ON recordings(created_at DESC);

-- =============================================
-- 3. analyses — 分析结果
-- =============================================
CREATE TABLE IF NOT EXISTS public.analyses (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recording_id      UUID NOT NULL UNIQUE REFERENCES public.recordings(id) ON DELETE CASCADE,
    emotion_label     VARCHAR(50),
    emotion_confidence NUMERIC(4,3) CHECK (emotion_confidence BETWEEN 0 AND 1),
    translated_text   TEXT,
    translated_text_zh TEXT,
    tts_audio_path    TEXT,
    tts_language      VARCHAR(5) DEFAULT 'zh' CHECK (tts_language IN ('zh', 'en')),
    raw_response      JSONB,
    created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analyses_recording_id ON analyses(recording_id);

-- =============================================
-- 4. RLS 策略 — 用户只能读写自己的数据
-- =============================================

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- recordings
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own recordings"
    ON public.recordings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own recordings"
    ON public.recordings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recordings"
    ON public.recordings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recordings"
    ON public.recordings FOR DELETE
    USING (auth.uid() = user_id);

-- analyses
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own analyses"
    ON public.analyses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.recordings
            WHERE recordings.id = analyses.recording_id
            AND recordings.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own analyses"
    ON public.analyses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.recordings
            WHERE recordings.id = analyses.recording_id
            AND recordings.user_id = auth.uid()
        )
    );

-- =============================================
-- 5. Storage 配置
-- =============================================

-- 创建两个 bucket（需要在 Supabase Dashboard > Storage 手动创建，或使用 SQL）
-- bucket: audio-uploads  (用户上传的原始音频)
-- bucket: tts-output      (TTS 合成的语音文件)

-- Storage RLS (在 Dashboard 中配置或通过 API)
-- audio-uploads: 用户可上传，可读取自己的文件
-- tts-output:    用户可读取分析结果对应的 TTS 文件
