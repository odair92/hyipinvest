-- Update admin_users setting to include the email
UPDATE public.system_settings
SET setting_value = jsonb_set(
  COALESCE(setting_value::jsonb, '[]'::jsonb),
  '{0}',
  '"odairjosfernandess@gmail.com"'::jsonb
)
WHERE setting_key = 'admin_users';
