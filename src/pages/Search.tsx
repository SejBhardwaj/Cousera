import { useState, useMemo } from 'react';
import { Search as SearchIcon, Sparkles, X, Tag, Filter } from 'lucide-react';
import CourseCard, { Course } from '../components/CourseCard';
import { useOffline } from '../contexts/OfflineContext';

const SUGGESTIONS = [
  'Machine Learning with Python',
  'Machine Learning Specialization',
  'Machine Learning for Beginners',
  'ML in Production',
];

const FILTERS = {
  level: ['All Levels', 'Beginner', 'Intermediate', 'Advanced'],
  duration: ['Any Duration', '< 1 month', '1â€“3 months', '3â€“6 months'],
  type: ['All', 'Course', 'Specialization', 'Certificate', 'Degree'],
  language: ['English', 'Spanish', 'French', 'Chinese'],
};

const AVAILABLE_TAGS = [
  { label: 'Programming', color: '#A98BFF' },
  { label: 'Design', color: '#FF6D70' },
  { label: 'Marketing', color: '#FFB259' },
  { label: 'AI', color: '#D7FF54' },
  { label: 'Data Science', color: '#83D6FF' },
  { label: 'Business', color: '#FFB3C6' },
  { label: 'Cloud Computing', color: '#7DEBA3' },
  { label: 'Python', color: '#A98BFF' },
  { label: 'Web Development', color: '#83D6FF' },
  { label: 'Mobile Dev', color: '#FFB259' },
];

