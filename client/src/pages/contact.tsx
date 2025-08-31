import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (result) => {
      if (result.ok) {
        form.reset();
        toast({
          title: "संदेश भेजा गया",
          description: result.message,
        });
      } else {
        toast({
          title: "त्रुटि",
          description: result.error,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "त्रुटि",
        description: "संदेश भेजने में समस्या हुई। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-screen-md mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold hindi-text text-foreground">संपर्क करें</h1>
          <p className="text-lg text-muted-foreground hindi-text">हमसे जुड़ें और अपने सवाल पूछें</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-card rounded-2xl p-6 card-shadow space-y-6">
            <h2 className="text-xl font-semibold hindi-text text-foreground">संपर्क जानकारी</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="font-medium text-foreground">ईमेल</p>
                  <p className="text-muted-foreground">support@hindikundli.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="font-medium text-foreground hindi-text">सहायता समय</p>
                  <p className="text-muted-foreground hindi-text">सोमवार से शुक्रवार, 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="font-medium text-foreground hindi-text">सेवा क्षेत्र</p>
                  <p className="text-muted-foreground hindi-text">भारत और विदेश में रहने वाले भारतीय</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm hindi-text text-muted-foreground">
                हम 24-48 घंटों के भीतर आपके संदेश का उत्तर देने का प्रयास करते हैं।
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-6 card-shadow">
            <h2 className="text-xl font-semibold hindi-text text-foreground mb-6">संदेश भेजें</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="hindi-text">नाम / Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="आपका नाम / Your name"
                          data-testid="input-contact-name"
                        />
                      </FormControl>
                      <FormMessage className="hindi-text" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="hindi-text">ईमेल / Email *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="your.email@example.com"
                          data-testid="input-contact-email"
                        />
                      </FormControl>
                      <FormMessage className="hindi-text" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="hindi-text">संदेश / Message *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[120px]"
                          placeholder="अपना संदेश यहां लिखें / Write your message here"
                          data-testid="textarea-contact-message"
                        />
                      </FormControl>
                      <FormMessage className="hindi-text" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full hindi-text"
                  data-testid="button-send-message"
                >
                  {contactMutation.isPending ? "भेजा जा रहा है..." : "संदेश भेजें"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
