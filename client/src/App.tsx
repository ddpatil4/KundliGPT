import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { useSetup } from "@/hooks/useSetup";
import Home from "@/pages/home";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import AdminLogin from "@/pages/admin-login";
import AdminRegister from "@/pages/admin-register";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminPosts from "@/pages/admin-posts";
import AdminCategories from "@/pages/admin-categories";
import AdminPostEditor from "@/pages/admin-post-editor";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import SetupWizard from "@/pages/setup-wizard";
import SetupWizardDB from "@/pages/setup-wizard-db";
import NotFound from "@/pages/not-found";

function Router() {
  const { isSetupComplete, isLoading } = useSetup();

  // Show loading spinner while checking setup status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading Hindi Kundli Insight...</p>
        </div>
      </div>
    );
  }

  // If setup is not complete, only show setup wizard
  if (!isSetupComplete) {
    return (
      <Switch>
        <Route path="/setup" component={SetupWizard} />
        <Route path="/setup-db" component={SetupWizardDB} />
        <Route component={SetupWizardDB} />
      </Switch>
    );
  }

  // If setup is complete, show all routes
  return (
    <Switch>
      <Route path="/setup" component={SetupWizard} />
      <Route path="/setup-db" component={SetupWizardDB} />
      <Route path="/" component={Home} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/register" component={AdminRegister} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/posts" component={AdminPosts} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/posts/new" component={AdminPostEditor} />
      <Route path="/admin/posts/edit/:id" component={AdminPostEditor} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
