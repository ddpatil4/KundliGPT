import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
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
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
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