const RESULTS: Course[] = [
  {
    id: 's1',
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
  // TECHNOLOGY - Additional if needed (currently at 16, which is good)
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

export default function SearchPage({ onCourseClick, initialQuery = '' }: { onCourseClick: (id: string) => void; initialQuery?: string }) {
  const { offlineCourses } = useOffline();
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({ level: 'All Levels', duration: 'Any Duration', type: 'All' });
  const [aiMode, setAiMode] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    // Clear search query when selecting a tag to avoid AND filtering confusion
    if (query.trim()) {
      setQuery('');
    }
    
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setQuery('');
    setSelectedTags([]);
    setActiveFilters({ level: 'All Levels', duration: 'Any Duration', type: 'All' });
  };

  // Real-time filtering with useMemo for performance
  const filteredCourses = useMemo(() => {
    return RESULTS.filter(course => {
      // Search filter (title + description + tags + instructor + provider)
      const searchLower = query.toLowerCase().trim();
      const matchesSearch = !searchLower || 
        course.title.toLowerCase().includes(searchLower) ||
        (course.description?.toLowerCase().includes(searchLower) ?? false) ||
        (course.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ?? false) ||
        course.instructor.toLowerCase().includes(searchLower) ||
        course.provider.toLowerCase().includes(searchLower);
      
      // Tag filter (OR logic - matches if ANY selected tag is in course tags)
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => course.tags?.includes(tag));
      
      // Standard filters
      const matchesLevel = activeFilters.level === 'All Levels' || course.difficulty === activeFilters.level;
      
      // Combine all filters (AND logic)
      return matchesSearch && matchesTags && matchesLevel;
    });
  }, [query, selectedTags, activeFilters]);

  // Check if any filters are active
  const hasActiveFilters = query.trim() !== '' || selectedTags.length > 0 || activeFilters.level !== 'All Levels';

  return (
    <div className="flex-1 py-4 pr-4 pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Search Input */}
      <div className="card-static p-6 rounded-4xl">
        <div className="relative mb-4">
          <div
            className="flex items-center gap-3 rounded-3xl px-5 py-4 transition-all duration-300"
            style={{
              background: focused ? 'white' : '#F6F6F8',
              border: `2px solid ${focused ? '#111' : '#EBEBF0'}`,
              boxShadow: focused ? '0 8px 40px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <SearchIcon size={20} color={focused ? '#0F0F0F' : '#6B6B7B'} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Search anything..."
              className="flex-1 outline-none text-base bg-transparent text-text"
            />
            {query && (
              <button onClick={() => setQuery('')} className="transition-all duration-200 hover:opacity-70">
                <X size={16} color="#6B6B7B" />
              </button>
            )}
            <button
              onClick={() => setAiMode(!aiMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200"
              style={{
                background: aiMode ? '#D7FF54' : '#F0F0F5',
                color: aiMode ? '#111' : '#6B6B7B',
              }}
            >
              <Sparkles size={12} />
              AI Search
            </button>
          </div>

          {/* Suggestions dropdown */}
          {focused && query && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-float-lg z-50 p-3 animate-in">
              {SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.toLowerCase())).map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bg transition-colors text-left"
                >
                  <SearchIcon size={13} color="#6B6B7B" />
                  <span className="text-sm text-text">{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI Suggestion Banner */}
        {aiMode && (
          <div
            className="flex items-start gap-3 p-4 rounded-2xl mb-4"
            style={{ background: '#F5FFDB', border: '1px solid #D7FF54' }}
          >
            <Sparkles size={16} color="#111" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-text mb-1">AI Suggestion</p>
              <p className="text-xs text-muted leading-relaxed">
                Based on your profile and learning history, I recommend starting with the <strong>Machine Learning Specialization by Andrew Ng</strong>. It's perfectly aligned with your goal of becoming an ML Engineer.
              </p>
            </div>
          </div>
        )}

        {/* Tag Filter Pills */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={14} color="#6B6B7B" />
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Filter by Topic</span>
            {selectedTags.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#D7FF54', color: '#111' }}>
                {selectedTags.length}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag.label);
              return (
                <button
                  key={tag.label}
                  onClick={() => toggleTag(tag.label)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: isSelected ? tag.color : '#F0F0F5',
                    color: isSelected 
                      ? (tag.color === '#D7FF54' || tag.color === '#7DEBA3' ? '#111' : '#fff')
                      : '#6B6B7B',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          {Object.entries(FILTERS).slice(0, 3).map(([key, options]) => (
            <select
              key={key}
              value={activeFilters[key] || options[0]}
              onChange={(e) => setActiveFilters({ ...activeFilters, [key]: e.target.value })}
              className="px-4 py-2 rounded-full text-sm font-semibold border border-border bg-white outline-none cursor-pointer hover:border-text/30 transition-colors capitalize"
            >
              {options.map((o) => <option key={o}>{o}</option>)}
            </select>
          ))}
          
          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-muted hover:text-text hover:bg-bg transition-all duration-200"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}

          <div className="flex items-center gap-1 ml-auto text-xs text-muted">
            <Filter size={12} />
            {filteredCourses.length} results
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-card-title text-text">
            {query ? `Results for "${query}"` : 'All Courses'}
          </h2>
          <div className="flex items-center gap-3">
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: '#F0F0F5' }}>
                <Tag size={12} color="#6B6B7B" />
                <span className="text-xs font-semibold text-muted">
                  {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} active
                </span>
              </div>
            )}
            <span className="text-xs text-muted">{filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found</span>
          </div>
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="card-static p-12 rounded-4xl text-center">
            <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#F0F0F5' }}>
              <SearchIcon size={28} color="#6B6B7B" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">No courses found</h3>
            <p className="text-sm text-muted mb-5 max-w-md mx-auto">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: '#D7FF54', color: '#111' }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Course Grid */}
        {filteredCourses.length > 0 && (
          <div className="grid grid-cols-3 gap-4 animate-in">
            {filteredCourses.map((c) => (
              <CourseCard 
                key={c.id} 
                course={c} 
                onClick={() => onCourseClick(c.id)}
                isOfflineAvailable={offlineCourses.has(c.title.toLowerCase().replace(/\s+/g, '-'))}
              />
            ))}
          </div>
        )}
      </div>

      <div className="h-4" />
    </div>
  );
}

