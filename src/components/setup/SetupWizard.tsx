import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Database,
  Mail,
  CreditCard,
  User,
  Server,
} from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { useNavigate } from "react-router-dom";

export default function SetupWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [siteData, setSiteData] = useState({
    siteName: "CryptoYield",
    siteDescription: "Cryptocurrency Mining and Investment Platform",
  });

  const [emailData, setEmailData] = useState({
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "",
  });

  const [paymentData, setPaymentData] = useState({
    btcEnabled: true,
    ethEnabled: true,
    usdtEnabled: true,
    trxEnabled: true,
    btcAddress: "",
    ethAddress: "",
    usdtAddress: "",
    trxAddress: "",
  });

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSiteData({ ...siteData, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setPaymentData({ ...paymentData, [e.target.name]: value });
  };

  const validateAdminData = () => {
    if (!adminData.email) return "Email is required";
    if (!adminData.password) return "Password is required";
    if (adminData.password !== adminData.confirmPassword)
      return "Passwords do not match";
    if (adminData.password.length < 6)
      return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      // Validate admin data
      const adminError = validateAdminData();
      if (adminError) {
        setError(adminError);
        setLoading(false);
        return;
      }

      // Prepare data for system setup
      const setupData = {
        adminEmail: adminData.email,
        adminPassword: adminData.password,
        siteName: siteData.siteName,
        siteDescription: siteData.siteDescription,
        emailSettings: {
          smtp_host: emailData.smtpHost,
          smtp_port: emailData.smtpPort,
          smtp_user: emailData.smtpUser,
          smtp_password: emailData.smtpPassword,
          from_email: emailData.fromEmail,
          from_name: emailData.fromName,
        },
        paymentGateways: {
          btc: {
            enabled: paymentData.btcEnabled,
            address: paymentData.btcAddress,
          },
          eth: {
            enabled: paymentData.ethEnabled,
            address: paymentData.ethAddress,
          },
          usdt: {
            enabled: paymentData.usdtEnabled,
            address: paymentData.usdtAddress,
          },
          trx: {
            enabled: paymentData.trxEnabled,
            address: paymentData.trxAddress,
          },
        },
      };

      // Call the system setup edge function
      const { data, error } = await supabase.functions.invoke("system_setup", {
        body: setupData,
      });

      if (error) throw error;

      setSetupComplete(true);
    } catch (err) {
      console.error("Setup error:", err);
      setError(err.message || "An error occurred during setup");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  if (setupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <Card className="w-full max-w-md bg-slate-800 text-white border-slate-700">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Setup Complete!</CardTitle>
            <CardDescription className="text-slate-300">
              Your system has been successfully configured and is ready to use.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={goToLogin}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-4xl bg-slate-800 text-white border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl">System Setup Wizard</CardTitle>
          <CardDescription className="text-slate-300">
            Configure your HYIP investment platform with mining capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep} onValueChange={setCurrentStep}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Admin
              </TabsTrigger>
              <TabsTrigger value="site" className="flex items-center gap-2">
                <Server className="h-4 w-4" /> Site
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={adminData.email}
                    onChange={handleAdminChange}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Admin Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={adminData.password}
                    onChange={handleAdminChange}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={adminData.confirmPassword}
                    onChange={handleAdminChange}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="site">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    placeholder="CryptoYield"
                    value={siteData.siteName}
                    onChange={handleSiteChange}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    name="siteDescription"
                    placeholder="Cryptocurrency Mining and Investment Platform"
                    value={siteData.siteDescription}
                    onChange={handleSiteChange}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    name="smtpHost"
                    placeholder="smtp.example.com"
                    value={emailData.smtpHost}
                    onChange={handleEmailChange}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    name="smtpPort"
                    placeholder="587"
                    value={emailData.smtpPort}
                    onChange={handleEmailChange}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      name="smtpUser"
                      placeholder="user@example.com"
                      value={emailData.smtpUser}
                      onChange={handleEmailChange}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      name="smtpPassword"
                      type="password"
                      placeholder="••••••••"
                      value={emailData.smtpPassword}
                      onChange={handleEmailChange}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      name="fromEmail"
                      placeholder="noreply@example.com"
                      value={emailData.fromEmail}
                      onChange={handleEmailChange}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      name="fromName"
                      placeholder="CryptoYield"
                      value={emailData.fromName}
                      onChange={handleEmailChange}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Bitcoin (BTC)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="btcAddress">BTC Wallet Address</Label>
                    <Input
                      id="btcAddress"
                      name="btcAddress"
                      placeholder="Your BTC wallet address"
                      value={paymentData.btcAddress}
                      onChange={handlePaymentChange}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Ethereum (ETH)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="ethAddress">ETH Wallet Address</Label>
                    <Input
                      id="ethAddress"
                      name="ethAddress"
                      placeholder="Your ETH wallet address"
                      value={paymentData.ethAddress}
                      onChange={handlePaymentChange}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tether (USDT)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="usdtAddress">USDT Wallet Address</Label>
                    <Input
                      id="usdtAddress"
                      name="usdtAddress"
                      placeholder="Your USDT wallet address"
                      value={paymentData.usdtAddress}
                      onChange={handlePaymentChange}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tron (TRX)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="trxAddress">TRX Wallet Address</Label>
                    <Input
                      id="trxAddress"
                      name="trxAddress"
                      placeholder="Your TRX wallet address"
                      value={paymentData.trxAddress}
                      onChange={handlePaymentChange}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              const steps = ["admin", "site", "email", "payment"];
              const currentIndex = steps.indexOf(currentStep);
              if (currentIndex > 0) {
                setCurrentStep(steps[currentIndex - 1]);
              }
            }}
            disabled={currentStep === "admin" || loading}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            Previous
          </Button>

          {currentStep === "payment" ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Setting up..." : "Complete Setup"}
            </Button>
          ) : (
            <Button
              onClick={() => {
                const steps = ["admin", "site", "email", "payment"];
                const currentIndex = steps.indexOf(currentStep);
                if (currentIndex < steps.length - 1) {
                  setCurrentStep(steps[currentIndex + 1]);
                }
              }}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
