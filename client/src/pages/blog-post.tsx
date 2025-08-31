import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Home } from "lucide-react";
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

export default function BlogPost() {
  const { slug } = useParams();

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/posts"],
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["/api/categories"],
  });

  const post = postsData?.posts?.find((p: Post) => p.slug === slug && p.status === "published");
  const categories = categoriesData?.categories || [];

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((cat: Category) => cat.id === categoryId);
    return category?.name || "Uncategorized";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy");
    } catch {
      return "Recent";
    }
  };

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">पोस्ट नहीं मिली</h1>
          <p className="text-gray-600 mb-8">यह पोस्ट अस्तित्व में नहीं है या अभी भी draft में है।</p>
          <div className="flex gap-4 justify-center">
            <Link href="/blog">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                सभी पोस्ट्स देखें
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2">
                <Home className="h-4 w-4" />
                होम पेज
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Navigation */}
      <div className="bg-white border-b border-orange-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/blog">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                सभी पोस्ट्स
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                होम
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-200">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-video bg-gradient-to-r from-orange-100 to-amber-100">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
                data-testid="img-featured"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 lg:p-12">
            {/* Meta */}
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                {getCategoryName(post.categoryId)}
              </Badge>
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
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <div className="text-xl text-gray-600 mb-8 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                {post.excerpt}
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-orange-600 prose-a:hover:text-orange-700 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: post.content }}
              data-testid="post-content"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/blog">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              और पोस्ट्स पढ़ें
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2">
              कुंडली बनाएं
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}