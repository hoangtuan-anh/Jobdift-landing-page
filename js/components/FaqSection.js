const FaqSection = {
  data() {
    return {
      openIndex: null,
      faqs: [
        {
          q: 'Where do the jobs come from?',
          a: 'Currently sourced from Reddit communities and carefully filtered — with more platforms being added soon.'
        },
        {
          q: 'Is this automated?',
          a: 'Our AI system runs continuously, monitoring sources and scoring each listing against your profile. Only the top matches get sent to you — no bulk blasting.'
        },
        {
          q: 'How many job alerts do I get?',
          a: 'Every user receives up to 5 curated job alerts per day, completely free. Each alert is selected and verified by our AI system before it reaches your inbox — not bulk-blasted.'
        },
        {
          q: 'How long until I receive my first alert?',
          a: 'Most users receive their first curated batch within 24 hours of signing up.'
        }
      ]
    };
  },
  methods: {
    toggle(i) {
      this.openIndex = this.openIndex === i ? null : i;
    }
  },
  template: `
    <section class="section section-alt">
      <div class="inner" style="text-align:center;">
        <div class="section-label">FAQ</div>
        <h2 class="section-headline" style="margin:0 auto;">Common Questions</h2>

        <div class="faq-list" style="text-align:left;">
          <div class="faq-item" v-for="(faq, i) in faqs" :key="i">
            <div class="faq-toggle" @click="toggle(i)">
              {{ faq.q }}
              <svg
                class="faq-chevron"
                :class="{ open: openIndex === i }"
                width="18" height="18" viewBox="0 0 18 18" fill="none"
              >
                <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="faq-body" :style="{ maxHeight: openIndex === i ? '200px' : '0', opacity: openIndex === i ? 1 : 0 }">
              <div class="faq-a">{{ faq.a }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
};
