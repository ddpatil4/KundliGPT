import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Rocket, Database, Settings, User, Globe } from "lucide-react";

const setupSchema = z.object({
  // Database Configuration
  dbHost: z.string().min(1, "Database host is required"),
  dbPort: z.string().min(1, "Database port is required"),
  dbName: z.string().min(1, "Database name is required"),
  dbUsername: z.string().min(1, "Database username is required"),
  dbPassword: z.string().min(1, "Database password is required"),
  
  // Site Configuration
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().min(10, "Site description should be at least 10 characters"),
  siteKeywords: z.string().min(1, "Keywords are required"),
  
  // OpenAI Configuration
  openaiApiKey: z.string().min(1, "OpenAI API key is required"),
  
  // Admin User
  adminUsername: z.string().min(3, "Username must be at least 3 characters"),
  adminPassword: z.string().min(6, "Password must be at least 6 characters"),
  adminPasswordConfirm: z.string(),
}).refine((data) => data.adminPassword === data.adminPasswordConfirm, {
  message: "Passwords don't match",
  path: ["adminPasswordConfirm"],
});

type SetupFormData = z.infer<typeof setupSchema>;

export default function SetupWizardDB() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showDbPassword, setShowDbPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      dbHost: "localhost",
      dbPort: "5432",
      dbName: "kundli_site",
      dbUsername: "",
      dbPassword: "",
      siteName: "Hindi Kundli Insight",
      siteDescription: "Get personalized Hindi astrological guidance and kundli insights",
      siteKeywords: "kundli, astrology, hindi, horoscope, jyotish, राशिफल",
      openaiApiKey: "",
      adminUsername: "",
      adminPassword: "",
      adminPasswordConfirm: "",
    },
  });

  const setupMutation = useMutation({
    mutationFn: async (data: SetupFormData) => {
      const response = await apiRequest("POST", "/api/setup-complete", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "🎉 Setup Complete!",
        description: "Your Hindi Kundli Insight site is ready to use!",
      });
      setTimeout(() => {
        setLocation("/admin");
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to complete setup",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SetupFormData) => {
    setupMutation.mutate(data);
  };

  const nextStep = async () => {
    let fields: (keyof SetupFormData)[] = [];
    
    if (currentStep === 1) {
      fields = ["dbHost", "dbPort", "dbName", "dbUsername", "dbPassword"];
    } else if (currentStep === 2) {
      fields = ["siteName", "siteDescription", "siteKeywords"];
    } else if (currentStep === 3) {
      fields = ["openaiApiKey"];
    }
    
    const isValid = await form.trigger(fields);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Rocket className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Hindi Kundli Insight Setup
          </CardTitle>
          <CardDescription className="text-lg">
            Complete PHP-style configuration setup in 4 easy steps
          </CardDescription>
          
          {/* Progress Steps */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? "bg-orange-500 text-white" 
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-1 ${
                      step < currentStep ? "bg-orange-500" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Step 1: Database Configuration */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold">Database Configuration</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dbHost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Database Host *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="localhost"
                              data-testid="input-db-host"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dbPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Database Port *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="5432"
                              data-testid="input-db-port"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="dbName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Database Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="kundli_site"
                            data-testid="input-db-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dbUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Database Username *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="username"
                            data-testid="input-db-username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dbPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Database Password *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showDbPassword ? "text" : "password"}
                              placeholder="password"
                              data-testid="input-db-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowDbPassword(!showDbPassword)}
                            >
                              {showDbPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Site Configuration */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold">Site Configuration</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Hindi Kundli Insight"
                            data-testid="input-site-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Get personalized Hindi astrological guidance and kundli insights"
                            className="min-h-[80px]"
                            data-testid="textarea-site-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="siteKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Keywords *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="kundli, astrology, hindi, horoscope, jyotish, राशिफल"
                            data-testid="input-site-keywords"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: API Configuration */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Settings className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold">API Configuration</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="openaiApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OpenAI API Key *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="sk-..."
                              data-testid="input-openai-key"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <p className="text-sm text-gray-600">
                          Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" className="text-orange-600 hover:underline">OpenAI Platform</a>
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 4: Admin User */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold">Admin User Setup</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="adminUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Username *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="admin"
                            data-testid="input-admin-username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adminPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Password *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Minimum 6 characters"
                            data-testid="input-admin-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adminPasswordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirm your password"
                            data-testid="input-admin-password-confirm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={currentStep === 1 ? "invisible" : ""}
                >
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={setupMutation.isPending}
                    data-testid="button-complete-setup"
                  >
                    {setupMutation.isPending ? "Setting up..." : "Complete Setup 🚀"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}