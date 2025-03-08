-- Initialize system settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_group, is_public)
VALUES 
('system_initialized', 'true', 'system', false),
('site_name', 'CryptoYield', 'general', true),
('site_description', 'Cryptocurrency Mining and Investment Platform', 'general', true),
('admin_users', '["admin@cryptoyield.com"]', 'system', false);

-- Create default investment plans
INSERT INTO public.investment_plans (name, description, daily_roi, duration_days, minimum_amount, maximum_amount, is_active)
VALUES
('Starter', 'Perfect for beginners with a low minimum investment', 3, 30, 100, 1000, true),
('Advanced', 'Higher returns for experienced investors', 5, 45, 500, 5000, true),
('Professional', 'Maximum returns for serious investors', 8, 60, 1000, 10000, true);

-- Create default mining packages
INSERT INTO public.mining_packages (name, description, hash_rate, price, duration_days, is_active)
VALUES
('Basic Mining', 'Entry-level mining package', 10, 100, 30, true),
('Standard Mining', 'Mid-level mining package with better hash rate', 50, 450, 60, true),
('Premium Mining', 'High-performance mining package', 100, 800, 90, true);
