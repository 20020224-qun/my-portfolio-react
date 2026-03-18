import React, { useState, useEffect, useCallback } from 'react';

// --- 作品集數據 ---
const projects = [
  { id: 'w1', category: 'web', src: '/images/portfolio/web-1.jpg', type: 'image' },
  { id: 'w2', category: 'web', src: '/images/portfolio/web-2.jpg', type: 'image' },
  { id: 'j1', category: 'jewelry', src: '/images/portfolio/jew-1.jpg', type: 'image' },
  { id: 'j2', category: 'jewelry', src: '/images/portfolio/jew-2.jpg', type: 'image' },
  { id: 'j3', category: 'jewelry', src: '/images/portfolio/jew-3.jpg', type: 'image' },
  { id: 'j4', category: 'jewelry', src: '/images/portfolio/jew-4.jpg', type: 'image' },
  { id: 'p1', category: 'product', src: '/images/portfolio/pro-1.jpg', type: 'image' },
  { id: 'p2', category: 'product', src: '/images/portfolio/pro-2.jpg', type: 'image' },
  { id: 'p3', category: 'product', src: '/images/portfolio/pro-3.jpg', type: 'image' },
  { id: 'p4', category: 'product', src: '/images/portfolio/pro-4.jpg', type: 'image' },
  { id: 'p5', category: 'product', src: '/images/portfolio/pro-5.jpg', type: 'image' },
  { id: 'p6', category: 'product', src: '/images/portfolio/pro-6.jpg', type: 'image' },
  { id: 'd1', category: '3d', src: '/images/portfolio/3d-1.jpg', type: 'image' },
  { id: 'd2', category: '3d', src: '/images/portfolio/3d-2.jpg', type: 'image' },
  { id: 'd3', category: '3d', src: '/images/portfolio/3d-3.jpg', type: 'image' },
  { id: 'd4', category: '3d', src: '/images/portfolio/3d-4.jpg', type: 'image' },
  { id: 'd5', category: '3d', src: '/images/portfolio/3d-5.JPG', type: 'image' },
  { id: 'd6', category: '3d', src: '/images/portfolio/3d-6.JPG', type: 'image' },
  { id: 'd7', category: '3d', src: '/images/portfolio/3d-7.JPG', type: 'image' },
  { id: 'd8', category: '3d', src: '/images/portfolio/3d-8.mp4', type: 'video' },
];

// --- 燈箱組件 ---
function Lightbox({ project, onClose, onPrev, onNext, hasMore }) {
  if (!project) return null;
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        {hasMore && (
          <>
            <button className="nav-btn prev-btn" onClick={onPrev}>&#10094;</button>
            <button className="nav-btn next-btn" onClick={onNext}>&#10095;</button>
          </>
        )}
        <div className="media-container">
          {project.type === 'video' ? (
            <video key={project.src} src={project.src} controls autoPlay loop muted playsInline className="lightbox-media" />
          ) : (
            <img src={project.src} alt="Detail" className="lightbox-media" />
          )}
        </div>
      </div>
    </div>
  );
}

// --- 簡歷卡片 ---
function ResumeCard({ frontImg, children, isFlipped, onFlip }) {
  return (
    <div className={`card ${isFlipped ? 'active-card' : ''}`} onClick={onFlip}>
      <div className="card-inner">
        <div className="card-front"><img src={frontImg} alt="Front" /></div>
        <div className="card-back">{children}</div>
      </div>
    </div>
  );
}

