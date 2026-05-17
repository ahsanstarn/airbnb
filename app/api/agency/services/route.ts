import { NextResponse } from 'next/server';

const services = [
  {
    id: 's1',
    title: 'Social Media Management',
    description: 'Full-service social media strategy, content creation, and community management for your hospitality business. We handle Instagram, Facebook, TikTok, and more.',
    icon: '📱',
    price: 'From 500 GEL/month',
    deliverables: ['Content calendar', 'Daily posts & stories', 'Community engagement', 'Monthly analytics report', 'Ad campaign management'],
  },
  {
    id: 's2',
    title: 'Professional Photography',
    description: 'High-end photography for hotels, restaurants, and tours. Interior, exterior, food, and lifestyle shots that make your property irresistible.',
    icon: '📸',
    price: 'From 300 GEL/session',
    deliverables: ['40+ edited photos', 'Aerial drone shots', 'Virtual tour', 'Commercial usage rights', '72-hour turnaround'],
  },
  {
    id: 's3',
    title: 'Web Design & Development',
    description: 'Custom website design with booking integration, multi-language support, and SEO optimization. Built on Next.js for blazing-fast performance.',
    icon: '🌐',
    price: 'From 2,000 GEL',
    deliverables: ['Responsive design', 'Booking system', 'Multi-language', 'SEO setup', 'Hosting & domain', '3 months support'],
  },
  {
    id: 's4',
    title: 'Content Writing & SEO',
    description: 'Professional copywriting for your website, blog, and marketing materials. SEO-optimized content in English, Georgian, and Russian.',
    icon: '✍️',
    price: 'From 200 GEL/article',
    deliverables: ['SEO keyword research', 'Blog posts (up to 1500 words)', 'Meta descriptions', 'Multilingual options', '1 revision included'],
  },
  {
    id: 's5',
    title: 'Brand Identity Design',
    description: 'Complete brand identity package including logo, color palette, typography, and brand guidelines for your Georgian tourism business.',
    icon: '🎨',
    price: 'From 1,500 GEL',
    deliverables: ['Logo (3 concepts)', 'Brand guide PDF', 'Business cards', 'Social media templates', 'Stationery design'],
  },
  {
    id: 's6',
    title: 'Email Marketing Setup',
    description: 'Set up automated email campaigns for guest communication, booking confirmations, newsletters, and re-engagement sequences.',
    icon: '📧',
    price: 'From 400 GEL',
    deliverables: ['Email template design', 'Automation workflows', 'Guest list segmentation', 'Campaign analytics', '30 days support'],
  },
];

export async function GET() {
  return NextResponse.json(services);
}
