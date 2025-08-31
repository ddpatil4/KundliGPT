import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Plus, Edit, Trash2, Eye, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: string;
  categoryId?: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export default function AdminPosts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, isAdmin, isLoading, setLocation]);

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/posts"],
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["/api/categories"],
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("DELETE", `/api/posts/${postId}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  const posts = postsData?.posts || [];
  const categories = categoriesData?.categories || [];

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((cat: Category) => cat.id === categoryId);
    return category?.name || "Uncategorized";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch {
      return "Recent";
    }
  };

  const truncateContent = (content: string, maxLength = 100) => {
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + "..." 
      : textContent;
  };

  const handleDeletePost = (postId: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deletePostMutation.mutate(postId);
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Posts</h1>
            </div>
            <Link href="/admin/posts/new">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Post
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {postsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h2>
              <p className="text-gray-600 mb-8">Create your first blog post to get started.</p>
              <Link href="/admin/posts/new">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Posts</p>
                        <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Eye className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Published</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {posts.filter((p: Post) => p.status === 'published').length}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <Eye className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Drafts</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {posts.filter((p: Post) => p.status === 'draft').length}
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <Edit className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Posts List */}
              <div className="grid gap-6">
                {posts.map((post: Post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={post.status === 'published' ? 'default' : 'secondary'}
                              className={post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                            >
                              {post.status === 'published' ? 'Published' : 'Draft'}
                            </Badge>
                            <Badge variant="outline">
                              {getCategoryName(post.categoryId)}
                            </Badge>
                          </div>
                          
                          <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                            {post.title}
                          </CardTitle>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(post.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Admin
                            </div>
                          </div>
                          
                          <CardDescription className="text-gray-600">
                            {post.excerpt || truncateContent(post.content)}
                          </CardDescription>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {post.status === 'published' && (
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </Link>
                          )}
                          
                          <Link href={`/admin/posts/edit/${post.id}`}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-1"
                              data-testid={`button-edit-${post.id}`}
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                          </Link>
                          
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleDeletePost(post.id, post.title)}
                            disabled={deletePostMutation.isPending}
                            data-testid={`button-delete-${post.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
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