// --- 技能卡片 (9-1) ---
function SkillCard({ isFlipped, onFlip }) {
  return (
    <div className={`card ${isFlipped ? 'active-card' : ''}`} onClick={onFlip}>
      <div className="card-inner">
        <div className="card-front"><img src="/images/9-1.png" alt="Skills" /></div>
        <div className="card-back">
          <div className="skills-content">
            <h3>技能專長</h3>
            <div className="skills-grid-container">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                <div key={num} className="grid-item">
                  <img src={`/images/app_logo/${num}.png`} alt={`skill-${num}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [filter, setFilter] = useState('all');
  const [activeResumeIndex, setActiveResumeIndex] = useState(null); 
  const [selectedProject, setSelectedProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredProjects = projects.filter(p => filter === 'all' || p.category === filter);

  useEffect(() => {
    document.title = "Quilla_Huang";
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = '/images/Q.png';
  }, []);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('daisy20020224@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navigateProject = useCallback((direction) => {
    if (!selectedProject) return;
    const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject.id);
    let nextIndex = (currentIndex + direction + filteredProjects.length) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIndex]);
  }, [selectedProject, filteredProjects]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedProject) return;
      if (e.key === 'ArrowLeft') navigateProject(-1);
      if (e.key === 'ArrowRight') navigateProject(1);
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [selectedProject, navigateProject]);

  return (
    <div className="portfolio-app">
      <nav className="navbar">
        <div className="logo">
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}>
            <img src="/images/logo.png" alt="Logo" />
          </a>
        </div>

        <div className={`hamburger-container ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="hamburger-box">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <li><a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a></li>
          <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
          <li><a href="#resume" onClick={() => setIsMenuOpen(false)}>Resume</a></li>
          <li><a href="#portfolio" onClick={() => setIsMenuOpen(false)}>Portfolio</a></li>
          <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
        </ul>
      </nav>

      {/* 1. Home Section */}
      <section id="home" className="section">
        <div className="home-container scroll-reveal">
          <img src="/images/1.png" alt="Left" className="img-left" />
          <img src="/images/1-1.png" alt="Right" className="img-right" />
        </div>
      </section>

      {/* 2. About Section */}
      <section id="about" className="section">
        <div className="about-container scroll-reveal">
          <img src="/images/2-2.png" alt="About Left" className="about-img-left" />
          <img src="/images/2.png" alt="About Right" className="about-img-right" />
        </div>
      </section>

      {/* 3. Resume Section */}
      <section id="resume" className="section">
        <div className="resume-container scroll-reveal">
          <ResumeCard 
            frontImg="/images/7-1.png" 
            isFlipped={activeResumeIndex === 0} 
            onFlip={() => setActiveResumeIndex(activeResumeIndex === 0 ? null : 0)}
          >
            <div className="core-values">
              <h3>專業核心</h3>
              <div className="value-group">
                <p className="value-label">虛實整合能力</p>
                <p className="value-desc">精準掌握 3D 建模與列印流程，確保設計完美落地。</p>
              </div>
              <div className="value-group">
                <p className="value-label">跨團隊溝通橋樑</p>
                <p className="value-desc">銜接設計概念與生產端技術，優化產品開發進度。</p>
              </div>
              <div className="value-group">
                <p className="value-label">使用者體驗思維</p>
                <p className="value-desc">從珠寶工藝到網頁開發，始終專注於直覺互動。</p>
              </div>
            </div>
          </ResumeCard>

          <ResumeCard 
            frontImg="/images/8-1.png" 
            isFlipped={activeResumeIndex === 1} 
            onFlip={() => setActiveResumeIndex(activeResumeIndex === 1 ? null : 1)}
          >
            <div className="experience-content">
              <h3>核心經驗</h3>
              <div className="experience-image-container">
                <img src="/images/8-2.png" className="full-res-img" alt="Experience" />
              </div>
            </div>
          </ResumeCard>

          <SkillCard 
            isFlipped={activeResumeIndex === 2} 
            onFlip={() => setActiveResumeIndex(activeResumeIndex === 2 ? null : 2)} 
          />
        </div>
      </section>

      {/* 4. Portfolio Section */}
      <section id="portfolio" className="section">
        <div className="portfolio-header">
          <h2 className="section-title">PORTFOLIO</h2>
          <div className="filter-buttons">
            {['all', 'web', 'jewelry', 'product', '3d'].map(cat => (
              <button 
                key={cat} 
                className={`filter-btn ${filter === cat ? 'active' : ''}`} 
                onClick={() => setFilter(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="portfolio-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="portfolio-item" onClick={() => setSelectedProject(project)}>
              <div className="item-overlay"><span>VIEW</span></div>
              {project.type === 'video' ? (
                 <video src={project.src} muted loop playsInline onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
              ) : (
                 <img src={project.src} alt={project.category} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Contact Section */}
      <section id="contact" className="section">
        <div className="contact-container scroll-reveal">
          <div className="contact-visual">
            <h2 className="contact-title">LET'S WORK<br />TOGETHER.</h2>
            <p className="contact-statement">
              專注於虛實整合與使用者經驗設計，<br />
              透過美感與邏輯解決複雜的問題。
            </p>
          </div>
          
          <div className="contact-info">
            <div className="info-item">
              <span className="info-label">EMAIL</span>
              <div className="email-row">
                <a href="mailto:daisy20020224@gmail.com" className="info-link" onClick={handleCopyEmail}>
                  daisy20020224@gmail.com
                </a>
                <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopyEmail}>
                  {copied ? 'COPIED!' : 'COPY'}
                </button>
              </div>
            </div>
            
            <div className="info-item">
              <span className="info-label">PHONE</span>
              <p className="info-text">0966-530-502</p>
            </div>
            
            <div className="info-item">
              <span className="info-label">RESUME</span>
              <a 
                href="/images/resume.pdf" 
                download="黃亮裙_履歷.pdf"
                className="info-link download-link"
              >
                下載履歷 / PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      <Lightbox 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        onPrev={() => navigateProject(-1)}
        onNext={() => navigateProject(1)}
        hasMore={filteredProjects.length > 1}
      />
    </div>
  );
}

export default App;