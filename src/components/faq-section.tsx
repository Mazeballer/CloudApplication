import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "How secure is my vehicle and maintenance data?",
      answer:
        "We use enterprise-grade security with AWS RDS for data storage and ASP.NET API with industry-standard encryption. All data is encrypted at rest and in transit. We're compliant with major data protection regulations.",
    },
    {
      question: "What AWS services does AutoCare+ integrate with?",
      answer:
        "AutoCare+ leverages AWS Lambda for serverless functions, SNS for notifications, Textract for invoice OCR, S3 for document storage, and CloudWatch for monitoring. All services are fully managed and scaled automatically.",
    },
    {
      question: "Can workshops set their own pricing?",
      answer:
        "Yes! Workshops have full control over their service pricing, availability, and booking policies. Our platform simply facilitates the connection between drivers and workshops.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes, AutoCare+ is available on both iOS and Android. The mobile app offers the same functionality as the web platform with offline access to your maintenance history.",
    },
    {
      question: "How does workshop onboarding work?",
      answer:
        "Workshop onboarding is simple and takes about 15 minutes. You'll set up your profile, add services, configure availability, and integrate payment processing. Our support team is available to help at every step.",
    },
    {
      question: "What's the difference between Neon DB and AWS RDS?",
      answer:
        "We use Neon DB for development and testing environments due to its excellent developer experience and serverless architecture. Production deployments run on AWS RDS for maximum reliability, performance, and enterprise features.",
    },
  ]

  return (
    <section id="resources" className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about AutoCare+
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card px-6 rounded-lg border">
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
  )
}
