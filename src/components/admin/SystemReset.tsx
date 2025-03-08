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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, RotateCcw, Database, Shield } from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";

export default function SystemReset() {
  const { user } = useAuth();
  const [resetType, setResetType] = useState("partial");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [backupKey, setBackupKey] = useState("");

  // Tables that can be reset in partial reset
  const [selectedTables, setSelectedTables] = useState({
    investment_plans: false,
    mining_packages: false,
    user_investments: false,
    user_mining: false,
    transactions: false,
  });

  const handleTableSelection = (table: string) => {
    setSelectedTables({
      ...selectedTables,
      [table]: !selectedTables[table as keyof typeof selectedTables],
    });
  };

  const handleReset = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!user) {
        throw new Error("You must be logged in to perform this action");
      }

      // Get the JWT token for authorization
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session found");
      }

      // Prepare the data for the reset
      const resetData = {
        resetType,
        backupData:
          resetType === "partial"
            ? Object.entries(selectedTables)
                .filter(([_, selected]) => selected)
                .map(([table]) => table)
            : undefined,
      };

      // Call the system reset edge function
      const { data, error } = await supabase.functions.invoke("system-reset", {
        body: resetData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setSuccess(true);
      setBackupKey(data.backupKey);
    } catch (err) {
      console.error("Reset error:", err);
      setError(err.message || "An error occurred during reset");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-500 flex items-center gap-2">
            <Shield className="h-5 w-5" /> Reset Completed Successfully
          </CardTitle>
          <CardDescription>
            The system has been reset according to your specifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            A backup of the data was created before the reset with the key:
          </p>
          <p className="font-mono bg-slate-100 p-2 rounded mt-2 text-sm">
            {backupKey}
          </p>
          <p className="mt-4 text-sm">
            You can restore this backup from the system settings if needed.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()} className="w-full">
            Refresh Page
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" /> System Reset
        </CardTitle>
        <CardDescription>
          Reset your system data. This action cannot be undone, but a backup
          will be created automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={resetType} onValueChange={setResetType}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="partial">Partial Reset</TabsTrigger>
            <TabsTrigger value="full">Full Reset</TabsTrigger>
          </TabsList>

          <TabsContent value="partial">
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Select which data you want to reset. User accounts will not be
                affected.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="investment_plans"
                    checked={selectedTables.investment_plans}
                    onCheckedChange={() =>
                      handleTableSelection("investment_plans")
                    }
                  />
                  <Label htmlFor="investment_plans">Investment Plans</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mining_packages"
                    checked={selectedTables.mining_packages}
                    onCheckedChange={() =>
                      handleTableSelection("mining_packages")
                    }
                  />
                  <Label htmlFor="mining_packages">Mining Packages</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="user_investments"
                    checked={selectedTables.user_investments}
                    onCheckedChange={() =>
                      handleTableSelection("user_investments")
                    }
                  />
                  <Label htmlFor="user_investments">User Investments</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="user_mining"
                    checked={selectedTables.user_mining}
                    onCheckedChange={() => handleTableSelection("user_mining")}
                  />
                  <Label htmlFor="user_mining">User Mining</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="transactions"
                    checked={selectedTables.transactions}
                    onCheckedChange={() => handleTableSelection("transactions")}
                  />
                  <Label htmlFor="transactions">Transactions</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="full">
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">
                    Warning: Full System Reset
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    This will reset ALL data except user accounts. All
                    investments, mining packages, transactions, and settings
                    will be deleted.
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600">
                A backup of all data will be created before the reset. You can
                restore this backup from the system settings if needed.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full"
              disabled={
                resetType === "partial" &&
                !Object.values(selectedTables).some((v) => v)
              }
            >
              {resetType === "full"
                ? "Full System Reset"
                : "Reset Selected Data"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                selected data and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReset}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600"
              >
                {loading ? "Processing..." : "Yes, Reset Data"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
