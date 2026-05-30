"use client";

import { useState } from "react";
import { type Faq } from "@/lib/sanity";
import styles from "./page.module.css";

export default function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section className={styles.faq} id="faq" aria-labelledby="faq-heading">
      <div className={styles.faqInner}>
        <div className={styles.faqHead}>
          <div className={styles.eyebrow}>Frequently asked questions</div>
          <h2 id="faq-heading">
            Got <em>questions?</em>
          </h2>
        </div>
        {faqs.map((faq, i) => (
          <div
            key={faq._id}
            className={`${styles.faqItem}${
              openFaqs.has(i) ? ` ${styles.open}` : ""
            }`}
          >
            <button className={styles.faqQ} onClick={() => toggleFaq(i)}>
              {faq.question}
              <span className={styles.faqToggle}>+</span>
            </button>
            <div className={styles.faqA}>
              <div className={styles.faqAInner}>{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
