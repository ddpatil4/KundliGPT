import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
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

export default function Blog() {
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/posts"],
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["/api/categories"],
  });

  const publishedPosts = postsData?.posts?.filter((post: Post) => post.status === "published") || [];
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

  const truncateContent = (content: string, maxLength = 150) => {
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + "..." 
      : textContent;
  };

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ज्योतिष ब्लॉग
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              कुंडली से जुड़ी उपयोगी जानकारी, ज्योतिष टिप्स और व्यावहारिक सुझाव
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {publishedPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">कोई पोस्ट उपलब्ध नहीं</h2>
            <p className="text-gray-600">जल्द ही नई पोस्ट्स आएंगी। बने रहें!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {publishedPosts.map((post: Post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-orange-200 hover:border-orange-300">
                {post.featuredImage && (
                  <div className="aspect-video bg-gradient-to-r from-orange-100 to-amber-100 overflow-hidden rounded-t-lg">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      data-testid={`img-post-${post.id}`}
                    />
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                      {getCategoryName(post.categoryId)}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Admin
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 line-clamp-3 mb-4">
                    {post.excerpt || truncateContent(post.content)}
                  </CardDescription>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium group/link"
                    data-testid={`link-read-more-${post.id}`}
                  >
                    पूरा पढ़ें
                    <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Navigation Link */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            data-testid="link-home"
          >
            कुंडली बनाने के लिए वापस जाएं
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}