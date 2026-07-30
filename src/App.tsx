import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
// import CommunityFund from "./pages/CommunityFund";
import Donate from "./pages/Donate";
import DonateThankYou from "./pages/DonateThankYou";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
// import FoundingMembers from "./pages/FoundingMembers";
// import HowItWorks from "./pages/HowItWorks";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import BreakoutRooms from "./pages/BreakoutRooms";
import Ebook from "./pages/Ebook";
import EbookDownload from "./pages/EbookDownload";
import EbookThankYou from "./pages/EbookThankYou";
import Unsubscribe from "./pages/Unsubscribe";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import RemoteWork from "./pages/RemoteWork";
import RemoteJobDetail from "./pages/RemoteJobDetail";
import Review from "./pages/Review";
import RelocationServices from "./pages/RelocationServices";
import TalentPool from "./pages/TalentPool";
import Subscribe from "./pages/Subscribe";
import TeachAbroad from "./pages/TeachAbroad";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/community-fund" element={<CommunityFund />} /> */}
          <Route path="/donate" element={<Donate />} />
          <Route path="/donate/thank-you" element={<DonateThankYou />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/founding-members" element={<FoundingMembers />} /> */}
          {/* <Route path="/how-it-works" element={<HowItWorks />} /> */}
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/opportunities/:id" element={<OpportunityDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/breakout-rooms" element={<BreakoutRooms />} />
          <Route path="/ebooks" element={<Ebook />} />
          <Route path="/ebooks/download" element={<EbookDownload />} />
          <Route path="/ebook-thank-you" element={<EbookThankYou />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/affiliate" element={<AffiliateDashboard />} />
          <Route path="/remote-work" element={<RemoteWork />} />
          <Route path="/remote-jobs/:id" element={<RemoteJobDetail />} />
          <Route path="/review" element={<Review />} />
          <Route path="/relocation-services" element={<RelocationServices />} />
          {/* <Route path="/talent-pool" element={<TalentPool />} /> */}
          <Route path="/subscribe" element={<Subscribe />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
