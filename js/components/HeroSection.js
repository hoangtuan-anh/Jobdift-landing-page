const HeroSection = {
  template: `
    <section id="hero">
      <div class="inner" style="display:flex;flex-direction:column;align-items:center;">
        <div class="hero-badge">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="7" fill="#16A34A" fill-opacity="0.15"/>
            <circle cx="7" cy="7" r="3" fill="#16A34A"/>
          </svg>
          5 free job alerts per day · No credit card
        </div>

        <h1>
          Get High-Quality Freelance Jobs<br />
          <span class="highlight">Delivered to You</span> for Free
        </h1>

        <p style="font-size:18px;line-height:1.65;color:var(--secondary);max-width:520px;text-align:center;margin:0 auto 28px;">No keywords to manage. No filters to maintain. Start receiving curated job alerts today. Takes 10 seconds.</p>

        <a href="https://app.jobdrift.io/register" class="btn-primary" id="signup" style="padding: 14px 56px; font-size: 16px; margin-bottom: 14px;">
          Sign Up
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

        <p class="hero-note" style="font-size:13px;color:#9CA3AF;margin:0;">5 curated alerts per day · Free · No credit card required</p>
      </div>
    </section>
  `
};
