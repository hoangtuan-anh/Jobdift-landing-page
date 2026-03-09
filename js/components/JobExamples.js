const JobExamples = {
  data() {
    return {
      activeImage: null,
      jobs: [
        {
          src: '/Screenshot 2026-03-07 at 15.16.06.png',
          title: '[HIRING] Web Developer — WordPress or Webflow',
          budget: '$500–$1,200/site'
        },
        {
          src: '/Screenshot 2026-03-07 at 15.16.18.png',
          title: '[Hiring] Website Developer for Healthcare Platform',
          budget: '£3,000 budget'
        },
        {
          src: '/Screenshot 2026-03-07 at 15.17.55.png',
          title: '[Hiring] Reddit Engagement & Post Writers',
          budget: '$20–$30/post'
        }
      ]
    };
  },
  methods: {
    open(src) { this.activeImage = src; },
    close() { this.activeImage = null; }
  },
  template: `
    <section id="job-examples" class="section section-alt">
      <div class="inner">
        <p class="section-label">Live Examples</p>
        <h2 class="section-headline">Jobs We Find For You</h2>
        <p class="section-sub">Here's a sample of the opportunities our AI surfaces daily — real posts, real budgets, no noise.</p>

        <div class="job-examples-grid">
          <div
            v-for="job in jobs"
            :key="job.src"
            class="job-card"
            @click="open(job.src)"
          >
            <div class="job-card-img-wrap">
              <img :src="job.src" :alt="job.title" class="job-card-img" />
              <div class="job-card-overlay">
                <span class="job-card-zoom">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="8.5" cy="8.5" r="5.5" stroke="white" stroke-width="1.8"/>
                    <path d="M13 13L16.5 16.5" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
                    <path d="M8.5 6v5M6 8.5h5" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                  View full post
                </span>
              </div>
            </div>
            <div class="job-card-footer">
              <p class="job-card-title">{{ job.title }}</p>
              <span class="job-card-budget">{{ job.budget }}</span>
            </div>
          </div>
        </div>
        <div style="margin-top:48px;">
          <a href="https://app.jobdrift.io/register" class="btn-primary">
            Sign Up
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Lightbox -->
      <div v-if="activeImage" class="lightbox" @click.self="close">
        <button class="lightbox-close" @click="close" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <img :src="activeImage" class="lightbox-img" @click.stop />
      </div>
    </section>
  `
};
