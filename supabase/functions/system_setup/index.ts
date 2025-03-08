import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with admin privileges
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body
    const {
      adminEmail,
      adminPassword,
      siteName,
      siteDescription,
      emailSettings,
      paymentGateways,
    } = await req.json();

    // Validate required fields
    if (!adminEmail || !adminPassword) {
      throw new Error("Admin email and password are required");
    }

    // Check if system is already set up
    const { data: setupData } = await supabase
      .from("system_settings")
      .select("setting_value")
      .eq("setting_key", "system_initialized")
      .single();

    if (setupData && setupData.setting_value === "true") {
      throw new Error("System is already initialized");
    }

    // Create admin user
    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { is_admin: true, full_name: "System Administrator" },
      });

    if (userError) {
      throw new Error(`Failed to create admin user: ${userError.message}`);
    }

    // Store admin user in system settings
    await supabase.from("system_settings").insert({
      setting_key: "admin_users",
      setting_value: JSON.stringify([adminEmail]),
      setting_group: "system",
      is_public: false,
    });

    // Store site settings
    const siteSettings = [
      {
        setting_key: "site_name",
        setting_value: siteName || "CryptoYield",
        setting_group: "general",
        is_public: true,
      },
      {
        setting_key: "site_description",
        setting_value:
          siteDescription || "Cryptocurrency Mining and Investment Platform",
        setting_group: "general",
        is_public: true,
      },
      {
        setting_key: "system_initialized",
        setting_value: "true",
        setting_group: "system",
        is_public: false,
      },
    ];

    await supabase.from("system_settings").insert(siteSettings);

    // Store email settings if provided
    if (emailSettings) {
      await supabase.from("system_settings").insert({
        setting_key: "email_settings",
        setting_value: JSON.stringify(emailSettings),
        setting_group: "email",
        is_public: false,
      });
    }

    // Store payment gateway settings if provided
    if (paymentGateways) {
      await supabase.from("system_settings").insert({
        setting_key: "payment_gateways",
        setting_value: JSON.stringify(paymentGateways),
        setting_group: "payment",
        is_public: false,
      });
    }

    // Create default investment plans
    const defaultPlans = [
      {
        name: "Starter",
        description: "Perfect for beginners with a low minimum investment",
        daily_roi: 3,
        duration_days: 30,
        minimum_amount: 100,
        maximum_amount: 1000,
        is_active: true,
      },
      {
        name: "Advanced",
        description: "Higher returns for experienced investors",
        daily_roi: 5,
        duration_days: 45,
        minimum_amount: 500,
        maximum_amount: 5000,
        is_active: true,
      },
      {
        name: "Professional",
        description: "Maximum returns for serious investors",
        daily_roi: 8,
        duration_days: 60,
        minimum_amount: 1000,
        maximum_amount: 10000,
        is_active: true,
      },
    ];

    await supabase.from("investment_plans").insert(defaultPlans);

    // Create default mining packages
    const defaultMiningPackages = [
      {
        name: "Basic Mining",
        description: "Entry-level mining package",
        hash_rate: 10, // 10 GH/s
        price: 100,
        duration_days: 30,
        is_active: true,
      },
      {
        name: "Standard Mining",
        description: "Mid-level mining package with better hash rate",
        hash_rate: 50, // 50 GH/s
        price: 450,
        duration_days: 60,
        is_active: true,
      },
      {
        name: "Premium Mining",
        description: "High-performance mining package",
        hash_rate: 100, // 100 GH/s
        price: 800,
        duration_days: 90,
        is_active: true,
      },
    ];

    await supabase.from("mining_packages").insert(defaultMiningPackages);

    return new Response(
      JSON.stringify({
        success: true,
        message: "System setup completed successfully",
        adminUser: userData.user,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
