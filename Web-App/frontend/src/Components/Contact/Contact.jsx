import React, { useEffect } from 'react';
import gsap from 'gsap';
import './Contact.css';

const Contact = () => {
  useEffect(() => {
    gsap.fromTo(
      ".contact-container",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
    );

    gsap.fromTo(
      ".team-section",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", stagger: 0.2 }
    );

    gsap.fromTo(
      ".guide-section",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.3 }
    );
  }, []);

  return (
    <div className="contact-container">
      <h2>Meet Our Team</h2>

      <div className="team-section">
        {/* Team Leader (Single Row) */}
        <div className="team-member team-lead">
          <img src="/assets/jayasai.png" alt="Jayasai Dodla" />
          <h3>Jayasai Dodla</h3>
          <p>Team Leader & Developer</p>
          <div className="social-links">
            <a href="https://github.com/JayD2003" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/jaydodla" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>

      {/* Team Members in Second Row */}
      <div className="team-section">
        <div className="team-member">
          <img src="/assets/ajay.jpeg" alt="Ajay Jakkampudi" />
          <h3>Ajay Jakkampudi</h3>
          <p>Team Member</p>
          <div className="social-links">
            <a href="https://github.com/JakkampudiAjay" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/jakkampudi-ajay-b345a7231/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="team-member">
          <img src="/assets/holder.png" alt="Mohan Sai Reddy Atluri" />
          <h3>Mohan Sai Reddy Atluri</h3>
          <p>Team Member</p>
          <div className="social-links">
            <a href="https://github.com/MohanSaiAtluri" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/mohan-sai-atluri" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>

      {/* Guide Section */}
      <h2>Our Guide</h2>
      <div className="guide-section">
        <div className="guide-card">
          <img src="/assets/guide.png" alt="Dr. Theresa P R" />
          <h3>Dr. Theresa P R</h3>
          <p>M.E, Ph.D, Computer Science and Engineering</p>
          <p>R.M.K Engineering College, Chennai, India</p>
          <a href="mailto:prt.cse@rmkec.ac.in" className="email-link">prt.cse@rmkec.ac.in</a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
