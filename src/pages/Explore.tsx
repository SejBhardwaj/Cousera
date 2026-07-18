import { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, TrendingUp, ChevronRight } from 'lucide-react';
import CourseCard, { Course } from '../components/CourseCard';
import { useOffline } from '../contexts/OfflineContext';

const CATEGORIES = [
  { name: 'All', count: 66, color: '#111', active: true },
  { name: 'Data Science', count: 13, color: '#D7FF54' },
  { name: 'Business', count: 12, color: '#FF6D70' },
  { name: 'Technology', count: 17, color: '#83D6FF' },
  { name: 'Design', count: 12, color: '#A98BFF' },
  { name: 'Marketing', count: 12, color: '#FFB259' },
];

const FEATURED_COURSES: Course[] = [
  {
    id: 'ml-specialization',
    title: 'Machine Learning Specialization',
    description: 'Master fundamental AI concepts and build intelligent systems. Learn supervised learning, neural networks, and best practices from industry leader Andrew Ng.',
    provider: 'Stanford Online',
    instructor: 'Andrew Ng',
    instructorImg: 'https://i.pravatar.cc/150?img=12',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#A98BFF',
    rating: 4.9,
    reviews: 128400,
    duration: '11 weeks',
    difficulty: 'Intermediate',
    tags: ['AI', 'Programming', 'Python', 'Data Science'],
  },
  {
    id: 's2',
    title: 'Applied Machine Learning in Python',
    description: 'Build practical ML models using scikit-learn and Python. Focus on real-world applications, model evaluation, and deployment strategies.',
    provider: 'University of Michigan',
    instructor: 'Kevin Collins',
    instructorImg: 'https://i.pravatar.cc/150?img=33',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#A98BFF',
    rating: 4.7,
    reviews: 48200,
    duration: '8 weeks',
    difficulty: 'Intermediate',
    tags: ['Programming', 'Python', 'Data Science', 'AI'],
  },
  {
    id: 's3',
    title: 'Machine Learning with TensorFlow on Google Cloud',
    description: 'Deploy scalable ML models on Google Cloud Platform. Learn TensorFlow, Vertex AI, and production ML engineering best practices.',
    provider: 'Google Cloud',
    instructor: 'GCP Team',
    instructorImg: 'https://i.pravatar.cc/150?img=32',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#D7FF54',
    rating: 4.6,
    reviews: 32000,
    duration: '6 weeks',
    difficulty: 'Advanced',
    tags: ['Cloud Computing', 'AI', 'Programming', 'Python'],
  },
  {
    id: 's4',
    title: 'Intro to Machine Learning',
    description: 'Perfect for beginners! Learn ML fundamentals, algorithms, and data preprocessing. Build your first predictive models with hands-on projects.',
    provider: 'Duke University',
    instructor: 'Lisa Park',
    instructorImg: 'https://i.pravatar.cc/150?img=47',
    thumbnail: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#83D6FF',
    rating: 4.5,
    reviews: 24500,
    duration: '4 weeks',
    difficulty: 'Beginner',
    tags: ['AI', 'Data Science', 'Programming'],
  },
  {
    id: 's5',
    title: 'ML Engineering for Production (MLOps)',
    description: 'Take ML models to production at scale. Master MLOps, CI/CD for ML, model monitoring, and deployment infrastructure.',
    provider: 'DeepLearning.AI',
    instructor: 'Andrew Ng',
    instructorImg: 'https://i.pravatar.cc/150?img=12',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#FF6D70',
    rating: 4.8,
    reviews: 39800,
    duration: '4 months',
    difficulty: 'Advanced',
    tags: ['Cloud Computing', 'AI', 'Programming'],
  },
  {
    id: 's6',
    title: 'Practical Deep Learning',
    description: 'Build real-world deep learning applications. Learn CNNs, RNNs, and transformers through hands-on projects and practical implementations.',
    provider: 'fast.ai',
    instructor: 'Jeremy Howard',
    instructorImg: 'https://i.pravatar.cc/150?img=68',
    thumbnail: 'https://images.unsplash.com/photo-1676277791608-b1d7d1e1ee3e?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#7DEBA3',
    rating: 4.9,
    reviews: 18200,
    duration: '7 weeks',
    difficulty: 'Intermediate',
    tags: ['AI', 'Python', 'Programming', 'Data Science'],
  },
  {
    id: 's7',
    title: 'UI/UX Design Bootcamp',
    description: 'Master user-centered design principles. Learn Figma, prototyping, user research, and create stunning portfolio-ready designs.',
    provider: 'Design Academy',
    instructor: 'Sarah Mitchell',
    instructorImg: 'https://i.pravatar.cc/150?img=45',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    category: 'Design',
    categoryColor: '#FF6D70',
    rating: 4.8,
    reviews: 34000,
    duration: '10 weeks',
    difficulty: 'Beginner',
    tags: ['Design', 'Web Development'],
  },
  {
    id: 's8',
    title: 'Digital Marketing Mastery',
    description: 'Become a digital marketing expert. Learn SEO, social media strategy, content marketing, and analytics to grow any business online.',
    provider: 'Marketing Pro',
    instructor: 'Alex Turner',
    instructorImg: 'https://i.pravatar.cc/150?img=51',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#FFB259',
    rating: 4.6,
    reviews: 28000,
    duration: '8 weeks',
    difficulty: 'Beginner',
    tags: ['Marketing', 'Business'],
  },
  {
    id: 's9',
    title: 'Full-Stack Web Development',
    description: 'Build modern web applications from scratch. Master React, Node.js, databases, and deploy production-ready applications.',
    provider: 'Web Dev Institute',
    instructor: 'Michael Chen',
    instructorImg: 'https://i.pravatar.cc/150?img=62',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    category: 'Technology',
    categoryColor: '#83D6FF',
    rating: 4.7,
    reviews: 42000,
    duration: '16 weeks',
    difficulty: 'Intermediate',
    tags: ['Programming', 'Web Development'],
  },
  {
    id: 's10',
    title: 'iOS App Development with Swift',
    description: 'Create beautiful iOS apps for iPhone and iPad. Learn Swift, SwiftUI, and publish apps to the App Store.',
    provider: 'Apple Developer Academy',
    instructor: 'Emma Rodriguez',
    instructorImg: 'https://i.pravatar.cc/150?img=48',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
    category: 'Technology',
    categoryColor: '#FFB3C6',
    rating: 4.8,
    reviews: 31000,
    duration: '12 weeks',
    difficulty: 'Intermediate',
    tags: ['Programming', 'Mobile Dev'],
  },
  {
    id: 's11',
    title: 'Business Strategy Essentials',
    description: 'Learn strategic thinking and business planning. Analyze markets, develop competitive strategies, and drive business growth.',
    provider: 'Business School Online',
    instructor: 'David Williams',
    instructorImg: 'https://i.pravatar.cc/150?img=71',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    category: 'Business',
    categoryColor: '#A98BFF',
    rating: 4.5,
    reviews: 19000,
    duration: '6 weeks',
    difficulty: 'Beginner',
    tags: ['Business', 'Marketing'],
  },
  {
    id: 's12',
    title: 'AWS Solutions Architect',
    description: 'Design and deploy scalable cloud infrastructure on AWS. Master EC2, S3, Lambda, and earn your AWS certification.',
    provider: 'Amazon Web Services',
    instructor: 'James Wilson',
    instructorImg: 'https://i.pravatar.cc/150?img=68',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    category: 'Technology',
    categoryColor: '#83D6FF',
    rating: 4.7,
    reviews: 52000,
    duration: '12 weeks',
    difficulty: 'Advanced',
    tags: ['Cloud Computing', 'Programming'],
  },
  // ========== ADDITIONAL MODERN COURSES FOR COMPLETE TAG COVERAGE ==========
  {
    id: 's13',
    title: 'Generative AI with Large Language Models',
    description: 'Master the latest in Gen AI! Learn to fine-tune LLMs, build chatbots with GPT-4, and create AI-powered applications.',
    provider: 'DeepLearning.AI',
    instructor: 'Andrew Ng',
    instructorImg: 'https://i.pravatar.cc/150?img=12',
    thumbnail: 'https://images.unsplash.com/photo-1655720033654-a4239dd42d10?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#D7FF54',
    rating: 4.9,
    reviews: 15600,
    duration: '8 weeks',
    difficulty: 'Advanced',
    tags: ['AI', 'Programming', 'Python', 'Data Science'],
  },
  {
    id: 's14',
    title: 'Product Design & User Research',
    description: 'Become a product designer. Learn design thinking, user research, and solve real user problems.',
    provider: 'IDEO U',
    instructor: 'Tom Kelly',
    instructorImg: 'https://i.pravatar.cc/150?img=55',
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80',
    category: 'Design',
    categoryColor: '#FF6D70',
    rating: 4.7,
    reviews: 12400,
    duration: '8 weeks',
    difficulty: 'Intermediate',
    tags: ['Design', 'Business'],
  },
  {
    id: 's15',
    title: 'Motion Graphics & Animation',
    description: 'Create stunning motion graphics. Master After Effects and visual storytelling for modern content.',
    provider: 'School of Motion',
    instructor: 'Joey Korenman',
    instructorImg: 'https://i.pravatar.cc/150?img=64',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80',
    category: 'Design',
    categoryColor: '#A98BFF',
    rating: 4.9,
    reviews: 8900,
    duration: '12 weeks',
    difficulty: 'Intermediate',
    tags: ['Design', 'Marketing'],
  },
  {
    id: 's16',
    title: '3D Design & Modeling with Blender',
    description: 'Enter the world of 3D! Learn Blender for modeling, texturing, and create assets for games and metaverse.',
    provider: 'Blender Institute',
    instructor: 'Ton Roosendaal',
    instructorImg: 'https://i.pravatar.cc/150?img=72',
    thumbnail: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=600&q=80',
    category: 'Design',
    categoryColor: '#83D6FF',
    rating: 4.8,
    reviews: 14200,
    duration: '10 weeks',
    difficulty: 'Beginner',
    tags: ['Design'],
  },
  {
    id: 's17',
    title: 'Brand Identity & Logo Design',
    description: 'Build powerful brands. Learn logo design, color theory, and create complete brand identities.',
    provider: 'CreativeLive',
    instructor: 'Aaron Draplin',
    instructorImg: 'https://i.pravatar.cc/150?img=58',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&q=80',
    category: 'Design',
    categoryColor: '#FFB259',
    rating: 4.7,
    reviews: 9800,
    duration: '6 weeks',
    difficulty: 'Beginner',
    tags: ['Design', 'Business', 'Marketing'],
  },
  {
    id: 's18',
    title: 'Design Systems & Component Libraries',
    description: 'Build scalable design systems. Create reusable components and maintain consistency across products.',
    provider: 'Figma',
    instructor: 'Diana Mounter',
    instructorImg: 'https://i.pravatar.cc/150?img=49',
    thumbnail: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&q=80',
    category: 'Design',
    categoryColor: '#D7FF54',
    rating: 4.8,
    reviews: 11200,
    duration: '7 weeks',
    difficulty: 'Advanced',
    tags: ['Design', 'Web Development', 'Programming'],
  },
  {
    id: 's19',
    title: 'Growth Marketing & Growth Hacking',
    description: 'Master growth strategies from Airbnb and Uber. Learn viral loops, A/B testing, and customer acquisition.',
    provider: 'Reforge',
    instructor: 'Brian Balfour',
    instructorImg: 'https://i.pravatar.cc/150?img=61',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#7DEBA3',
    rating: 4.9,
    reviews: 6800,
    duration: '6 weeks',
    difficulty: 'Advanced',
    tags: ['Marketing', 'Business', 'Data Science'],
  },
  {
    id: 's20',
    title: 'Social Media Marketing & Content Creation',
    description: 'Dominate Instagram, TikTok, and LinkedIn. Learn content creation and influencer marketing.',
    provider: 'HubSpot Academy',
    instructor: 'Jasmine Star',
    instructorImg: 'https://i.pravatar.cc/150?img=44',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#FFB3C6',
    rating: 4.7,
    reviews: 15600,
    duration: '5 weeks',
    difficulty: 'Beginner',
    tags: ['Marketing', 'Business', 'Design'],
  },
  {
    id: 's21',
    title: 'E-Commerce & Shopify Mastery',
    description: 'Launch an e-commerce store. Master Shopify, dropshipping, and conversion optimization.',
    provider: 'Shopify Academy',
    instructor: 'Ezra Firestone',
    instructorImg: 'https://i.pravatar.cc/150?img=70',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    category: 'Business',
    categoryColor: '#83D6FF',
    rating: 4.6,
    reviews: 11400,
    duration: '8 weeks',
    difficulty: 'Intermediate',
    tags: ['Business', 'Marketing'],
  },
  {
    id: 's22',
    title: 'Product Management & Strategy',
    description: 'Become a product manager. Learn roadmapping, user stories, agile, and ship products people love.',
    provider: 'Product School',
    instructor: 'Carlos GonzÃ¡lez',
    instructorImg: 'https://i.pravatar.cc/150?img=56',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80',
    category: 'Business',
    categoryColor: '#D7FF54',
    rating: 4.8,
    reviews: 9200,
    duration: '10 weeks',
    difficulty: 'Intermediate',
    tags: ['Business', 'Design'],
  },
  {
    id: 's23',
    title: 'Data-Driven Marketing Analytics',
    description: 'Master marketing analytics with Google Analytics 4, attribution modeling, and data-backed decisions.',
    provider: 'Google',
    instructor: 'Avinash Kaushik',
    instructorImg: 'https://i.pravatar.cc/150?img=66',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#A98BFF',
    rating: 4.7,
    reviews: 13800,
    duration: '7 weeks',
    difficulty: 'Intermediate',
    tags: ['Marketing', 'Data Science', 'Business'],
  },
  {
    id: 's24',
    title: 'React & Next.js - The Complete Guide',
    description: 'Master modern React. Build lightning-fast web apps with Next.js 14, server components, and TypeScript.',
    provider: 'Vercel',
    instructor: 'Lee Robinson',
    instructorImg: 'https://i.pravatar.cc/150?img=59',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
    category: 'Technology',
    categoryColor: '#D7FF54',
    rating: 4.9,
    reviews: 18400,
    duration: '12 weeks',
    difficulty: 'Intermediate',
    tags: ['Programming', 'Web Development'],
  },
  {
    id: 's25',
    title: 'Web3 & Blockchain Development',
    description: 'Build decentralized apps. Learn Solidity, smart contracts, and create NFT marketplaces.',
    provider: 'ChainShot',
    instructor: 'Austin Griffith',
    instructorImg: 'https://i.pravatar.cc/150?img=73',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80',
    category: 'Technology',
    categoryColor: '#7DEBA3',
    rating: 4.6,
    reviews: 8600,
    duration: '14 weeks',
    difficulty: 'Advanced',
    tags: ['Programming', 'Web Development'],
  },
  {
    id: 's26',
    title: 'Frontend Performance Optimization',
    description: 'Make blazing-fast websites. Learn Core Web Vitals, lazy loading, and optimization techniques.',
    provider: 'Google Chrome Team',
    instructor: 'Addy Osmani',
    instructorImg: 'https://i.pravatar.cc/150?img=67',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    category: 'Technology',
    categoryColor: '#FFB259',
    rating: 4.8,
    reviews: 7200,
    duration: '6 weeks',
    difficulty: 'Advanced',
    tags: ['Programming', 'Web Development'],
  },
  {
    id: 's27',
    title: 'API Design & Backend Development',
    description: 'Build scalable REST and GraphQL APIs. Master Node.js, Express, and database design.',
    provider: 'Backend Masters',
    instructor: 'Scott Moss',
    instructorImg: 'https://i.pravatar.cc/150?img=74',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    category: 'Technology',
    categoryColor: '#83D6FF',
    rating: 4.7,
    reviews: 9800,
    duration: '10 weeks',
    difficulty: 'Intermediate',
    tags: ['Programming', 'Web Development', 'Cloud Computing'],
  },
  {
    id: 's28',
    title: 'Accessibility & Inclusive Design',
    description: 'Build websites for everyone. Master WCAG standards and create truly accessible experiences.',
    provider: 'A11y Project',
    instructor: 'Marcy Sutton',
    instructorImg: 'https://i.pravatar.cc/150?img=46',
    thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80',
    category: 'Technology',
    categoryColor: '#FF6D70',
    rating: 4.9,
    reviews: 5400,
    duration: '5 weeks',
    difficulty: 'Intermediate',
    tags: ['Web Development', 'Design', 'Programming'],
  },
  {
    id: 's29',
    title: 'Android App Development with Kotlin',
    description: 'Build modern Android apps. Master Jetpack Compose, Material Design 3, and publish to Play Store.',
    provider: 'Google Developers',
    instructor: 'Florina Muntenescu',
    instructorImg: 'https://i.pravatar.cc/150?img=43',
    thumbnail: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=600&q=80',
    category: 'Technology',
    categoryColor: '#7DEBA3',
    rating: 4.7,
    reviews: 14200,
    duration: '12 weeks',
    difficulty: 'Intermediate',
    tags: ['Programming', 'Mobile Dev'],
  },
  {
    id: 's30',
    title: 'React Native - Cross-Platform Apps',
    description: 'Build iOS and Android with one codebase. Master React Native and ship to both stores.',
    provider: 'Meta',
    instructor: 'William Candillon',
    instructorImg: 'https://i.pravatar.cc/150?img=75',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
    category: 'Technology',
    categoryColor: '#83D6FF',
    rating: 4.8,
    reviews: 16800,
    duration: '10 weeks',
    difficulty: 'Intermediate',
    tags: ['Programming', 'Mobile Dev', 'Web Development'],
  },
  {
    id: 's31',
    title: 'Flutter & Dart - Mobile UI Development',
    description: 'Create beautiful natively compiled applications. Master Flutter widgets and state management.',
    provider: 'Google',
    instructor: 'Angela Yu',
    instructorImg: 'https://i.pravatar.cc/150?img=52',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80',
    category: 'Technology',
    categoryColor: '#D7FF54',
    rating: 4.9,
    reviews: 22400,
    duration: '14 weeks',
    difficulty: 'Beginner',
    tags: ['Programming', 'Mobile Dev'],
  },
  {
    id: 's32',
    title: 'Mobile DevOps & CI/CD',
    description: 'Automate mobile deployment. Master Fastlane, GitHub Actions, and continuous delivery.',
    provider: 'Mobile DevOps Academy',
    instructor: 'Josh Holtz',
    instructorImg: 'https://i.pravatar.cc/150?img=76',
    thumbnail: 'https://images.unsplash.com/photo-1618401479427-c8ef9465fbe1?w=600&q=80',
    category: 'Technology',
    categoryColor: '#FFB259',
    rating: 4.6,
    reviews: 4800,
    duration: '8 weeks',
    difficulty: 'Advanced',
    tags: ['Mobile Dev', 'Programming', 'Cloud Computing'],
  },
  {
    id: 's33',
    title: 'DevOps Engineering & Kubernetes',
    description: 'Master modern DevOps. Learn Docker, Kubernetes, CI/CD, and infrastructure as code with Terraform.',
    provider: 'Linux Foundation',
    instructor: 'Kelsey Hightower',
    instructorImg: 'https://i.pravatar.cc/150?img=77',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80',
    category: 'Technology',
    categoryColor: '#7DEBA3',
    rating: 4.9,
    reviews: 11200,
    duration: '14 weeks',
    difficulty: 'Advanced',
    tags: ['Cloud Computing', 'Programming'],
  },
  {
    id: 's34',
    title: 'Microsoft Azure Cloud Solutions',
    description: 'Build on Azure. Master Azure services, serverless computing, and earn Azure certifications.',
    provider: 'Microsoft',
    instructor: 'Scott Hanselman',
    instructorImg: 'https://i.pravatar.cc/150?img=78',
    thumbnail: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&q=80',
    category: 'Technology',
    categoryColor: '#83D6FF',
    rating: 4.6,
    reviews: 18600,
    duration: '10 weeks',
    difficulty: 'Intermediate',
    tags: ['Cloud Computing', 'Programming'],
  },
  {
    id: 's35',
    title: 'Serverless Architecture & Lambda',
    description: 'Go serverless! Build scalable apps without servers. Master AWS Lambda and event-driven architecture.',
    provider: 'Serverless Inc',
    instructor: 'Yan Cui',
    instructorImg: 'https://i.pravatar.cc/150?img=79',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    category: 'Technology',
    categoryColor: '#D7FF54',
    rating: 4.7,
    reviews: 6800,
    duration: '8 weeks',
    difficulty: 'Intermediate',
    tags: ['Cloud Computing', 'Programming', 'Web Development'],
  },
  {
    id: 's36',
    title: 'Cloud Security & Infrastructure Protection',
    description: 'Secure cloud environments. Learn IAM, encryption, network security, and protect cloud infrastructure.',
    provider: 'SANS Institute',
    instructor: 'Eric Cole',
    instructorImg: 'https://i.pravatar.cc/150?img=80',
    thumbnail: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&q=80',
    category: 'Technology',
    categoryColor: '#FF6D70',
    rating: 4.8,
    reviews: 8400,
    duration: '10 weeks',
    difficulty: 'Advanced',
    tags: ['Cloud Computing', 'Programming'],
  },
  // ========== ADDITIONAL COURSES TO REACH 11+ PER CATEGORY ==========
  // DATA SCIENCE (adding 6 more to reach 13 total)
  {
    id: 's37',
    title: 'Data Analysis with Pandas & NumPy',
    description: 'Master data manipulation and analysis with Python. Learn Pandas, NumPy, and perform exploratory data analysis.',
    provider: 'DataCamp',
    instructor: 'Hugo Bowne-Anderson',
    instructorImg: 'https://i.pravatar.cc/150?img=81',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#D7FF54',
    rating: 4.7,
    reviews: 12300,
    duration: '8 weeks',
    difficulty: 'Beginner',
    tags: ['Data Science', 'Python', 'Programming'],
  },
  {
    id: 's38',
    title: 'SQL for Data Science',
    description: 'Master SQL queries, database design, and data extraction. Essential skills for every data professional.',
    provider: 'UC Davis',
    instructor: 'Sadie St. Lawrence',
    instructorImg: 'https://i.pravatar.cc/150?img=82',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#83D6FF',
    rating: 4.6,
    reviews: 18900,
    duration: '6 weeks',
    difficulty: 'Beginner',
    tags: ['Data Science', 'Programming'],
  },
  {
    id: 's39',
    title: 'Data Visualization with Tableau',
    description: 'Create stunning dashboards and visualizations. Master Tableau for business intelligence and analytics.',
    provider: 'Tableau',
    instructor: 'Ben Jones',
    instructorImg: 'https://i.pravatar.cc/150?img=83',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#A98BFF',
    rating: 4.8,
    reviews: 14200,
    duration: '7 weeks',
    difficulty: 'Intermediate',
    tags: ['Data Science', 'Business'],
  },
  {
    id: 's40',
    title: 'Big Data & Spark Fundamentals',
    description: 'Process massive datasets with Apache Spark. Learn distributed computing and big data engineering.',
    provider: 'Databricks',
    instructor: 'Jules Damji',
    instructorImg: 'https://i.pravatar.cc/150?img=84',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#7DEBA3',
    rating: 4.7,
    reviews: 8600,
    duration: '10 weeks',
    difficulty: 'Advanced',
    tags: ['Data Science', 'Programming', 'Cloud Computing'],
  },
  {
    id: 's41',
    title: 'Statistics & Probability for Data Science',
    description: 'Build a strong statistical foundation. Master hypothesis testing, regression, and probability theory.',
    provider: 'MIT OpenCourseWare',
    instructor: 'John Tsitsiklis',
    instructorImg: 'https://i.pravatar.cc/150?img=85',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#FFB3C6',
    rating: 4.9,
    reviews: 6400,
    duration: '12 weeks',
    difficulty: 'Intermediate',
    tags: ['Data Science', 'AI'],
  },
  {
    id: 's42',
    title: 'Time Series Analysis & Forecasting',
    description: 'Predict future trends with time series models. Learn ARIMA, Prophet, and forecasting techniques.',
    provider: 'DataRobot',
    instructor: 'Dr. Forecaster',
    instructorImg: 'https://i.pravatar.cc/150?img=86',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#D7FF54',
    rating: 4.6,
    reviews: 5200,
    duration: '8 weeks',
    difficulty: 'Advanced',
    tags: ['Data Science', 'AI', 'Python'],
  },
  // DESIGN (adding 6 more to reach 12 total)
  {
    id: 's43',
    title: 'Mobile App Design with Figma',
    description: 'Design beautiful mobile interfaces. Master Figma, iOS/Android design patterns, and prototyping.',
    provider: 'Designlab',
    instructor: 'Pablo Stanley',
    instructorImg: 'https://i.pravatar.cc/150?img=87',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
    category: 'Design',
    categoryColor: '#FF6D70',
    rating: 4.8,
    reviews: 9800,
    duration: '8 weeks',
    difficulty: 'Intermediate',
    tags: ['Design', 'Mobile Dev'],
  },
  {
    id: 's44',
    title: 'Graphic Design Fundamentals',
    description: 'Learn design principles, typography, color theory, and composition for stunning visual work.',
    provider: 'CalArts',
    instructor: 'Michael Worthington',
    instructorImg: 'https://i.pravatar.cc/150?img=88',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80',
    category: 'Design',
    categoryColor: '#A98BFF',
    rating: 4.7,
    reviews: 16200,
    duration: '9 weeks',
    difficulty: 'Beginner',
    tags: ['Design', 'Marketing'],
  },
  {
    id: 's45',
    title: 'Interaction Design & Microinteractions',
    description: 'Create delightful user experiences. Master animations, transitions, and interactive prototypes.',
    provider: 'Interaction Design Foundation',
    instructor: 'Alan Dix',
    instructorImg: 'https://i.pravatar.cc/150?img=89',
    thumbnail: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&q=80',
    category: 'Design',
    categoryColor: '#83D6FF',
    rating: 4.9,
    reviews: 7400,
    duration: '7 weeks',
    difficulty: 'Advanced',
    tags: ['Design', 'Web Development'],
  },
  {
    id: 's46',
    title: 'Illustration for Digital Media',
    description: 'Create original illustrations for web and mobile. Learn digital drawing, character design, and storytelling.',
    provider: 'Skillshare',
    instructor: 'Von Glitschka',
    instructorImg: 'https://i.pravatar.cc/150?img=90',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&q=80',
    category: 'Design',
    categoryColor: '#FFB259',
    rating: 4.6,
    reviews: 8900,
    duration: '10 weeks',
    difficulty: 'Intermediate',
    tags: ['Design'],
  },
  {
    id: 's47',
    title: 'Design Thinking & Innovation',
    description: 'Solve complex problems with design thinking. Learn empathy mapping, ideation, and rapid prototyping.',
    provider: 'Stanford d.school',
    instructor: 'Bill Burnett',
    instructorImg: 'https://i.pravatar.cc/150?img=91',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80',
    category: 'Design',
    categoryColor: '#D7FF54',
    rating: 4.9,
    reviews: 11200,
    duration: '6 weeks',
    difficulty: 'Beginner',
    tags: ['Design', 'Business'],
  },
  {
    id: 's48',
    title: 'Web Design with Webflow & No-Code',
    description: 'Build professional websites without coding. Master Webflow, responsive design, and CMS.',
    provider: 'Webflow University',
    instructor: 'Nelson Abalos Jr.',
    instructorImg: 'https://i.pravatar.cc/150?img=92',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    category: 'Design',
    categoryColor: '#7DEBA3',
    rating: 4.7,
    reviews: 13600,
    duration: '8 weeks',
    difficulty: 'Beginner',
    tags: ['Design', 'Web Development'],
  },
  // MARKETING (adding 8 more to reach 12 total)
  {
    id: 's49',
    title: 'SEO Mastery & Organic Traffic Growth',
    description: 'Rank #1 on Google. Master keyword research, on-page SEO, link building, and technical SEO.',
    provider: 'Moz Academy',
    instructor: 'Rand Fishkin',
    instructorImg: 'https://i.pravatar.cc/150?img=93',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#7DEBA3',
    rating: 4.8,
    reviews: 14800,
    duration: '9 weeks',
    difficulty: 'Intermediate',
    tags: ['Marketing', 'Business'],
  },
  {
    id: 's50',
    title: 'Email Marketing & Automation',
    description: 'Build email campaigns that convert. Master Mailchimp, automation, segmentation, and copywriting.',
    provider: 'ConvertKit',
    instructor: 'Nathan Barry',
    instructorImg: 'https://i.pravatar.cc/150?img=94',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#FFB3C6',
    rating: 4.6,
    reviews: 9200,
    duration: '6 weeks',
    difficulty: 'Beginner',
    tags: ['Marketing', 'Business'],
  },
  {
    id: 's51',
    title: 'Content Marketing & Storytelling',
    description: 'Create content that goes viral. Master blog writing, video content, and content distribution strategies.',
    provider: 'Content Marketing Institute',
    instructor: 'Ann Handley',
    instructorImg: 'https://i.pravatar.cc/150?img=95',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#A98BFF',
    rating: 4.7,
    reviews: 10600,
    duration: '8 weeks',
    difficulty: 'Intermediate',
    tags: ['Marketing', 'Business', 'Design'],
  },
  {
    id: 's52',
    title: 'Influencer Marketing & Brand Partnerships',
    description: 'Work with influencers to grow your brand. Learn campaign management, negotiation, and ROI tracking.',
    provider: 'Later',
    instructor: 'Matt Smith',
    instructorImg: 'https://i.pravatar.cc/150?img=96',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#D7FF54',
    rating: 4.5,
    reviews: 7800,
    duration: '7 weeks',
    difficulty: 'Intermediate',
    tags: ['Marketing', 'Business'],
  },
  {
    id: 's53',
    title: 'Facebook & Instagram Ads Mastery',
    description: 'Run profitable ad campaigns. Master Meta Ads Manager, targeting, creative testing, and optimization.',
    provider: 'Meta Blueprint',
    instructor: 'Amanda Bond',
    instructorImg: 'https://i.pravatar.cc/150?img=97',
    thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#FF6D70',
    rating: 4.8,
    reviews: 16400,
    duration: '8 weeks',
    difficulty: 'Advanced',
    tags: ['Marketing', 'Business', 'Data Science'],
  },
  {
    id: 's54',
    title: 'Video Marketing & YouTube Growth',
    description: 'Grow your YouTube channel to 100K subscribers. Learn video production, SEO, and monetization.',
    provider: 'VidIQ',
    instructor: 'Derral Eves',
    instructorImg: 'https://i.pravatar.cc/150?img=98',
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#FFB259',
    rating: 4.7,
    reviews: 12200,
    duration: '10 weeks',
    difficulty: 'Beginner',
    tags: ['Marketing', 'Design'],
  },
  {
    id: 's55',
    title: 'Conversion Rate Optimization (CRO)',
    description: 'Double your conversion rates. Master A/B testing, landing page design, and user psychology.',
    provider: 'CXL',
    instructor: 'Peep Laja',
    instructorImg: 'https://i.pravatar.cc/150?img=99',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#83D6FF',
    rating: 4.9,
    reviews: 5600,
    duration: '7 weeks',
    difficulty: 'Advanced',
    tags: ['Marketing', 'Data Science', 'Business'],
  },
  {
    id: 's56',
    title: 'Brand Strategy & Positioning',
    description: 'Build powerful brands that stand out. Learn brand architecture, messaging, and competitive positioning.',
    provider: 'Brand Strategist Institute',
    instructor: 'Marty Neumeier',
    instructorImg: 'https://i.pravatar.cc/150?img=11',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#7DEBA3',
    rating: 4.6,
    reviews: 8400,
    duration: '9 weeks',
    difficulty: 'Intermediate',
    tags: ['Marketing', 'Business', 'Design'],
  },
  // BUSINESS (adding 9 more to reach 12 total)
  {
    id: 's57',
    title: 'Startup Funding & Venture Capital',
    description: 'Raise capital for your startup. Learn pitch decks, term sheets, and investor relations.',
    provider: 'Y Combinator',
    instructor: 'Michael Seibel',
    instructorImg: 'https://i.pravatar.cc/150?img=13',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    category: 'Business',
    categoryColor: '#D7FF54',
    rating: 4.8,
    reviews: 9800,
    duration: '6 weeks',
    difficulty: 'Advanced',
    tags: ['Business'],
  },
  {
    id: 's58',
    title: 'Financial Analysis & Corporate Finance',
    description: 'Master financial modeling, valuation, and investment analysis for business decision-making.',
    provider: 'Wharton School',
    instructor: 'Richard Lambert',
    instructorImg: 'https://i.pravatar.cc/150?img=14',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    category: 'Business',
    categoryColor: '#FFB259',
    rating: 4.7,
    reviews: 14200,
    duration: '10 weeks',
    difficulty: 'Intermediate',
    tags: ['Business', 'Data Science'],
  },
  {
    id: 's59',
    title: 'Project Management Professional (PMP)',
    description: 'Become a certified project manager. Master Agile, Scrum, Waterfall, and stakeholder management.',
    provider: 'PMI',
    instructor: 'Rita Mulcahy',
    instructorImg: 'https://i.pravatar.cc/150?img=15',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80',
    category: 'Business',
    categoryColor: '#83D6FF',
    rating: 4.6,
    reviews: 18600,
    duration: '12 weeks',
    difficulty: 'Intermediate',
    tags: ['Business'],
  },
  {
    id: 's60',
    title: 'Supply Chain Management & Logistics',
    description: 'Optimize global supply chains. Learn procurement, inventory management, and logistics strategy.',
    provider: 'MIT',
    instructor: 'Yossi Sheffi',
    instructorImg: 'https://i.pravatar.cc/150?img=16',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
    category: 'Business',
    categoryColor: '#A98BFF',
    rating: 4.5,
    reviews: 7200,
    duration: '8 weeks',
    difficulty: 'Advanced',
    tags: ['Business', 'Data Science'],
  },
  {
    id: 's61',
    title: 'Negotiation & Influence Skills',
    description: 'Master the art of negotiation. Learn persuasion tactics, conflict resolution, and deal-making.',
    provider: 'Harvard Law School',
    instructor: 'Robert Mnookin',
    instructorImg: 'https://i.pravatar.cc/150?img=17',
    thumbnail: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
    category: 'Business',
    categoryColor: '#FF6D70',
    rating: 4.9,
    reviews: 11400,
    duration: '7 weeks',
    difficulty: 'Beginner',
    tags: ['Business', 'Marketing'],
  },
  {
    id: 's62',
    title: 'Operations Management & Lean Six Sigma',
    description: 'Streamline operations and eliminate waste. Learn process improvement and operational excellence.',
    provider: 'ASQ',
    instructor: 'Jay Arthur',
    instructorImg: 'https://i.pravatar.cc/150?img=18',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    category: 'Business',
    categoryColor: '#7DEBA3',
    rating: 4.6,
    reviews: 9600,
    duration: '10 weeks',
    difficulty: 'Intermediate',
    tags: ['Business', 'Data Science'],
  },
  {
    id: 's63',
    title: 'Human Resources Management',
    description: 'Build high-performing teams. Learn recruitment, performance management, and organizational culture.',
    provider: 'SHRM',
    instructor: 'Laszlo Bock',
    instructorImg: 'https://i.pravatar.cc/150?img=19',
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80',
    category: 'Business',
    categoryColor: '#FFB3C6',
    rating: 4.5,
    reviews: 13800,
    duration: '9 weeks',
    difficulty: 'Beginner',
    tags: ['Business'],
  },
  {
    id: 's64',
    title: 'Business Analytics & Intelligence',
    description: 'Make data-driven decisions. Master Power BI, Excel analytics, and business reporting.',
    provider: 'Microsoft',
    instructor: 'Alberto Ferrari',
    instructorImg: 'https://i.pravatar.cc/150?img=20',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    category: 'Business',
    categoryColor: '#D7FF54',
    rating: 4.8,
    reviews: 16200,
    duration: '8 weeks',
    difficulty: 'Intermediate',
    tags: ['Business', 'Data Science'],
  },
  {
    id: 's65',
    title: 'Entrepreneurship & Startup Launch',
    description: 'Turn your idea into a thriving business. Learn business models, MVP development, and scaling.',
    provider: 'Founders Institute',
    instructor: 'Adeo Ressi',
    instructorImg: 'https://i.pravatar.cc/150?img=21',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80',
    category: 'Business',
    categoryColor: '#83D6FF',
    rating: 4.7,
    reviews: 10800,
    duration: '12 weeks',
    difficulty: 'Beginner',
    tags: ['Business', 'Marketing'],
  },
  // TECHNOLOGY - Additional if needed (currently at 16, adding 1 to reach 17)
  {
    id: 's66',
    title: 'Cybersecurity Fundamentals',
    description: 'Protect systems from cyber threats. Learn ethical hacking, network security, and incident response.',
    provider: 'CompTIA',
    instructor: 'Troy Hunt',
    instructorImg: 'https://i.pravatar.cc/150?img=22',
    thumbnail: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&q=80',
    category: 'Technology',
    categoryColor: '#FF6D70',
    rating: 4.8,
    reviews: 15400,
    duration: '10 weeks',
    difficulty: 'Intermediate',
    tags: ['Programming', 'Cloud Computing'],
  },
];

