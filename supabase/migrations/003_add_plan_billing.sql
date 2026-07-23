-- =============================================
-- PawNotes 计费系统
-- =============================================

-- 1. profiles 增加计费相关字段
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS plan VARCHAR(10) DEFAULT 'free'
    CHECK (plan IN ('free', 'monthly')),
ADD COLUMN IF NOT EXISTS daily_usage_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_usage_date DATE;

-- =============================================
-- 2. 每日用量重置函数
-- =============================================
CREATE OR REPLACE FUNCTION public.check_and_reset_daily_usage(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
    v_date DATE;
BEGIN
    SELECT daily_usage_count, daily_usage_date
    INTO v_count, v_date
    FROM public.profiles
    WHERE user_id = p_user_id;

    -- Reset if new day
    IF v_date IS NULL OR v_date < CURRENT_DATE THEN
        UPDATE public.profiles
        SET daily_usage_count = 0,
            daily_usage_date = CURRENT_DATE
        WHERE user_id = p_user_id;
        RETURN 0;
    END IF;

    RETURN COALESCE(v_count, 0);
END;
$$;

-- =============================================
-- 3. 增量用量（每次分析后+1）
-- =============================================
CREATE OR REPLACE FUNCTION public.increment_daily_usage(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles
    SET daily_usage_count = daily_usage_count + 1,
        daily_usage_date = CURRENT_DATE
    WHERE user_id = p_user_id;
END;
$$;

-- =============================================
-- 4. 清理旧历史记录（free 用户保留最近10条）
-- =============================================
CREATE OR REPLACE FUNCTION public.cleanup_free_user_history()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT p.user_id
        FROM public.profiles p
        WHERE p.plan = 'free'
    LOOP
        DELETE FROM public.recordings
        WHERE user_id = r.user_id
        AND id NOT IN (
            SELECT id FROM public.recordings
            WHERE user_id = r.user_id
            ORDER BY created_at DESC
            LIMIT 10
        );
    END LOOP;
END;
$$;
