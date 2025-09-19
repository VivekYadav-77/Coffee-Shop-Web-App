import React, { useEffect } from 'react'
import { ArrowLeft, Code, Server, Users, Coffee, Github, Linkedin, ChevronDown } from 'lucide-react'
import '../styles/team/team-page.css'

const TeamPage = ({ onBack }) => {
  // Add scroll indicator to document body
  useEffect(() => {
    const scrollIndicator = document.createElement('div')
    scrollIndicator.className = 'scroll-indicator'
    
    // Create scroll content
    const scrollContent = document.createElement('div')
    scrollContent.className = 'scroll-content'
    
    // Create scroll icon
    const scrollIcon = document.createElement('div')
    scrollIcon.className = 'scroll-icon'
    scrollIcon.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    `
    
    // Create scroll text
    const scrollText = document.createElement('p')
    scrollText.className = 'scroll-text'
    scrollText.textContent = 'Scroll down to explore all our talented developers'
    
    // Create scroll arrow
    const scrollArrow = document.createElement('div')
    scrollArrow.className = 'scroll-arrow'
    scrollArrow.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    `
    
    // Assemble the structure
    scrollContent.appendChild(scrollIcon)
    scrollContent.appendChild(scrollText)
    scrollContent.appendChild(scrollArrow)
    scrollIndicator.appendChild(scrollContent)
    
    // Apply inline styles to ensure fixed positioning works
    scrollIndicator.style.cssText = `
      position: fixed !important;
      bottom: 2rem !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      z-index: 10000 !important;
      opacity: 1 !important;
    `
    
    document.body.appendChild(scrollIndicator)
    
    // Cleanup function to remove scroll indicator when component unmounts
    return () => {
      if (document.body.contains(scrollIndicator)) {
        document.body.removeChild(scrollIndicator)
      }
    }
  }, [])

  const teamMembers = {
    frontend: [
      {
        name: "Akshat Tiwari",
        role: "User-Facing Front-end",
        description: "I'm Akshat, a Computer Science student exploring Cloud Computing and Machine Learning. I love building clean, responsive web apps with React, Tailwind, and TypeScript, and I'm always up for turning fresh ideas into something real. Tech for me isn't just theory — it's about creating things that actually work and feel good to use.",
        image: "/Akshat.png",
        github: "https://github.com/AKranger05",
        linkedin: "https://www.linkedin.com/in/contactakshattiwari05"
      },
      {
        name: "Raj Kumar Verma", 
        role: "Admin/Employee Facing Front-end",
        description: "B.Tech Computer Science student exploring Cloud Computing and Machine Learning. Enthusiastic about front-end development and comfortable with Java, Python, and C. I enjoy tackling challenges, learning new tools, and turning ideas into practical solutions.",
        image: "/Raj.png",
        github: "https://github.com/Rajkumar-14",
        linkedin: "https://linkedin.com/in/raj-kumar-210a01299"
      }
    ],
    backend: [
      {
        name: "Shivang Rai",
        role: "Back-end Developer",
        description: "I'm Shivang Rai a B.Tech CSE student specializing in Cloud Computing and Machine Learning, with strong skills as a Full Stack Developer. I'm passionate about building scalable applications, exploring cutting-edge technologies, and applying AI-driven solutions to real-world problems.",
        image: "/Shivang.png",
        github: "https://github.com/shivangrai5143",
        linkedin: "https://linkedin.com/in/shivang-rai-58b45728b"
      },
      {
        name: "Vivek Yadav",
        role: "Back-end Developer", 
        description: "I'm Vivek Yadav, a Computer Science student passionate about full-stack development and problem solving. I work with the MERN stack, Python, JavaScript, SQL, and Java to build interactive web apps and reliable back-end systems. I enjoy learning new tools, writing clean code, and creating solutions that can scale and make an impact.",
        image: "/Vivek.png",
        github: "https://github.com/VivekYadav-77",
        linkedin: "https://linkedin.com/in/vivekyadav94"
      }
    ]
  }

  return (
    <>
      <div className="team-page">
        <div className="team-container">
          <div className="team-header">
            <button className="back-btn" onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
            <div className="team-title-section">
              <h1 className="team-title">Meet Our Team</h1>
              <p className="team-subtitle">The passionate developers behind Brew Craft</p>
            </div>
          </div>

          <div className="team-content">
            {/* Front-end Section */}
            <div className="team-section">
              <div className="section-header">
                <div className="section-icon">
                  <Code size={32} />
                </div>
                <h2 className="section-title">Front-end Development</h2>
                <p className="section-description">Creating beautiful, responsive user interfaces</p>
              </div>
              
              <div className="team-grid">
                {teamMembers.frontend.map((member, index) => (
                  <div 
                    key={member.name} 
                    className="team-card"
                    style={{
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    <div className="member-photo">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="member-image"
                      />
                      <div className="photo-overlay">
                        <Coffee size={24} />
                      </div>
                    </div>
                    
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <div className="member-role">{member.role}</div>
                      <p className="member-description">{member.description}</p>
                      
                      <div className="member-social">
                        <a 
                          href={member.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-btn github-btn"
                        >
                          <Github size={18} />
                          <span>GitHub</span>
                        </a>
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-btn linkedin-btn"
                        >
                          <Linkedin size={18} />
                          <span>LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back-end Section */}
            <div className="team-section">
              <div className="section-header">
                <div className="section-icon">
                  <Server size={32} />
                </div>
                <h2 className="section-title">Back-end Development</h2>
                <p className="section-description">Building robust, scalable server-side solutions</p>
              </div>
              
              <div className="team-grid">
                {teamMembers.backend.map((member, index) => (
                  <div 
                    key={member.name} 
                    className="team-card"
                    style={{
                      animationDelay: `${(index + 2) * 0.2}s`
                    }}
                  >
                    <div className="member-photo">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="member-image"
                      />
                      <div className="photo-overlay">
                        <Server size={24} />
                      </div>
                    </div>
                    
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <div className="member-role">{member.role}</div>
                      <p className="member-description">{member.description}</p>
                      
                      <div className="member-social">
                        <a 
                          href={member.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-btn github-btn"
                        >
                          <Github size={18} />
                          <span>GitHub</span>
                        </a>
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="social-btn linkedin-btn"
                        >
                          <Linkedin size={18} />
                          <span>LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Stats Section */}
            <div className="team-stats">
              <div className="stats-card">
                <Users size={40} />
                <div className="stats-content">
                  <h3>4</h3>
                  <p>Team Members</p>
                </div>
              </div>
              <div className="stats-card">
                <Code size={40} />
                <div className="stats-content">
                  <h3>2</h3>
                  <p>Front-end Developers</p>
                </div>
              </div>
              <div className="stats-card">
                <Server size={40} />
                <div className="stats-content">
                  <h3>2</h3>
                  <p>Back-end Developers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TeamPage