const TRENDING = [
  { skill: 'Generative AI', growth: '+340%', color: '#D7FF54', textColor: '#111' },
  { skill: 'Prompt Engineering', growth: '+280%', color: '#EDE9FF', textColor: '#A98BFF' },
  { skill: 'LLM Development', growth: '+210%', color: '#E0F5FF', textColor: '#0099CC' },
  { skill: 'Cloud Security', growth: '+185%', color: '#FFF0F0', textColor: '#FF6D70' },
  { skill: 'Data Engineering', growth: '+160%', color: '#ECFDF5', textColor: '#059669' },
];

export default function Explore({ onCourseClick }: { onCourseClick: (id: string) => void }) {
  const { offlineCourses } = useOffline();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [level, setLevel] = useState('All Levels');
  const [duration, setDuration] = useState('Any Duration');
  const [minRating, setMinRating] = useState('All Ratings');
  const [sortBy, setSortBy] = useState('Most Popular');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all unique tags from courses
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    FEATURED_COURSES.forEach(course => {
      course.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Extract all unique providers
  const allProviders = useMemo(() => {
    const providers = new Set<string>();
    FEATURED_COURSES.forEach(course => providers.add(course.provider));
    return Array.from(providers).sort();
  }, []);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Toggle provider selection
  const toggleProvider = (provider: string) => {
    setSelectedProviders(prev => {
      if (prev.includes(provider)) {
        return prev.filter(p => p !== provider);
      } else {
        return [...prev, provider];
      }
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setActiveCategory('All');
    setSelectedTags([]);
    setSelectedProviders([]);
    setLevel('All Levels');
    setDuration('Any Duration');
    setMinRating('All Ratings');
    setSortBy('Most Popular');
  };

  // Check if any filters are active
  const hasActiveFilters = search !== '' || activeCategory !== 'All' || selectedTags.length > 0 || selectedProviders.length > 0 || level !== 'All Levels' || duration !== 'Any Duration' || minRating !== 'All Ratings';

  // Filter courses based on selected category, search, tags, and filters
  const filteredCourses = useMemo(() => {
    let courses = FEATURED_COURSES.filter(course => {
      // Category filter
      const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
      
      // Search filter (title, description, tags, instructor, provider)
      const searchLower = search.toLowerCase().trim();
      const matchesSearch = !searchLower || 
        course.title.toLowerCase().includes(searchLower) ||
        (course.description?.toLowerCase().includes(searchLower) ?? false) ||
        (course.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ?? false) ||
        course.instructor.toLowerCase().includes(searchLower) ||
        course.provider.toLowerCase().includes(searchLower);
      
      // Tag filter (OR logic - course must have ANY of the selected tags)
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(selectedTag => 
          course.tags?.some(courseTag => courseTag.toLowerCase() === selectedTag.toLowerCase())
        );
      
      // Level filter
      const matchesLevel = level === 'All Levels' || course.difficulty === level;
      
      // Provider filter (OR logic - course matches if provider is in selected list)
      const matchesProvider = selectedProviders.length === 0 || selectedProviders.includes(course.provider);
      
      // Duration filter - Enhanced with better parsing
      const matchesDuration = (() => {
        if (duration === 'Any Duration') return true;
        
        const durationText = course.duration.toLowerCase();
        
        // Helper function to convert duration to weeks
        const getDurationInWeeks = (text: string): number => {
          const weekMatch = text.match(/(\d+)\s*week/);
          const monthMatch = text.match(/(\d+)\s*month/);
          
          if (weekMatch) return parseInt(weekMatch[1]);
          if (monthMatch) return parseInt(monthMatch[1]) * 4; // 1 month = ~4 weeks
          return 999; // Unknown duration
        };
        
        const weeks = getDurationInWeeks(durationText);
        
        // Handle both old and new format (with or without labels)
        if (duration.startsWith('< 4 weeks')) {
          return weeks < 4;
        }
        if (duration.startsWith('4-8 weeks')) {
          return weeks >= 4 && weeks <= 8;
        }
        if (duration.startsWith('8-12 weeks')) {
          return weeks > 8 && weeks <= 12;
        }
        if (duration.startsWith('> 12 weeks')) {
          return weeks > 12;
        }
        
        return true;
      })();
      
      // Rating filter
      const matchesRating = (() => {
        if (minRating === 'All Ratings') return true;
        // Extract number from format like "4.9+ ⭐ (Excellent)" or "4.8+"
        const match = minRating.match(/(\d+\.\d+)\+/);
        if (match) {
          const ratingValue = parseFloat(match[1]);
          return course.rating >= ratingValue;
        }
        return true;
      })();
      
      return matchesCategory && matchesSearch && matchesTags && matchesLevel && matchesDuration && matchesRating && matchesProvider;
    });

    // Sort courses - Create a copy to avoid mutating the filtered array
    const sortedCourses = [...courses];
    
    switch (sortBy) {
      case 'Most Popular':
        sortedCourses.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'Highest Rated':
        sortedCourses.sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          // If ratings are equal, sort by reviews as tiebreaker
          return b.reviews - a.reviews;
        });
        break;
      case 'Shortest Duration':
        sortedCourses.sort((a, b) => {
          const getDurationInWeeks = (dur: string) => {
            const weekMatch = dur.match(/(\d+)\s*week/);
            const monthMatch = dur.match(/(\d+)\s*month/);
            if (weekMatch) return parseInt(weekMatch[1]);
            if (monthMatch) return parseInt(monthMatch[1]) * 4;
            return 999;
          };
          return getDurationInWeeks(a.duration) - getDurationInWeeks(b.duration);
        });
        break;
      case 'Newest':
        // Keep original order (assuming newest are first in FEATURED_COURSES)
        break;
      default:
        sortedCourses.sort((a, b) => b.reviews - a.reviews); // Default to Most Popular
        break;
    }

    return sortedCourses;
  }, [activeCategory, search, selectedTags, selectedProviders, level, duration, minRating, sortBy]);

  return (
    <div className="flex-1 py-4 px-4 md:pr-4 md:pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Header */}
      <div className="card-static p-6 rounded-4xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-section text-text">Explore Courses</h1>
            <p className="text-muted text-sm mt-1">7,200+ courses from world-class instructors</p>
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border text-sm font-semibold text-text hover:bg-bg transition-colors"
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses, skills, or topics..."
            className="w-full bg-bg border border-border rounded-2xl pl-11 pr-5 py-3.5 text-sm outline-none transition-all duration-200 focus:border-text/30 focus:bg-white focus:shadow-float"
          />
        </div>

        {/* Filters */}
        {filtersOpen && (
          <div className="space-y-4 mb-5 p-5 rounded-3xl" style={{ background: '#F6F6F8' }}>
            {/* Dropdowns Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <p className="text-xs font-semibold text-muted mb-2">Difficulty Level</p>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm outline-none hover:border-text/30 transition-colors cursor-pointer"
                >
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted mb-2">Duration</p>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm outline-none hover:border-text/30 transition-colors cursor-pointer"
                >
                  <option>Any Duration</option>
                  <option>{'< 4 weeks (Quick)'}</option>
                  <option>4-8 weeks (Short)</option>
                  <option>8-12 weeks (Medium)</option>
                  <option>{'> 12 weeks (Long)'}</option>
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted mb-2">Minimum Rating</p>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm outline-none hover:border-text/30 transition-colors cursor-pointer"
                >
                  <option>All Ratings</option>
                  <option>⭐ 3.5+ (Average)</option>
                  <option>⭐ 4.0+ (Above Average)</option>
                  <option>⭐⭐ 4.5+ (Good)</option>
                  <option>⭐⭐ 4.7+ (Very Good)</option>
                  <option>⭐⭐⭐ 4.9+ (Excellent)</option>
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted mb-2">Sort By</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl px-3 py-2.5 text-sm outline-none hover:border-text/30 transition-colors cursor-pointer"
                >
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                  <option>Shortest Duration</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {/* Provider Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted">Provider</p>
                {selectedProviders.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#E0F5FF', color: '#0099CC' }}>
                    {selectedProviders.length} selected
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto no-scrollbar">
                {allProviders.map((provider) => {
                  const isSelected = selectedProviders.includes(provider);
                  return (
                    <button
                      key={provider}
                      onClick={() => toggleProvider(provider)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                      style={{
                        background: isSelected ? '#0099CC' : '#fff',
                        color: isSelected ? 'white' : '#6B6B7B',
                        border: isSelected ? '2px solid #0099CC' : '2px solid #E5E5E5',
                        boxShadow: isSelected ? '0 2px 8px rgba(0,153,204,0.3)' : 'none',
                      }}
                    >
                      {provider}
                      {isSelected && <span className="ml-1">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setActiveCategory(c.name)}
              className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex-shrink-0"
              style={{
                background: activeCategory === c.name ? c.color : '#F0F0F5',
                color: activeCategory === c.name ? (c.color === '#D7FF54' || c.color === '#7DEBA3' ? '#111' : c.color === '#111' ? '#fff' : '#111') : '#6B6B7B',
              }}
            >
              {c.name}
              <span className="ml-1.5 text-xs opacity-60">({c.count.toLocaleString()})</span>
            </button>
          ))}
        </div>

        {/* Tag Filter Section */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text">Filter by Tags</h3>
              {selectedTags.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10" style={{ color: '#A98BFF' }}>
                  {selectedTags.length} selected
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-muted hover:text-text transition-colors flex items-center gap-1"
              >
                <span>Clear All Filters</span>
                <span className="text-lg leading-none">×</span>
              </button>
            )}
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: isSelected ? '#A98BFF' : '#F0F0F5',
                    color: isSelected ? 'white' : '#6B6B7B',
                    border: isSelected ? '2px solid #A98BFF' : '2px solid transparent',
                    boxShadow: isSelected ? '0 2px 8px rgba(169,139,255,0.3)' : 'none',
                  }}
                >
                  {tag}
                  {isSelected && <span className="ml-1">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="mt-3 p-3 rounded-2xl" style={{ background: '#F6F6F8' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted">Active Filters:</p>
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold hover:scale-105 transition-transform px-3 py-1 rounded-full"
                  style={{ background: '#FF6D70', color: 'white' }}
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {search && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-border">
                    <span className="text-muted">Search:</span>
                    <span className="text-text">"{search}"</span>
                    <button
                      onClick={() => setSearch('')}
                      className="ml-1 text-muted hover:text-text transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}
                {activeCategory !== 'All' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-border">
                    <span className="text-muted">Category:</span>
                    <span className="text-text">{activeCategory}</span>
                    <button
                      onClick={() => setActiveCategory('All')}
                      className="ml-1 text-muted hover:text-text transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}
                {level !== 'All Levels' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-border">
                    <span className="text-muted">Level:</span>
                    <span className="text-text">{level}</span>
                    <button
                      onClick={() => setLevel('All Levels')}
                      className="ml-1 text-muted hover:text-text transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}
                {duration !== 'Any Duration' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-border">
                    <span className="text-muted">Duration:</span>
                    <span className="text-text">{duration}</span>
                    <button
                      onClick={() => setDuration('Any Duration')}
                      className="ml-1 text-muted hover:text-text transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}
                {minRating !== 'All Ratings' && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-border">
                    <span className="text-muted">Rating:</span>
                    <span className="text-text">{minRating}</span>
                    <button
                      onClick={() => setMinRating('All Ratings')}
                      className="ml-1 text-muted hover:text-text transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}
                {selectedProviders.map(provider => (
                  <div
                    key={provider}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ background: '#0099CC' }}
                  >
                    <span>{provider}</span>
                    <button
                      onClick={() => toggleProvider(provider)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {selectedTags.map(tag => (
                  <div
                    key={tag}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ background: '#A98BFF' }}
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => toggleTag(tag)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trending Skills */}
      <div className="card-static p-6 rounded-4xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: '#FFF0F0' }}>
              <TrendingUp size={15} color="#FF6D70" />
            </div>
            <h2 className="text-card-title text-text">Trending Skills</h2>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {TRENDING.map((t) => (
            <div
              key={t.skill}
              className="flex-shrink-0 px-5 py-3 rounded-3xl cursor-pointer hover:scale-105 transition-transform duration-200"
              style={{ background: t.color }}
            >
              <p className="text-sm font-bold" style={{ color: t.textColor }}>{t.skill}</p>
              <p className="text-xs mt-0.5" style={{ color: t.textColor, opacity: 0.7 }}>{t.growth} this month</p>
            </div>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-card-title text-text">
              {search ? `Results for "${search}"` : activeCategory === 'All' ? 'All Courses' : activeCategory}
            </h2>
            {(selectedTags.length > 0 || selectedProviders.length > 0) && (
              <p className="text-xs text-muted mt-1">
                {selectedTags.length > 0 && `Tags: ${selectedTags.join(', ')}`}
                {selectedTags.length > 0 && selectedProviders.length > 0 && ' • '}
                {selectedProviders.length > 0 && `Providers: ${selectedProviders.join(', ')}`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted bg-white px-3 py-2 rounded-xl border border-border">
              <Filter size={12} />
              <span className="font-bold" style={{ color: filteredCourses.length === 0 ? '#FF6D70' : '#059669' }}>
                {filteredCourses.length}
              </span>
              <span>/ {FEATURED_COURSES.length}</span>
            </div>
            {sortBy !== 'Most Popular' && (
              <div className="text-xs font-semibold text-muted bg-white px-3 py-2 rounded-xl border border-border">
                Sorted by: <span className="text-text">{sortBy}</span>
              </div>
            )}
          </div>
        </div>
        
        {filteredCourses.length === 0 ? (
          <div className="card-static p-12 rounded-4xl text-center">
            <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#FFF0F0' }}>
              <Search size={28} color="#FF6D70" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">No courses found</h3>
            <p className="text-sm text-muted mb-5 max-w-md mx-auto">
              {(() => {
                const activeFiltersCount = 
                  (search ? 1 : 0) + 
                  (activeCategory !== 'All' ? 1 : 0) + 
                  selectedTags.length + 
                  selectedProviders.length +
                  (level !== 'All Levels' ? 1 : 0) +
                  (duration !== 'Any Duration' ? 1 : 0) +
                  (minRating !== 'All Ratings' ? 1 : 0);
                
                if (activeFiltersCount === 0) {
                  return "No courses available. Try adjusting your filters.";
                }
                return `No courses match your ${activeFiltersCount} active filter${activeFiltersCount > 1 ? 's' : ''}. Try removing some filters to see more results.`;
              })()}
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: '#D7FF54', color: '#111' }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" key={`grid-${sortBy}`}>
              {filteredCourses.map((c, index) => (
                <CourseCard 
                  key={`${c.id}-${sortBy}-${index}`} 
                  course={c} 
                  onClick={() => onCourseClick(c.id)}
                  isOfflineAvailable={offlineCourses.has(c.title.toLowerCase().replace(/\s+/g, '-'))}
                />
              ))}
            </div>
            <button className="w-full mt-5 py-4 rounded-3xl border-2 border-dashed border-border text-sm font-semibold text-muted hover:border-text/30 hover:text-text transition-all duration-200">
              Load More Courses
            </button>
          </>
        )}
      </div>

      <div className="h-4" />
    </div>
  );
}





