// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
// next-intl Link prefixes the active locale, so internal links resolve
// directly instead of bouncing through the middleware's 307 locale redirect.
import { Link } from "@/i18n/navigation";
import { usePrimaryCta } from "@/lib/usePrimaryCta";
import type { BlogPostFull } from "@/lib/notion";
import type { BlogPost } from "@/components/blog/BlogCard";
import { BlogCard } from "@/components/blog/BlogCard";

interface BlogPostContentProps {
  post: BlogPostFull;
  allPosts: BlogPost[];
}

export function BlogPostContent({ post, allPosts }: BlogPostContentProps) {
  const cta = usePrimaryCta("blog_post_cta");
  // Get related posts (same category, excluding current)
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2);

  // If not enough related by category, fill with other posts
  const additionalPosts =
    relatedPosts.length < 2
      ? allPosts.filter((p) => p.slug !== post.slug && !relatedPosts.includes(p)).slice(0, 2 - relatedPosts.length)
      : [];

  const displayRelated = [...relatedPosts, ...additionalPosts];

  return (
    <main className="bg-background">
      {/* Hero Image */}
      <section className="pt-8 pb-0">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ImagePlaceholder
              aspectRatio="video"
              src={post.image}
              alt={post.title}
              label={!post.image ? post.title : undefined}
              gradient="orange"
              className="rounded-3xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Article Header */}
      <section className="pt-12 pb-8">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/blog" className="hover:text-primary transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span>{post.category}</span>
            </div>

            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              {post.category}
            </span>

            {/* Title */}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-6 leading-tight"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="font-medium text-foreground">{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-6">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Render content as markdown-ish (simple line-by-line) */}
            {post.content.split("\n").map((line, index) => {
              const trimmed = line.trim();

              // Skip empty lines
              if (!trimmed) return <br key={index} />;

              // H1 headers
              if (trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
                return (
                  <h1 key={index} className="text-3xl md:text-4xl font-bold text-foreground mt-12 mb-6" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    {trimmed.replace("# ", "")}
                  </h1>
                );
              }

              // H2 headers
              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }

              // H3 headers
              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-3" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }

              // Horizontal rule
              if (trimmed === "---") {
                return <hr key={index} className="my-8 border-border" />;
              }

              // Blockquote
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                    {trimmed.replace("> ", "")}
                  </blockquote>
                );
              }

              // List items with bullet
              if (trimmed.startsWith("- ")) {
                const content = trimmed.replace("- ", "");
                // Check for bold text
                const parts = content.split(/\*\*(.*?)\*\*/g);
                return (
                  <li key={index} className="text-muted-foreground ml-6 mb-2">
                    {parts.map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="text-foreground">
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </li>
                );
              }

              // Numbered list items
              if (/^\d+\.\s/.test(trimmed)) {
                const content = trimmed.replace(/^\d+\.\s/, "");
                const parts = content.split(/\*\*(.*?)\*\*/g);
                return (
                  <li key={index} className="text-muted-foreground ml-6 mb-2 list-decimal">
                    {parts.map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="text-foreground">
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </li>
                );
              }

              // Regular paragraphs with bold text support
              const parts = trimmed.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                  {parts.map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="text-foreground">
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </p>
              );
            })}
          </motion.article>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-muted/50 border border-border"
          >
            <div>
              <h3 className="font-bold text-foreground mb-1" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                Enjoyed this article?
              </h3>
              <p className="text-muted-foreground text-sm">
                Share it with someone who might find it helpful.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.excerpt,
                      url: window.location.href,
                    });
                  }
                }}
              >
                Share
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                asChild
              >
                {cta.href === "#waitlist" ? (
                  <Link href="/#waitlist">Get the app</Link>
                ) : (
                  <a href={cta.href} onClick={cta.onClick}>Get the app</a>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      {displayRelated.length > 0 && (
        <section className="py-12 bg-muted/50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                More Articles
              </h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {displayRelated.map((relatedPost) => (
                  <BlogCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/blog">View All Posts</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-orange-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Ready to start connecting?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Join the people ditching the scroll for real plans.
            </p>
            <Button
              size="lg"
              className="rounded-full bg-white text-primary hover:bg-white/90 font-bold px-8"
              asChild
            >
              {cta.href === "#waitlist" ? (
                <Link href="/#waitlist">Get the app</Link>
              ) : (
                <a href={cta.href} onClick={cta.onClick}>Get the app</a>
              )}
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
