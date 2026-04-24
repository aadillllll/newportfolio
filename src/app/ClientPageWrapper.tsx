"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { submitContact } from './actions';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from 'lenis';
import TiltCard from './TiltCard';

export default function ClientPageWrapper({ portfolioItems }: { portfolioItems: any[] }) {
  const [filter, setFilter] = useState('all');
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { scrollYProgress } = useScroll();
  const yHeroGlow = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yHeroText = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    // Smooth Scroll initialization
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Header Scroll Effect
    const header = document.getElementById("header");
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header?.classList.add("scrolled");
        } else {
            header?.classList.remove("scrolled");
        }
    };
    window.addEventListener("scroll", handleScroll);

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById("mobile-toggle");
    const navLinks = document.getElementById("nav-links");
    const toggleMenu = () => {
        mobileToggle?.classList.toggle("active");
        navLinks?.classList.toggle("active");
    };
    mobileToggle?.addEventListener("click", toggleMenu);

    const closeNavLinks = document.querySelectorAll(".nav-link");
    closeNavLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileToggle?.classList.remove("active");
            navLinks?.classList.remove("active");
        });
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mobileToggle?.removeEventListener("click", toggleMenu);
      lenis.destroy();
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    const res = await submitContact(formData);
    if (res.success) {
      setFormStatus("Message sent successfully!");
      formRef.current.reset();
    } else {
      setFormStatus("Failed to send message.");
    }
  };

  const filteredItems = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  // Animation variants
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <>
      <header id="header">
        <div className="container nav-container">
          <a href="#" className="logo">Adil<span>.</span></a>
          <div className="mobile-toggle" id="mobile-toggle">
            <i className="fas fa-bars"></i>
          </div>
          <nav id="nav-links">
            <ul className="nav-list">
              <li><a href="#home" className="nav-link active">Home</a></li>
              <li><a href="#about" className="nav-link">About</a></li>
              <li><a href="#portfolio" className="nav-link">Portfolio</a></li>
              <li><a href="#services" className="nav-link">Services</a></li>
              <li><a href="#contact" className="nav-link btn-small neon-btn-outline">Hire Me</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <section id="home" className="hero">
        <motion.div className="hero-bg-glow" style={{ y: yHeroGlow }}></motion.div>
        <div className="container hero-container visible">
          <motion.div 
            className="hero-content"
            style={{ y: yHeroText }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            <motion.h2 className="hero-subtitle" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>Video Editor & Graphic Designer</motion.h2>
            <motion.h1 className="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>Crafting Visuals That <span className="neon-text">Demand</span> Attention.</motion.h1>
            <motion.p className="hero-tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>I create high-quality, engaging edits and designs that stop the scroll, increase engagement, and grow your brand.</motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
              <a href="#portfolio" className="btn btn-primary">View My Work <i className="fas fa-arrow-right"></i></a>
              <a href="#contact" className="btn btn-outline">Let's Talk</a>
            </motion.div>
          </motion.div>
        </div>
        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.5, duration: 1 }}
        >
          <p>Scroll to explore</p>
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </motion.div>
      </section>

      <section id="about" className="about section-padding">
        <motion.div className="container visible" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}>
          <div className="section-heading">
            <span className="sub-heading">Who I Am</span>
            <h2>About <span className="accent">Me</span></h2>
          </div>
          <div className="about-grid">
            <div className="about-text">
              <p>Hi, I am Adil Muhammed N. I am a freelance digital creator specializing in video editing and graphic design. I bridge the gap between aesthetics and performance.</p>
              <p>My goal is not just to make things look good—it is to help you stand out. Whether you need cinematic YouTube documentaries, snappy social media reels, or high-conversion thumbnails, I bring a detail-oriented, results-driven approach to every project.</p>
              <motion.div className="skills-wrap" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <h3>Core Expertise:</h3>
                <ul className="skills-list">
                  <li><i className="fas fa-film accent"></i> Video Editing (Reels, YT, Cinematic)</li>
                  <li><i className="fas fa-image accent"></i> Thumbnail Design</li>
                  <li><i className="fas fa-paint-brush accent"></i> Poster & Layout Design</li>
                  <li><i className="fas fa-chart-line accent"></i> Audience Engagement Strategy</li>
                </ul>
              </motion.div>
            </div>
            <div className="about-stats-container">
              <TiltCard className="stat-box">
                <i className="fas fa-bolt neon-text"></i>
                <h4 className="stat-title">High Retention</h4>
                <p>Edits designed to keep viewers watching.</p>
              </TiltCard>
              <TiltCard className="stat-box">
                <i className="fas fa-eye neon-text"></i>
                <h4 className="stat-title">CTR Focused</h4>
                <p>Thumbnails that guarantee clicks.</p>
              </TiltCard>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="services" className="services section-padding dark-bg">
        <motion.div className="container visible" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}>
          <div className="section-heading text-center">
            <span className="sub-heading">What I Do</span>
            <h2>My <span className="accent">Services</span></h2>
          </div>
          <motion.div className="services-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <TiltCard className="service-card">
              <div className="service-icon"><i className="fas fa-video"></i></div>
              <h3>Video Editing</h3>
              <p>Cinematic, fast-paced, or documentary style. I edit YouTube long-form and documentaries with perfect pacing, sound design, and color grading.</p>
            </TiltCard>
            <TiltCard className="service-card">
              <div className="service-icon"><i className="fas fa-mobile-alt"></i></div>
              <h3>Social Media Reels</h3>
              <p>Short-form content optimized for TikTok, Instagram Reels, and YouTube Shorts. Snappy cuts, dynamic captions, and viral pacing.</p>
            </TiltCard>
            <TiltCard className="service-card">
              <div className="service-icon"><i className="fas fa-mouse-pointer"></i></div>
              <h3>Thumbnail Design</h3>
              <p>Thumbnails are the most important part of your video. I design high-contrast, visually engaging thumbnails designed to maximize your CTR.</p>
            </TiltCard>
            <TiltCard className="service-card">
              <div className="service-icon"><i className="fas fa-palette"></i></div>
              <h3>Poster Design</h3>
              <p>Premium poster designs for events, movies, or brand promotions. Bold typography mixed with stunning imagery.</p>
            </TiltCard>
          </motion.div>
        </motion.div>
      </section>

      <section id="portfolio" className="portfolio section-padding">
        <motion.div className="container visible" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}>
          <div className="section-heading text-center">
            <span className="sub-heading">My Best Work</span>
            <h2><span className="accent">Portfolio</span> Showcase</h2>
          </div>
          <div className="portfolio-filters">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`filter-btn ${filter === 'reels' ? 'active' : ''}`} onClick={() => setFilter('reels')}>Reels / Shorts</button>
            <button className={`filter-btn ${filter === 'youtube' ? 'active' : ''}`} onClick={() => setFilter('youtube')}>YouTube</button>
            <button className={`filter-btn ${filter === 'thumbnails' ? 'active' : ''}`} onClick={() => setFilter('thumbnails')}>Thumbnails</button>
            <button className={`filter-btn ${filter === 'posters' ? 'active' : ''}`} onClick={() => setFilter('posters')}>Posters</button>
          </div>
          <motion.div className="portfolio-grid" id="portfolio-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {filteredItems.map((item, i) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                <TiltCard className={`portfolio-item ${item.category}`}>
                  <a href={item.linkUrl !== "#" && item.linkUrl ? item.linkUrl : "#"} target={item.linkUrl !== "#" ? "_blank" : "_self"} rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
                    <div className="portfolio-img">
                      <img src={item.imageUrl} alt={item.title} />
                      <div className="portfolio-overlay">
                        <i className={item.category === 'youtube' || item.category === 'reels' ? "fas fa-play-circle" : "fas fa-search-plus"}></i>
                      </div>
                    </div>
                    <div className="portfolio-info">
                      <h3>{item.title}</h3>
                      <span>{item.categoryLabel}</span>
                    </div>
                  </a>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section id="testimonials" className="testimonials section-padding dark-bg">
        <motion.div className="container visible" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUpVariant}>
          <div className="section-heading text-center">
            <span className="sub-heading">Client Feedback</span>
            <h2>What People <span className="accent">Say</span></h2>
          </div>
          <div className="testimonial-grid">
            <TiltCard className="testimonial-card">
              <i className="fas fa-quote-left quote-icon"></i>
              <p>&quot;Adil&apos;s editing took my channel to the next level. Retention skyrocketed and his pacing is just spot on. Highly recommended!&quot;</p>
              <div className="client-info">
                <div className="client-avatar"><i className="fas fa-user-circle"></i></div>
                <div className="client-details">
                  <h4>Alex J.</h4>
                  <span>Content Creator (500k+ Subs)</span>
                </div>
              </div>
            </TiltCard>
            <TiltCard className="testimonial-card">
              <i className="fas fa-quote-left quote-icon"></i>
              <p>&quot;The thumbnails he designed doubled our usual CTR in just a week. He knows exactly what catches the eye.&quot;</p>
              <div className="client-info">
                <div className="client-avatar"><i className="fas fa-user-circle"></i></div>
                <div className="client-details">
                  <h4>Sarah M.</h4>
                  <span>Marketing Director</span>
                </div>
              </div>
            </TiltCard>
          </div>
        </motion.div>
      </section>

      <section id="contact" className="contact section-padding">
        <motion.div className="container visible" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
          <div className="contact-wrapper">
            <div className="contact-info">
              <div className="section-heading">
                <span className="sub-heading">Get In Touch</span>
                <h2>Let&apos;s Work <span className="accent">Together</span></h2>
              </div>
              <p>Have a project in mind? Looking to elevate your content? Drop me a message and let&apos;s discuss how we can collaborate.</p>
              <div className="contact-methods">
                <a href="mailto:adilmuhammeda8@gmail.com" className="method-item">
                  <div className="method-icon"><i className="fas fa-envelope"></i></div>
                  <div className="method-text">
                    <span>Email Me</span>
                    <h4>adilmuhammeda8@gmail.com</h4>
                  </div>
                </a>
                <a href="https://wa.me/918714820156" target="_blank" className="method-item" rel="noopener noreferrer">
                  <div className="method-icon"><i className="fab fa-whatsapp"></i></div>
                  <div className="method-text">
                    <span>WhatsApp</span>
                    <h4>+91 8714820156</h4>
                  </div>
                </a>
              </div>
            </div>
            <div className="contact-form-container">
              <form className="contact-form" action="https://formsubmit.co/adilmuhammeda8@gmail.com" method="POST">
                <input type="hidden" name="_subject" value="New Portfolio Contact Message!" />
                <input type="hidden" name="_captcha" value="false" />
                <div className="form-group">
                  <input type="text" id="name" name="name" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" id="email" name="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <textarea id="message" name="message" rows={5} placeholder="Tell me about your project" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary full-width">Send Message <i className="fas fa-paper-plane"></i></button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      <footer>
        <div className="container footer-container">
          <div className="footer-brand">
            <a href="#" className="logo">Adil<span>.</span></a>
            <p>Elevating brands through high-quality video editing and striking graphic design.</p>
          </div>
          <div className="footer-social">
            <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a>
            <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Adil Muhammed N. All rights reserved. | <a href="/admin" style={{ color: '#00e5ff', textDecoration: 'none' }}>Admin Studio (Upload Works)</a></p>
        </div>
      </footer>
    </>
  );
}
