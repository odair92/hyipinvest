import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bitcoin,
  ChevronRight,
  Database,
  DollarSign,
  LineChart,
  HardHat,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <HardHat className="h-10 w-10 text-blue-500" />,
      title: "Cryptocurrency Mining",
      description:
        "Purchase mining power (GH/s) and earn passive income through our advanced mining infrastructure.",
    },
    {
      icon: <LineChart className="h-10 w-10 text-green-500" />,
      title: "High-Yield Investments",
      description:
        "Access exclusive investment plans with competitive ROI and flexible terms tailored to your goals.",
    },
    {
      icon: <Bitcoin className="h-10 w-10 text-orange-500" />,
      title: "Multi-Currency Support",
      description:
        "Deposit and withdraw using BTC, ETH, USDT, and TRX with secure payment processing.",
    },
    {
      icon: <Shield className="h-10 w-10 text-purple-500" />,
      title: "Secure Platform",
      description:
        "Advanced security measures to protect your investments and personal information.",
    },
  ];

  const investmentPlans = [
    {
      name: "Starter",
      roi: "3%",
      duration: "Daily for 30 days",
      minimum: "$100",
      features: ["Daily payouts", "Principal returned", "24/7 Support"],
    },
    {
      name: "Advanced",
      roi: "5%",
      duration: "Daily for 45 days",
      minimum: "$500",
      features: [
        "Daily payouts",
        "Principal returned",
        "24/7 Support",
        "Priority withdrawals",
      ],
    },
    {
      name: "Professional",
      roi: "8%",
      duration: "Daily for 60 days",
      minimum: "$1,000",
      features: [
        "Daily payouts",
        "Principal returned",
        "24/7 Support",
        "Priority withdrawals",
        "Personal account manager",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="fixed top-0 z-50 w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-bold text-xl flex items-center">
              <DollarSign className="h-6 w-6 mr-2 text-blue-500" />
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                CryptoYield
              </span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          alt={user.email || ""}
                        />
                        <AvatarFallback>
                          {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block">
                        {user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => signOut()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-blue-300"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/2 space-y-6"
            >
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Maximize Your Crypto
                </span>{" "}
                With Our Mining & Investment Platform
              </h1>
              <p className="text-xl text-slate-300">
                Earn passive income through cryptocurrency mining and high-yield
                investment plans with our secure and user-friendly platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
                    Start Earning Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-800 text-lg px-8 py-6"
                  >
                    Login to Dashboard
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="border-2 border-slate-800">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                      />
                    </Avatar>
                  ))}
                </div>
                <p className="text-slate-300">
                  Joined by{" "}
                  <span className="text-blue-400 font-semibold">10,000+</span>{" "}
                  investors
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -top-20 -right-20 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
              <div className="absolute -bottom-20 -left-20 -z-10 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px]" />
              <img
                src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80"
                alt="Cryptocurrency mining"
                className="rounded-xl shadow-2xl border border-slate-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-blue-400">$120M+</p>
              <p className="text-slate-300">Total Investments</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-blue-400">45,000+</p>
              <p className="text-slate-300">Active Users</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-blue-400">250 PH/s</p>
              <p className="text-slate-300">Mining Power</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-blue-400">99.9%</p>
              <p className="text-slate-300">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Crypto Investors
            </h2>
            <p className="text-xl text-slate-300">
              Our platform combines mining capabilities with high-yield
              investment options to maximize your returns
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Investment Plans
            </h2>
            <p className="text-xl text-slate-300">
              Choose the investment plan that best suits your financial goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {investmentPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-slate-800 rounded-xl border ${index === 1 ? "border-blue-500" : "border-slate-700"} overflow-hidden`}
              >
                <div
                  className={`p-6 ${index === 1 ? "bg-blue-500" : "bg-slate-700"}`}
                >
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>
                <div className="p-8">
                  <div className="mb-6">
                    <p className="text-4xl font-bold">{plan.roi}</p>
                    <p className="text-slate-300">{plan.duration}</p>
                  </div>
                  <p className="mb-6">
                    Minimum:{" "}
                    <span className="font-semibold">{plan.minimum}</span>
                  </p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <ChevronRight className="h-5 w-5 text-blue-400 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={user ? "/dashboard" : "/signup"}>
                    <Button
                      className={`w-full ${index === 1 ? "bg-blue-500 hover:bg-blue-600" : "bg-slate-700 hover:bg-slate-600"}`}
                    >
                      {user ? "Invest Now" : "Get Started"}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of investors already growing their portfolio with
              our mining and investment platform.
            </p>
            <Link to="/signup">
              <Button className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8 py-6">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="font-bold text-xl flex items-center">
                <DollarSign className="h-6 w-6 mr-2 text-blue-500" />
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  CryptoYield
                </span>
              </Link>
              <p className="text-slate-400 mt-2">
                Secure cryptocurrency mining and investment platform
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <h4 className="font-semibold mb-3">Platform</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <Link to="/" className="hover:text-blue-400">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-blue-400">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="hover:text-blue-400">
                      Register
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <a href="#" className="hover:text-blue-400">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-6 text-center text-slate-400">
            <p>
              © {new Date().getFullYear()} CryptoYield. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
