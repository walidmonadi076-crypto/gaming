
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { getBlogPostById, getAllBlogPosts, getCommentsByBlogId } from '../../lib/data';
import type { BlogPost, Comment } from '../../types';

const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className = '' }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className={`flex items-center text-yellow-400 ${className}`}>
            {[...Array(fullStars)].map((_, i) => <svg key={`full-${i}`} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>)}
            {halfStar && <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545zM10 12.83V2.5l1.837 3.718 4.108.597-2.973 2.898.702 4.09L10 12.83z"/></svg>}
            {[...Array(emptyStars)].map((_, i) => <svg key={`empty-${i}`} className="w-5 h-5 fill-current text-gray-600" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>)}
            <span className="ml-2 text-lg text-gray-300">{rating.toFixed(1)} / 5.0</span>
        </div>
    );
};

interface BlogDetailPageProps {
    post: BlogPost;
    comments: Comment[];
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ post, comments }) => {
    const router = useRouter();

    if (router.isFallback) {
        return (
             <div className="text-center p-10">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-lg text-gray-300">Loading Blog Post...</p>
            </div>
        );
    }
    
    return (
        <>
            <Head>
                <title>{post.title} | Crazy Games Clone</title>
                <meta name="description" content={post.summary} />
            </Head>
            <div className="max-w-4xl mx-auto">
                 <div className="mb-4">
                    <Link href="/blogs" className="text-sm text-purple-400 hover:underline">&lt; Back to Blogs</Link>
                </div>
                <header className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{post.title}</h1>
                    <div className="flex items-center text-sm text-gray-400">
                        <span>By {post.author}</span><span className="mx-2">&bull;</span><span>Published on {post.publishDate}</span>
                    </div>
                </header>
                <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-8 shadow-lg relative">
                    {post.videoUrl ? <video src={post.videoUrl} controls autoPlay muted className="w-full h-full object-contain"></video> : <Image src={post.imageUrl} alt={post.title} fill sizes="100vw" className="object-cover" />}
                </div>
                <div className="bg-gray-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 border border-purple-500/30">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white">Expert Rating</h3>
                        <p className="text-gray-400 mb-2">Our overall score for this product.</p>
                        <StarRating rating={post.rating} />
                    </div>
                    <a href={post.affiliateUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-600 transition-colors duration-300 transform hover:scale-105 flex-shrink-0">Check Price & Buy</a>
                </div>
                <article className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-purple-400 prose-strong:text-white prose-li:marker:text-gray-500" dangerouslySetInnerHTML={{ __html: post.content }} />
                <div className="mt-12 pt-8 border-t border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-6">{comments.length > 0 ? `${comments.length} Comments & Testimonials` : 'Leave the First Comment'}</h2>
                    <div className="space-y-6 mb-8">
                        {comments.map(comment => (
                            <div key={comment.id} className="flex items-start space-x-4">
                                <Image src={comment.avatarUrl} alt={comment.author} width={48} height={48} className="rounded-full" />
                                <div className="flex-grow bg-gray-800 p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-bold text-white">{comment.author}</p>
                                        <p className="text-xs text-gray-500">{comment.date}</p>
                                    </div>
                                    <p className="text-gray-300">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Leave a Comment</h3>
                        <form className="bg-gray-800 p-6 rounded-lg space-y-4">
                            <textarea className="w-full bg-gray-900 rounded-md p-3 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500" rows={4} placeholder="Write your comment here..."></textarea>
                            <input type="text" className="w-full bg-gray-900 rounded-md p-3 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500" placeholder="Your Name" />
                            <button type="submit" className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors">Post Comment</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getAllBlogPosts();
    const paths = posts.map(post => ({
        params: { id: post.id.toString() },
    }));
    return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const { id } = context.params!;
    const post = await getBlogPostById(Number(id));

    if (!post) {
        return { notFound: true };
    }

    const comments = await getCommentsByBlogId(post.id);

    return {
        props: {
            post,
            comments,
        },
        revalidate: 60,
    };
};

export default BlogDetailPage;
