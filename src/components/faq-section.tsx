import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQSection() {
  const faqs = [
    {
      question: 'How secure is my data on AutoCare+?',
      answer:
        'Your account and vehicle information are protected using modern security best practices. All sensitive data is encrypted in transit and at rest, and we apply strict access controls, regular backups, and continuous monitoring to keep your data safe.',
    },
    {
      question: 'Is AutoCare+ reliable for everyday and business use?',
      answer:
        'Yes. AutoCare+ is built on a highly available cloud infrastructure designed to handle real world usage. We use automated backups, performance monitoring, and proactive maintenance to keep the platform stable and responsive for both drivers and workshops.',
    },
    {
      question: 'Can workshops set their own pricing?',
      answer:
        'Yes. Workshops have full control over their service pricing, availability, and booking policies. AutoCare+ simply provides the tools to manage schedules, customers, and bookings in one place.',
    },
    {
      question: 'Can I use AutoCare+ on mobile devices?',
      answer:
        'You can access AutoCare+ from any modern browser on desktop, tablet, or mobile. The interface is fully responsive, so you can view your bookings and maintenance history comfortably on the go.',
    },
    {
      question: 'How does workshop onboarding work?',
      answer:
        'Onboarding is straightforward and only takes a short setup. You will create your workshop profile, add services, configure working hours, and connect your preferred payment options. Our support materials and team are available to guide you through each step.',
    },
    {
      question: 'Is AutoCare+ suitable as my business grows?',
      answer:
        'AutoCare+ is designed to scale with you. Whether you manage a single workshop or multiple branches, you can add more users, services, and locations without changing systems or migrating your data.',
    },
  ];

  return (
    <section
      id="resources"
      className="container mx-auto px-4 md:px-8 py-16 md:py-24 bg-muted/30"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Find quick answers about how AutoCare+ works
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card px-6 rounded-lg border"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
