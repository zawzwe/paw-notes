-- 添加管理员字段
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 设置管理员（请替换为实际的 user_id）
-- 先通过邮箱找到 user_id，再执行下面的 UPDATE

UPDATE public.profiles
SET is_admin = true
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN (
    '1040192059@qq.com',
    '1099417497@qq.com'
  )
);
