import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function About() {
  return (
    <div className="grain max-w-4xl mx-auto px-6 lg:px-8 py-16">
      <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-3">About</div>
      <h1 className="editorial-heading text-5xl md:text-6xl mb-6">A bridge of books, between batches.</h1>
      <p className="text-[#A1A1AA] text-lg leading-relaxed max-w-2xl">
        BookBridge began as a noticeboard pinned outside a hostel canteen — a list of textbooks for sale,
        scrawled in marker by graduating seniors. We turned that ritual into a place online, for every campus in India.
      </p>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          ["The Vision", "A circular economy for textbooks. No more shelves of forgotten paperbacks. No more juniors paying full MRP."],
          ["The Method", "Peer-to-peer, in-person handoffs. We don't take a cut. We don't ship. We connect, you transact."],
          ["The Spirit",  "Trust your seniors. Help your juniors. Rate honestly. Rinse, repeat — every semester."],
        ].map(([t, d]) => (
          <div key={t} className="card-edge p-6">
            <h3 className="font-serif text-2xl mb-3">{t}</h3>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">{d}</p>
          </div>
        ))}
      </section>

      {/* Stats strip */}
      <section className="mt-16 border border-[#27272A] bg-[#141417] p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[["100%","Free to use"],["0%","Commission"],["∞","Books possible"],["1","Community"]].map(([n, l]) => (
          <div key={l}>
            <div className="font-mono text-3xl text-[#E27D60]">{n}</div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mt-1">{l}</div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section id="faq" className="mt-20">
        <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-3">FAQ</div>
        <h2 className="editorial-heading text-4xl mb-8">Frequently asked.</h2>
        <Accordion type="single" collapsible className="space-y-2" data-testid="faq-accordion">
          {[
            ["Is BookBridge free?",             "Absolutely. We don't take any cut — buyers and sellers transact directly."],
            ["Do you ship books?",              "No. BookBridge is meant for same-city / same-college peer exchanges. Meet up, hand it over."],
            ["How do prices get suggested?",    "Our calculator factors MRP, condition and age of the book. You're free to set your own price."],
            ["Can I donate instead of selling?","Yes — toggle 'Donation' on the listing form. Your book will appear on the Donate page free of cost."],
            ["What's the Student Wall?",        "A campus-flavoured feed where students post updates, exchange notes, and rant about exams."],
            ["What is an Author Ad?",           "Authors and publishers can submit promotional book content. A featured one appears as a popup once per session on the homepage."],
            ["Is my data safe?",               "Passwords are bcrypt-hashed. JWT cookies are httpOnly. Email IDs are never sold."],
          ].map(([q, a], i) => (
            <AccordionItem key={i} value={`q-${i}`} data-testid={`faq-${i}`} className="border border-[#27272A] bg-[#141417] px-5">
              <AccordionTrigger className="text-left font-serif text-xl hover:no-underline py-5">{q}</AccordionTrigger>
              <AccordionContent className="text-[#d4d4d8] leading-relaxed pb-5">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
