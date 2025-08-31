import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Plus, Edit, Trash2, Tag, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function AdminCategories() {
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, isAdmin, isLoading, setLocation]);

  // Auto-generate slug from name
  const watchedName = form.watch("name");
  useEffect(() => {
    if (watchedName && !editingCategory) {
      form.setValue("slug", generateSlug(watchedName));
    }
  }, [watchedName, form, editingCategory]);

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const response = await apiRequest("POST", "/api/categories", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Category created successfully!",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      const response = await apiRequest("DELETE", `/api/categories/${categoryId}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Category deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const categories = categoriesData?.categories || [];

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch {
      return "Recent";
    }
  };

  const handleCreateCategory = (data: CategoryFormData) => {
    createCategoryMutation.mutate(data);
  };

  const handleDeleteCategory = (categoryId: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" category?`)) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                  onClick={openCreateDialog}
                >
                  <Plus className="h-4 w-4" />
                  Add New Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Create a new category for organizing your blog posts.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateCategory)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Kundali Tips"
                              data-testid="input-category-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., kundali-tips"
                              data-testid="input-category-slug"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Brief description of this category"
                              className="min-h-[80px]"
                              data-testid="textarea-category-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-orange-500 hover:bg-orange-600"
                        disabled={createCategoryMutation.isPending}
                        data-testid="button-save-category"
                      >
                        {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {categoriesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏷️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No categories yet</h2>
              <p className="text-gray-600 mb-8">Create your first category to organize your blog posts.</p>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                onClick={openCreateDialog}
              >
                <Plus className="h-4 w-4" />
                Create First Category
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Categories</p>
                      <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Tag className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categories Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category: Category) => (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                            {category.name}
                          </CardTitle>
                          
                          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                            <Calendar className="h-4 w-4" />
                            {formatDate(category.createdAt)}
                          </div>
                          
                          <CardDescription className="text-gray-600 text-sm">
                            <span className="font-medium">Slug:</span> {category.slug}
                          </CardDescription>
                          
                          {category.description && (
                            <CardDescription className="text-gray-600 mt-2">
                              {category.description}
                            </CardDescription>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="p-2"
                            onClick={() => {/* TODO: Add edit functionality */}}
                            data-testid={`button-edit-category-${category.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="p-2"
                            onClick={() => handleDeleteCategory(category.id, category.name)}
                            disabled={deleteCategoryMutation.isPending}
                            data-testid={`button-delete-category-${category.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}