import type { BlogPost, Comment } from '../types';

export const BLOGS_DATA: BlogPost[] = [
    {
        id: 1,
        title: "The Ultimate Guide to Mechanical Keyboards for Gaming",
        summary: "Dive deep into the world of mechanical keyboards. We review the top 5 models of the year, breaking down switch types, build quality, and why they're a game-changer for any serious gamer.",
        imageUrl: "https://picsum.photos/seed/blog1/800/450",
        author: "Alex 'Tech' Johnson",
        publishDate: "August 15, 2024",
        rating: 4.8,
        affiliateUrl: "https://www.amazon.com/s?k=mechanical+gaming+keyboard",
        content: `
<p>In the world of gaming peripherals, few items are as debated and cherished as the mechanical keyboard. But what makes them so special, and which one is right for you? This guide will walk you through everything you need to know.</p>
<h3 class="text-xl font-bold my-4">Why Go Mechanical?</h3>
<p>Unlike the mushy membrane keyboards that come with most PCs, mechanical keyboards use individual physical switches under each key. This results in a more tactile, responsive, and durable typing experience. For gamers, this means faster response times, satisfying feedback, and a keyboard that can withstand millions of keystrokes.</p>
<img src="https://picsum.photos/seed/blog1-content/600/350" alt="Keyboard switches" class="rounded-lg my-4" />
<h3 class="text-xl font-bold my-4">Top 5 Picks for 2024</h3>
<ol class="list-decimal list-inside space-y-2">
    <li><strong>Razer Huntsman V2:</strong> Best for competitive gaming with its optical switches.</li>
    <li><strong>Corsair K100 RGB:</strong> The premium choice with a host of features.</li>
    <li><strong>Logitech G Pro X:</strong> A great TKL (tenkeyless) option for those short on desk space.</li>
    <li><strong>SteelSeries Apex Pro:</strong> Features adjustable actuation switches for customized feel.</li>
    <li><strong>Keychron Q1:</strong> A fantastic entry into the world of custom mechanical keyboards.</li>
</ol>
<p class="mt-4">Each of these keyboards offers a unique experience, but all of them provide a significant upgrade over a standard keyboard. Investing in a good mechanical keyboard is investing in a better gaming experience.</p>
        `,
        category: 'Guide',
    },
    {
        id: 2,
        title: "Finding the Perfect Gaming Mouse: A 2024 Review",
        summary: "Your mouse is your primary weapon in many games. We've tested dozens of mice to find the best in terms of sensor accuracy, ergonomics, and features. See our top picks inside.",
        imageUrl: "https://picsum.photos/seed/blog2/800/450",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        author: "Samantha 'Swift' Lee",
        publishDate: "August 10, 2024",
        rating: 4.5,
        affiliateUrl: "https://www.amazon.com/s?k=gaming+mouse",
        content: "<p>A great gaming mouse can be the difference between victory and defeat. We look at sensor types, DPI, polling rates, and of course, the ever-important RGB lighting to help you make the right choice.</p>",
        category: 'Review'
    },
];

export const COMMENTS_DATA: { [key: number]: Comment[] } = {
    1: [
        { id: 1, author: "GamerPro123", avatarUrl: "https://i.pravatar.cc/40?u=1", date: "2 days ago", text: "Great article! I just bought the Corsair K100 based on this review and it's amazing. The difference is night and day." },
        { id: 2, author: "PixelPioneer", avatarUrl: "https://i.pravatar.cc/40?u=2", date: "1 day ago", text: "I've been using a Keychron for a while now and I love the customizability. Happy to see it get a mention!" },
    ],
    2: [
        { id: 3, author: "FPS_Queen", avatarUrl: "https://i.pravatar.cc/40?u=3", date: "5 days ago", text: "Sensor accuracy is everything. Thanks for breaking down the technical specs in an easy-to-understand way." },
    ]
};
