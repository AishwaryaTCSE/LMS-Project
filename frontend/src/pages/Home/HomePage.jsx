// src/pages/Home/HomePage.jsx
import styles from './HomePage.module.css';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, 
  FiBookOpen, 
  FiAward, 
  FiArrowRight, 
  FiCheck, 
  FiPlay, 
  FiStar,
  FiClock,
  FiUserCheck,
  FiBookmark,
  FiMessageSquare,
  FiLayers,
  FiCode,
  FiDatabase,
  FiSmartphone,
  FiTrendingUp,
  FiDollarSign,
  FiGlobe,
  FiHeadphones,
  FiMail,
  FiMapPin,
  FiPhone,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { FaChalkboardTeacher, FaLaptopCode, FaMobileAlt, FaChartLine } from 'react-icons/fa';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [stats, setStats] = useState([
    { value: '50K+', label: 'Students Enrolled', icon: <FiUsers /> },
    { value: '500+', label: 'Expert Instructors', icon: <FaChalkboardTeacher /> },
    { value: '200+', label: 'Online Courses', icon: <FiBookOpen /> },
    { value: '95%', label: 'Success Rate', icon: <FiAward /> }
  ]);

  // Hero carousel slides
  const heroSlides = [
    {
      title: "Learn New Skills Online",
      subtitle: "Find the perfect instructor for you",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
    },
    {
      title: "Advance Your Career",
      subtitle: "Gain in-demand skills for the future",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
    },
    {
      title: "Learn at Your Own Pace",
      subtitle: "Lifetime access to all courses",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
    }
  ];

  // Features
  const features = [
    { 
      icon: <FiBookOpen size={40} />, 
      title: "Interactive Courses", 
      description: "Engaging content designed by industry experts with hands-on projects and real-world applications.",
      color: "text-blue-600"
    },
    { 
      icon: <FiUsers size={40} />, 
      title: "Expert Instructors", 
      description: "Learn from professionals with years of real-world experience in their respective fields.",
      color: "text-green-600"
    },
    { 
      icon: <FiAward size={40} />, 
      title: "Certification", 
      description: "Earn industry-recognized certificates to showcase your skills to employers.",
      color: "text-purple-600"
    },
    { 
      icon: <FiClock size={40} />, 
      title: "Lifetime Access", 
      description: "Get unlimited access to all course materials and future updates.",
      color: "text-red-600"
    },
    { 
      icon: <FiUserCheck size={40} />, 
      title: "1-on-1 Support", 
      description: "Get personalized help and guidance from instructors and teaching assistants.",
      color: "text-yellow-600"
    },
    { 
      icon: <FiBookmark size={40} />, 
      title: "Bookmark Content", 
      description: "Save important lessons and come back to them anytime for quick revision.",
      color: "text-pink-600"
    }
  ];

  // Popular Courses
  const courses = [
    {
      id: 1,
      title: "Web Development Bootcamp",
      instructor: "John Doe",
      rating: 4.8,
      students: 12500,
      price: 199.99,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "development"
    },
    {
      id: 2,
      title: "Mobile App Development",
      instructor: "Jane Smith",
      rating: 4.7,
      students: 9800,
      price: 179.99,
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "mobile"
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      instructor: "Alex Johnson",
      rating: 4.9,
      students: 15600,
      price: 249.99,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "data"
    },
    {
      id: 4,
      title: "UI/UX Design Masterclass",
      instructor: "Sarah Williams",
      rating: 4.6,
      students: 8700,
      price: 159.99,
      image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "design"
    },
    {
      id: 5,
      title: "Digital Marketing Pro",
      instructor: "Mike Johnson",
      rating: 4.5,
      students: 11200,
      price: 139.99,
      image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "marketing"
    },
    {
      id: 6,
      title: "Python for Beginners",
      instructor: "David Wilson",
      rating: 4.8,
      students: 18900,
      price: 99.99,
      image: "https://images.unsplash.com/photo-1542831371-29b3fdea09a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "programming"
    }
  ];

  // Categories
  const categories = [
    { name: 'All', value: 'all', icon: <FiLayers /> },
    { name: 'Development', value: 'development', icon: <FiCode /> },
    { name: 'Business', value: 'business', icon: <FiTrendingUp /> },
    { name: 'Design', value: 'design', icon: <FaChalkboardTeacher /> },
    { name: 'Marketing', value: 'marketing', icon: <FiDollarSign /> },
    { name: 'Data Science', value: 'data', icon: <FiDatabase /> },
    { name: 'Mobile', value: 'mobile', icon: <FiSmartphone /> },
    { name: 'Programming', value: 'programming', icon: <FaLaptopCode /> }
  ];

  // Testimonials
  const testimonials = [
    { 
      id: 1,
      quote: "This platform transformed my career! The courses are well-structured and the instructors are top-notch. I landed a job as a web developer within 3 months of completing the bootcamp.", 
      author: "Alex Johnson", 
      role: "Senior Web Developer at TechCorp",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5
    },
    { 
      id: 2, 
      quote: "Best learning experience I've had online. The community is amazing and the support team is always there to help. The projects helped me build a strong portfolio.", 
      author: "Sarah Williams", 
      role: "UI/UX Designer at DesignHub",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    { 
      id: 3, 
      quote: "As a complete beginner, I was nervous about learning to code. But the step-by-step approach made it so easy to follow along. Highly recommended for anyone starting out!", 
      author: "Michael Chen", 
      role: "Junior Developer",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 5
    },
    { 
      id: 4, 
      quote: "The quality of content exceeded my expectations. The instructors break down complex topics into digestible chunks. The platform is worth every penny!", 
      author: "Emma Davis", 
      role: "Product Manager",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      rating: 4
    }
  ];

  // Instructors
  const instructors = [
    {
      id: 1,
      name: "John Smith",
      role: "Senior Web Developer",
      students: 25000,
      courses: 45,
      rating: 4.9,
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        website: "#"
      }
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "UI/UX Designer",
      students: 18000,
      courses: 32,
      rating: 4.8,
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        website: "#"
      }
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Data Scientist",
      students: 32000,
      courses: 28,
      rating: 4.9,
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        website: "#"
      }
    },
    {
      id: 4,
      name: "Emily Wilson",
      role: "Marketing Expert",
      students: 21000,
      courses: 18,
      rating: 4.7,
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        website: "#"
      }
    }
  ];

  // Blog posts
  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for Learning to Code Faster",
      excerpt: "Discover proven strategies to accelerate your coding journey and become a more efficient programmer.",
      date: "May 15, 2023",
      category: "Programming",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "The Future of Web Development in 2023",
      excerpt: "Explore the latest trends and technologies that are shaping the future of web development this year.",
      date: "June 2, 2023",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      readTime: "10 min read"
    },
    {
      id: 3,
      title: "How to Build a Personal Brand as a Developer",
      excerpt: "Learn how to stand out in the competitive tech industry by building a strong personal brand.",
      date: "June 10, 2023",
      category: "Career",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      readTime: "12 min read"
    }
  ];

  // FAQ items
  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "To enroll in a course, simply browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. You'll be guided through the payment process, and once completed, you'll gain immediate access to the course content."
    },
    {
      question: "Can I access courses on mobile devices?",
      answer: "Yes, our platform is fully responsive and works on all devices including smartphones and tablets. You can learn on the go using our mobile app or mobile web browser."
    },
    {
      question: "Do you offer certificates upon completion?",
      answer: "Yes, we provide certificates of completion for all our courses. These certificates can be shared on LinkedIn and other professional networks to showcase your new skills."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards, PayPal, and bank transfers. We also offer installment payment options for selected courses."
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your course within the first 30 days, you can request a full refund, no questions asked."
    }
  ];

  // Partners/Logos
  const partners = [
    { name: "TechCorp", logo: "https://via.placeholder.com/150x60?text=TechCorp" },
    { name: "DesignHub", logo: "https://via.placeholder.com/150x60?text=DesignHub" },
    { name: "CodeMasters", logo: "https://via.placeholder.com/150x60?text=CodeMasters" },
    { name: "WebWizards", logo: "https://via.placeholder.com/150x60?text=WebWizards" },
    { name: "DataLabs", logo: "https://via.placeholder.com/150x60?text=DataLabs" },
    { name: "AppCraft", logo: "https://via.placeholder.com/150x60?text=AppCraft" }
  ];

  // Carousel auto-advance effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Filter courses by category
  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeTab);

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}! You'll receive our newsletter soon.`);
    setEmail('');
  };

  return (
    <div className={styles.homePage}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link to="/" className={styles.navLogo}>
            EduLearn
          </Link>
          <div className={styles.navLinks}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/courses" className={styles.navLink}>Courses</Link>
            <Link to="/about" className={styles.navLink}>About</Link>
            <Link to="/contact" className={styles.navLink}>Contact</Link>
          </div>
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.loginButton}>Log in</Link>
            <Link to="/register" className={styles.signupButton}>Sign up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Learn Without Limits
            </h1>
            <p className={styles.heroSubtitle}>
              Start, switch, or advance your career with more than 5,000 courses, Professional Certificates, 
              and degrees from world-class universities and companies.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/register" className={styles.heroButtonPrimary}>
                Join for Free
              </Link>
              <Link to="/courses" className={styles.heroButtonSecondary}>
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {[
              { count: '50K+', label: 'Students Enrolled', icon: <FiUsers /> },
              { count: '500+', label: 'Expert Instructors', icon: <FaChalkboardTeacher /> },
              { count: '200+', label: 'Online Courses', icon: <FiBookOpen /> },
              { count: '95%', label: 'Success Rate', icon: <FiAward /> }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className={styles.statCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className={styles.statIcon}>
                  {stat.icon}
                </div>
                <h3 className={styles.statValue}>{stat.count}</h3>
                <p className={styles.statLabel}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className={styles.popularCoursesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Popular Courses</h2>
            <p className={styles.sectionSubtitle}>Discover our most popular courses and start your learning journey today</p>
          </div>
          
          <div className={styles.coursesHeader}>
            <div className={styles.categoryTabs}>
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveTab(category.value)}
                  className={`${styles.categoryTab} ${activeTab === category.value ? styles.categoryTabActive : ''}`}
                >
                  {category.icon && <span className="mr-2">{category.icon}</span>}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.popularCoursesGrid}>
            {filteredCourses.map((course, index) => (
              <motion.div 
                key={course.id}
                className={styles.courseCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className={styles.courseImage}
                />
                <div className={styles.courseContent}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <p className={styles.courseInstructor}>By {course.instructor}</p>
                  <div className={styles.courseRating}>
                    <FiStar className="text-yellow-400 fill-current" />
                    <span>{course.rating}</span>
                    <span className="text-gray-400">•</span>
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className={styles.courseFooter}>
                    <span className={styles.coursePrice}>${course.price}</span>
                    <Link 
                      to={`/courses/${course.id}`} 
                      className={styles.courseLink}
                    >
                      View Details <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                className={styles.testimonialCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className={styles.testimonialAvatar}
                />
                <p className={styles.testimonialQuote}>{testimonial.quote}</p>
                <h3 className={styles.testimonialAuthor}>{testimonial.author}</h3>
                <p className={styles.testimonialRole}>{testimonial.role}</p>
                <div className={styles.testimonialRating}>
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} w-4 h-4`} 
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className={styles.instructorsSection}>
        <div className={styles.container}>
          <div className={styles.instructorsGrid}>
            {instructors.map((instructor, index) => (
              <motion.div 
                key={instructor.id}
                className={styles.instructorCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <img 
                  src={instructor.image} 
                  alt={instructor.name} 
                  className={styles.instructorAvatar}
                />
                <div className={styles.instructorContent}>
                  <h3 className={styles.instructorName}>{instructor.name}</h3>
                  <p className={styles.instructorRole}>{instructor.role}</p>
                  <div className={styles.instructorSocial}>
                    <a href={instructor.social.twitter} className={styles.instructorSocialLink}>
                      <FiTwitter size={20} />
                    </a>
                    <a href={instructor.social.linkedin} className={styles.instructorSocialLink}>
                      <FiLinkedin size={20} />
                    </a>
                    <a href={instructor.social.website} className={styles.instructorSocialLink}>
                      <FiGlobe size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Start Learning Today</h2>
            <p className={styles.ctaDescription}>Join over 50,000 students who have already chosen us for their learning journey</p>
            <div className={styles.ctaButtons}>
              <Link 
                to="/courses" 
                className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}
              >
                Browse Courses
              </Link>
              <Link 
                to="/pricing" 
                className={`${styles.ctaButton} ${styles.ctaButtonSecondary}`}
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className={styles.blogSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest From Our Blog</h2>
            <p className={styles.sectionSubtitle}>Stay updated with the latest trends and insights</p>
            <Link to="/blog" className={styles.viewAllLink}>
              View All Articles <FiArrowRight className="ml-2" />
            </Link>
          </div>
          
          <div className={styles.blogGrid}>
            {blogPosts.map((post, index) => (
              <motion.article 
                key={post.id}
                className={styles.blogCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className={styles.blogImage}
                />
                <div className={styles.blogContent}>
                  <div className={styles.blogMeta}>
                    <span>{post.date}</span>
                    <span className={styles.metaDivider}>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className={styles.blogTitle}>{post.title}</h3>
                  <p className={styles.blogExcerpt}>{post.excerpt}</p>
                  <Link 
                    to={`/blog/${post.id}`} 
                    className={styles.readMoreLink}
                  >
                    Read More <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>Find answers to common questions about our platform</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <motion.div 
                  key={index}
                  className={styles.faqItem}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <button 
                    className={styles.faqQuestion}
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <FiChevronRight 
                      className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ''}`}
                    />
                  </button>
                  <div 
                    className={styles.faqAnswer}
                    style={{ maxHeight: isOpen ? '500px' : '0' }}
                  >
                    {faq.answer}
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">Still have questions?</p>
            <Link 
              to="/contact" 
              className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}
            >
              Contact Us <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className={styles.container}>
          <div className={styles.newsletterContainer}>
            <h2 className={styles.newsletterTitle}>Subscribe to Our Newsletter</h2>
            <p className={styles.newsletterSubtitle}>Get the latest updates, news and product offers</p>
            
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={styles.newsletterInput}
                required
              />
              <button 
                type="submit" 
                className={styles.newsletterButton}
              >
                Subscribe
              </button>
            </form>
            
            <p className={styles.newsletterPrivacy}>We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      {/* Partners/Logos */}
      <section className={styles.partnersSection}>
        <div className={styles.container}>
          <p className={styles.partnersTitle}>Trusted by leading companies</p>
          <div className={styles.partnersGrid}>
            {partners.map((partner, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className={styles.partnerLogo}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
