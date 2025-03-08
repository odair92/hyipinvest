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
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    // Create Supabase client with admin privileges
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user is an admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin by querying system_settings
    const { data: adminData, error: adminError } = await supabase
      .from("system_settings")
      .select("setting_value")
      .eq("setting_key", "admin_users")
      .single();

    if (adminError || !adminData) {
      throw new Error("Failed to verify admin status");
    }

    // Parse admin users list
    const adminUsers = JSON.parse(adminData.setting_value || "[]");
    if (!adminUsers.includes(user.email)) {
      throw new Error("Unauthorized: Not an admin user");
    }

    // Get request body
    const { resetType, backupData } = await req.json();

    // Validate reset type
    if (!["full", "partial"].includes(resetType)) {
      throw new Error("Invalid reset type");
    }

    // Create backup of current data
    const timestamp = new Date().toISOString();
    const backupKey = `system_backup_${timestamp}`;

    let backupContent = {};
    if (resetType === "full" || (resetType === "partial" && backupData)) {
      // Get data to backup
      const tables =
        resetType === "full"
          ? [
              "users",
              "investment_plans",
              "mining_packages",
              "user_investments",
              "user_mining",
              "transactions",
            ]
          : backupData;

      backupContent = {};

      for (const table of tables) {
        const { data, error } = await supabase.from(table).select("*");
        if (error) {
          throw new Error(`Failed to backup table ${table}: ${error.message}`);
        }
        backupContent[table] = data;
      }
    }

    // Store backup in system_settings
    await supabase.from("system_settings").insert({
      setting_key: backupKey,
      setting_value: JSON.stringify(backupContent),
      setting_group: "backups",
      is_public: false,
    });

    // Perform reset operations
    if (resetType === "full") {
      // Delete all data except admin settings and backups
      await supabase.from("transactions").delete().neq("id", "placeholder");
      await supabase.from("user_mining").delete().neq("id", "placeholder");
      await supabase.from("user_investments").delete().neq("id", "placeholder");
      await supabase.from("mining_packages").delete().neq("id", "placeholder");
      await supabase.from("investment_plans").delete().neq("id", "placeholder");
      // Don't delete users as they're linked to auth.users
    } else if (resetType === "partial" && backupData) {
      // Delete only specified tables
      for (const table of backupData) {
        if (table !== "users") {
          // Don't delete users table in partial reset
          await supabase.from(table).delete().neq("id", "placeholder");
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `System ${resetType} reset completed successfully`,
        backupKey,
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
