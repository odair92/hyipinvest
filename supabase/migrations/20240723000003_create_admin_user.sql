-- Create admin user
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
  ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'odairjosfernandess@gmail.com', crypt('odair10', gen_salt('bf')), now(), NULL, NULL, '{"provider":"email","providers":["email"],"is_admin":true}', '{"full_name":"System Administrator"}', now(), now(), '', NULL, '', '');

-- Create parallel entry in public.users
INSERT INTO public.users (id, email, full_name, created_at, updated_at)
SELECT id, email, 'System Administrator', created_at, updated_at
FROM auth.users
WHERE email = 'odairjosfernandess@gmail.com';

-- Add to admin_users setting
UPDATE public.system_settings
SET setting_value = jsonb_set(
  COALESCE(setting_value::jsonb, '[]'::jsonb),
  '{0}',
  '"odairjosfernandess@gmail.com"'::jsonb
)
WHERE setting_key = 'admin_users';
