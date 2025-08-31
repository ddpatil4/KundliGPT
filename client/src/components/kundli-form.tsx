import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { kundliFormSchema, type KundliFormData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import CitySearch from "./city-search";
import { type City } from "@/lib/cities";

interface KundliFormProps {
  onResult: (result: any, formData: KundliFormData) => void;
}

export default function KundliForm({ onResult }: KundliFormProps) {
  const { toast } = useToast();
  const [savedData, setSavedData] = useState<Partial<KundliFormData> | null>(null);

  const form = useForm<KundliFormData>({
    resolver: zodResolver(kundliFormSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      timezone: 5.5,
      birthPlace: "",
      latitude: undefined,
      longitude: undefined,
    },
  });

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kundliFormData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSavedData(data);
        Object.keys(data).forEach((key) => {
          if (data[key]) {
            form.setValue(key as keyof KundliFormData, data[key]);
          }
        });
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, [form]);

  // Save to localStorage on form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem('kundliFormData', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const interpretMutation = useMutation({
    mutationFn: async (data: KundliFormData) => {
      const response = await apiRequest("POST", "/api/interpret", data);
      return response.json();
    },
    onSuccess: (result, variables) => {
      if (result.ok) {
        onResult(result, variables);
      } else {
        toast({
          title: "त्रुटि",
          description: result.error || "कुछ समस्या हुई है।",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "त्रुटि",
        description: "सर्वर से जुड़ने में समस्या हुई। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: KundliFormData) => {
    interpretMutation.mutate(data);
  };

  const handleReset = () => {
    form.reset();
    localStorage.removeItem('kundliFormData');
    toast({
      title: "रीसेट हो गया",
      description: "फॉर्म साफ कर दिया गया है।",
    });
  };

  const handleCitySelect = (city: City) => {
    form.setValue("latitude", city.latitude);
    form.setValue("longitude", city.longitude);
  };

  return (
    <section id="kundli-form">
      <div className="enhanced-card rounded-2xl p-6 md:p-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold hindi-text text-foreground">अपनी जानकारी दर्ज करें</h2>
            <p className="text-muted-foreground hindi-text">सटीक मार्गदर्शन के लिए सभी आवश्यक जानकारी भरें</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium hindi-text text-foreground">
                      नाम / Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full px-4 py-3 border border-input rounded-lg form-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                        placeholder="अपना पूरा नाम लिखें / Enter your full name"
                        data-testid="input-name"
                      />
                    </FormControl>
                    <FormMessage className="hindi-text" />
                  </FormItem>
                )}
              />

              {/* Birth Date and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium hindi-text text-foreground">
                        जन्म तिथि / Birth Date *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="w-full px-4 py-3 border border-input rounded-lg form-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                          data-testid="input-birthdate"
                        />
                      </FormControl>
                      <FormMessage className="hindi-text" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="birthTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium hindi-text text-foreground">
                        जन्म समय / Birth Time *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          className="w-full px-4 py-3 border border-input rounded-lg form-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                          data-testid="input-birthtime"
                        />
                      </FormControl>
                      <FormMessage className="hindi-text" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Timezone Field */}
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium hindi-text text-foreground">
                      समय क्षेत्र / Timezone (UTC Offset)
                    </FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseFloat(value))} defaultValue="5.5">
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-3 border border-input rounded-lg form-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background" data-testid="select-timezone">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5.5">IST (UTC +5:30) - भारतीय मानक समय</SelectItem>
                        <SelectItem value="0">GMT (UTC +0:00) - ग्रीनविच मानक समय</SelectItem>
                        <SelectItem value="-5">EST (UTC -5:00) - पूर्वी मानक समय</SelectItem>
                        <SelectItem value="-8">PST (UTC -8:00) - प्रशांत मानक समय</SelectItem>
                        <SelectItem value="3">AST (UTC +3:00) - अरब मानक समय</SelectItem>
                        <SelectItem value="8">CST (UTC +8:00) - चीन मानक समय</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="hindi-text" />
                  </FormItem>
                )}
              />

              {/* Birth Place with Search */}
              <FormField
                control={form.control}
                name="birthPlace"
                render={({ field }) => (
                  <FormItem>
                    <CitySearch
                      value={field.value || ""}
                      onChange={field.onChange}
                      onCitySelect={handleCitySelect}
                    />
                    <FormMessage className="hindi-text" />
                  </FormItem>
                )}
              />

              {/* Latitude and Longitude (Optional, Auto-filled) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        अक्षांश / Latitude (वैकल्पिक)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.0001"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          className="w-full px-4 py-3 border border-input rounded-lg form-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                          placeholder="शहर चुनने पर भर जाएगा / Auto-filled when city selected"
                          data-testid="input-latitude"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground hindi-text mt-1">
                        वैकल्पिक: अधिक सटीकता के लिए
                      </p>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        देशांतर / Longitude (वैकल्पिक)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.0001"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          className="w-full px-4 py-3 border border-input rounded-lg form-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                          placeholder="शहर चुनने पर भर जाएगा / Auto-filled when city selected"
                          data-testid="input-longitude"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground hindi-text mt-1">
                        वैकल्पिक: अधिक सटीकता के लिए
                      </p>
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  type="submit"
                  disabled={interpretMutation.isPending}
                  className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-generate"
                >
                  <span className="hindi-text">
                    {interpretMutation.isPending ? "प्रसंस्करण..." : "कुंडली बनाएं"}
                  </span>
                </Button>
                
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium transition-all duration-200"
                  data-testid="button-reset"
                >
                  <span className="hindi-text">रीसेट करें</span>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
