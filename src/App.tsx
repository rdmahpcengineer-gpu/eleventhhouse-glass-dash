import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Landing Page Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PartnerLogos from './components/PartnerLogos';
import FloatingAgents from './components/FloatingAgents';
import Benefits from './components/Benefits';
import ShowcaseSection from './components/ShowcaseSection';
import BuildWithEHCX from './components/BuildWithEHCX';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Investor Portal
import InvestorPortal from './pages/InvestorPortal';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';

// Dashboard
import DashboardLayout from './components/dashboard/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Activity from './pages/dashboard/Activity';
import Analytics from './pages/dashboard/Analytics';
import Flows from './pages/dashboard/Flows';
import PhoneNumbers from './pages/dashboard/PhoneNumbers';
import Agents from './pages/dashboard/Agents';
import Integrations from './pages/dashboard/Integrations';
import Settings from './pages/dashboard/Settings';
import Billing from './pages/dashboard/Billing';
import Onboarding from './pages/dashboard/Onboarding';
import Chatroom from './pages/dashboard/Chatroom';
import Architecture from './pages/dashboard/Architecture';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Landing Page
function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white selection:bg-black selection:text-white">
      {/* Background large decorative text */}
      <div className="fixed top-0 right-0 h-full flex items-center pointer-events-none select-none overflow-hidden">
        <span className="text-[20vh] font-extrabold rotate-90 translate-x-1/3 opacity-[0.03] whitespace-nowrap leading-none uppercase tracking-tighter">
          Customer Excellence Experience Cloud AI Voice
        </span>
      </div>

      <Navbar />

      <main className="container mx-auto px-6 lg:px-12 pt-32 relative z-10">
        <Hero />

        <div className="mt-20 md:mt-32 border-t border-gray-100 pt-12">
          <PartnerLogos />
        </div>

        <section id="features">
          <Benefits />
        </section>

        <ShowcaseSection />

        <section id="how-it-works">
          <HowItWorks />
        </section>

        <Testimonials />

        <Pricing />

        <section id="faq">
          <FAQ />
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-40">
          <div className="bg-black rounded-[3rem] md:rounded-[4.5rem] p-12 md:p-24 lg:p-32 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
              <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500 blur-[150px] rounded-full"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 blur-[150px] rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
                Ready to Claim Your <br />
                <span className="text-gray-500">Enterprise Edge?</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/50 font-medium max-w-2xl leading-relaxed">
                Join thousands of SMBs using the world's most sophisticated contact center tech.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
                <a
                  href="/signup"
                  className="px-12 py-6 bg-white text-black rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-orange-500 hover:text-white transition-all shadow-2xl active:scale-95"
                >
                  Start 14-Day Free Trial
                </a>
                <a
                  href="#features"
                  className="px-12 py-6 bg-white/5 text-white rounded-2xl font-black text-sm tracking-widest uppercase border border-white/10 hover:bg-white/10 transition-all"
                >
                  View a Live Demo
                </a>
              </div>
            </div>
          </div>
        </section>

        <BuildWithEHCX />
      </main>

      <Footer />

      <FloatingAgents />

      {/* Scroll indicator */}
      <div className="fixed bottom-10 left-10 hidden lg:flex flex-col items-center gap-4 z-20">
        <div className="w-10 h-10 border border-black/10 rounded-full flex items-center justify-center group cursor-pointer hover:bg-black transition-colors shadow-sm">
          <svg className="w-4 h-4 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="activity" element={<Activity />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="flows" element={<Flows />} />
            <Route path="numbers" element={<PhoneNumbers />} />
            <Route path="agents" element={<Agents />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="settings" element={<Settings />} />
            <Route path="billing" element={<Billing />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="chatroom" element={<Chatroom />} />
            <Route path="architecture" element={<Architecture />} />
          </Route>

          {/* Investor Portal — public route with its own Supabase auth */}
          <Route path="/investor" element={<InvestorPortal />} />

          {/* Checkout flow */}
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
