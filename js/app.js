const { createApp } = Vue;

const App = {
  template: `
    <app-nav></app-nav>
    <hero-section></hero-section>
    <proof-strip></proof-strip>
    <problem-section></problem-section>
    <solution-section></solution-section>
    <why-different></why-different>
    <free-tier-callout></free-tier-callout>
    <faq-section></faq-section>
    <job-examples></job-examples>
    <final-cta></final-cta>
    <app-footer></app-footer>
  `
};

const app = createApp(App);

app.component('AppNav', AppNav);
app.component('HeroSection', HeroSection);
app.component('ProofStrip', ProofStrip);
app.component('ProblemSection', ProblemSection);
app.component('SolutionSection', SolutionSection);
app.component('WhyDifferent', WhyDifferent);
app.component('FreeTierCallout', FreeTierCallout);
app.component('FaqSection', FaqSection);
app.component('JobExamples', JobExamples);
app.component('FinalCta', FinalCta);
app.component('AppFooter', AppFooter);

app.mount('#app');
