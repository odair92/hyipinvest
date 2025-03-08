-- Create users table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create investment plans table
CREATE TABLE IF NOT EXISTS public.investment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  daily_roi DECIMAL NOT NULL,
  duration_days INTEGER NOT NULL,
  minimum_amount DECIMAL NOT NULL,
  maximum_amount DECIMAL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create mining packages table
CREATE TABLE IF NOT EXISTS public.mining_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  hash_rate DECIMAL NOT NULL, -- GH/s
  price DECIMAL NOT NULL,
  duration_days INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user investments table
CREATE TABLE IF NOT EXISTS public.user_investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  plan_id UUID REFERENCES public.investment_plans(id) NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT NOT NULL, -- pending, active, completed, cancelled
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  last_payout_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user mining table
CREATE TABLE IF NOT EXISTS public.user_mining (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  package_id UUID REFERENCES public.mining_packages(id) NOT NULL,
  hash_rate DECIMAL NOT NULL, -- GH/s
  status TEXT NOT NULL, -- pending, active, expired
  cryptocurrency TEXT NOT NULL, -- BTC, ETH, etc.
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  type TEXT NOT NULL, -- deposit, withdrawal, investment, mining_purchase, mining_earning, investment_earning
  amount DECIMAL NOT NULL,
  currency TEXT NOT NULL, -- USD, BTC, ETH, etc.
  status TEXT NOT NULL, -- pending, completed, failed, cancelled
  reference_id UUID, -- Can reference investment_id or mining_id
  transaction_hash TEXT, -- For blockchain transactions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create system settings table for admin configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_group TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mining_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mining ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Everyone can read investment plans
DROP POLICY IF EXISTS "Anyone can view investment plans" ON public.investment_plans;
CREATE POLICY "Anyone can view investment plans" ON public.investment_plans
  FOR SELECT USING (is_active = true);

-- Everyone can read mining packages
DROP POLICY IF EXISTS "Anyone can view mining packages" ON public.mining_packages;
CREATE POLICY "Anyone can view mining packages" ON public.mining_packages
  FOR SELECT USING (is_active = true);

-- Users can read their own investments
DROP POLICY IF EXISTS "Users can view own investments" ON public.user_investments;
CREATE POLICY "Users can view own investments" ON public.user_investments
  FOR SELECT USING (auth.uid() = user_id);

-- Users can read their own mining packages
DROP POLICY IF EXISTS "Users can view own mining" ON public.user_mining;
CREATE POLICY "Users can view own mining" ON public.user_mining
  FOR SELECT USING (auth.uid() = user_id);

-- Users can read their own transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Public settings are readable by anyone
DROP POLICY IF EXISTS "Anyone can view public settings" ON public.system_settings;
CREATE POLICY "Anyone can view public settings" ON public.system_settings
  FOR SELECT USING (is_public = true);

-- Enable realtime subscriptions
alter publication supabase_realtime add table public.users;
alter publication supabase_realtime add table public.investment_plans;
alter publication supabase_realtime add table public.mining_packages;
alter publication supabase_realtime add table public.user_investments;
alter publication supabase_realtime add table public.user_mining;
alter publication supabase_realtime add table public.transactions;
alter publication supabase_realtime add table public.system_settings;
