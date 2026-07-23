-- Allow users to insert their own profile (if trigger didn't create it)
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);
