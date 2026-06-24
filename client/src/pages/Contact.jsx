import LeadForm from '../components/LeadForm';

export default function Contact() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="text-center" style={{ marginBottom: 'var(--space-5)' }}>
          <span className="eyebrow">Contact</span>
          <h1>Get in Touch</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            Whether you need a product demo, a custom solution, or just want to say hello — we'd love to hear from you.
          </p>
        </div>
        <LeadForm type="contact" />
      </div>
    </section>
  );
}
