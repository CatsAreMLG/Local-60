"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

import styles from "./page.module.css";

const HERO_QUERY = `*[
_type == "hero"][0]
{ text }`;

const PROCESS_QUERY = `*[
_type == "process"][0]
{ main, subtext }`;

const PROCESS_STEPS_QUERY = `*[
_type == "process-steps"] | order(_createdAt asc)
{ _id, title, text }`;

const CRITERIA_QUERY = `*[
_type == "criteria"] | order(_createdAt asc)
{ _id, title, text }`;

const LABEL_QUERY = `*[
_type == "label"]
{ _id, label, value }`;

const FAQ_QUERY = `*[
_type == "faq"]
{ _id, question, answer }`;

const ENDORSEMENT_QUERY = `*[
_type == "endorsement"]
{ _id, tier[0]->{ _id, label, value }, race, name, office, initials, pull, why, positions[]->{ _id, yes, position } }`;

const FOOTER_QUERY = `*[
_type == "footer"][0]
{ text }`;

const day_options = { next: { revalidate: 86400 } }; // every day
const hour_options = { next: { revalidate: 3600 } }; // every hour

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());
  const [hero, setHero] = useState<SanityDocument | null>(null);
  const [process, setProcess] = useState<SanityDocument | null>(null);
  const [processSteps, setProcessSteps] = useState<SanityDocument[]>([]);
  const [criteria, setCriteria] = useState<SanityDocument[]>([]);
  const [faqs, setFaqs] = useState<SanityDocument[]>([]);
  const [labels, setLabels] = useState<SanityDocument[]>([]);
  const [endorsements, setEndorsements] = useState<SanityDocument[]>([]);
  const [footer, setFooter] = useState<SanityDocument | null>(null);
  const detailRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    client.fetch<SanityDocument>(HERO_QUERY, {}, day_options).then(setHero);
    client
      .fetch<SanityDocument>(PROCESS_QUERY, {}, day_options)
      .then(setProcess);
    client
      .fetch<SanityDocument[]>(PROCESS_STEPS_QUERY, {}, day_options)
      .then(setProcessSteps);
    client
      .fetch<SanityDocument[]>(CRITERIA_QUERY, {}, day_options)
      .then(setCriteria);
    client.fetch<SanityDocument[]>(FAQ_QUERY, {}, day_options).then(setFaqs);
    client
      .fetch<SanityDocument[]>(LABEL_QUERY, {}, day_options)
      .then(setLabels);
    client
      .fetch<SanityDocument[]>(ENDORSEMENT_QUERY, {}, hour_options)
      .then(setEndorsements);
    client.fetch<SanityDocument>(FOOTER_QUERY, {}, day_options).then(setFooter);
  }, []);

  const filtered =
    activeFilter === "all"
      ? endorsements
      : endorsements.filter((e) => e.tier.value === activeFilter);

  const openDetail = endorsements.find((e) => e._id === openDetailId) ?? null;

  useEffect(() => {
    if (openDetailId !== null) {
      setTimeout(
        () =>
          detailRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        50,
      );
    }
  }, [openDetailId]);

  const handleCardClick = (e: SanityDocument) => {
    if (openDetailId === e._id) {
      setOpenDetailId(null);
      setTimeout(
        () =>
          gridRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        50,
      );
    } else {
      setOpenDetailId(e._id);
    }
  };

  const handleCloseDetail = () => {
    setOpenDetailId(null);
    setTimeout(
      () =>
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    );
  };

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <>
      <div className={styles.demoBanner}>
        <span>●</span> Demo prototype: sample content for proposal review, not
        actual endorsements
      </div>

      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.brand}>
            <Image
              src="/logo_sm.png"
              width={160}
              height={57}
              alt="IBEW Local 60 Logo"
            />
          </div>
          <nav className={styles.nav}>
            <a href="#endorsements">Endorsements</a>
            <a href="#process">Our process</a>
            <a href="#criteria">Criteria</a>
            <a href="#faq">FAQ</a>
            <a href="#act" style={{ color: "var(--red)" }}>
              Get involved →
            </a>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <div>
          <div className={styles.heroEyebrow}>2026 General election</div>
          <h1>
            Who we&apos;re
            <br />
            backing
            <br />
            and <em>why</em>.
          </h1>
          <p className={styles.heroLede}>{hero && hero.text}</p>
        </div>
        <div className={styles.heroSide}>
          <div className={styles.heroStat}>
            <div className={styles.heroStatNum}>26</div>
            <div className={styles.heroStatLabel}>Races on the slate</div>
          </div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatNum}>9</div>
            <div className={styles.heroStatLabel}>Member committee</div>
          </div>
          <div className={styles.heroStat}>
            <div className={styles.heroStatNum}>3,113</div>
            <div className={styles.heroStatLabel}>Members</div>
          </div>
          <div className={styles.heroStat} style={{ borderBottom: "none" }}>
            <div className={styles.heroStatNum}>Nov 3</div>
            <div className={styles.heroStatLabel}>Election day</div>
          </div>
        </div>
      </section>

      <div className={styles.sectionHead} id="endorsements">
        <h2>The slate</h2>
        <div className={styles.meta}>26 races · ratified Apr 2026</div>
      </div>

      <div className={styles.filters}>
        {labels.map((label) => (
          <button
            key={label._id}
            className={`${styles.filterChip}${
              activeFilter === label.value ? ` ${styles.active}` : ""
            }`}
            onClick={() => {
              setActiveFilter(label.value);
              setOpenDetailId(null);
            }}
          >
            {label.label}
          </button>
        ))}
      </div>

      <div className={styles.grid} id="grid" ref={gridRef}>
        {filtered.map((e) => (
          <div
            key={e._id}
            className={styles.card}
            onClick={() => handleCardClick(e)}
          >
            <div className={styles.cardTier}>{e.tierLabel}</div>
            <div className={styles.cardName}>{e.name}</div>
            <div className={styles.cardOffice}>{e.office}</div>
            <div className={styles.cardPull}>&ldquo;{e.pull}&rdquo;</div>
            <div className={styles.cardCta}>
              Read full reasoning <span className={styles.cardCtaArrow}>→</span>
            </div>
          </div>
        ))}
      </div>

      {openDetail && (
        <section className={styles.detail} ref={detailRef}>
          <div className={styles.detailInner}>
            <div className={styles.detailPhoto}>{openDetail.initials}</div>
            <div>
              <div className={styles.detailTier}>{openDetail.tierLabel}</div>
              <h3>{openDetail.name}</h3>
              <div className={styles.detailOffice}>{openDetail.office}</div>
              <div className={styles.detailSection}>
                <h4>Why we endorsed</h4>
                <p>{openDetail.why}</p>
              </div>
              <div className={styles.detailSection}>
                <h4>Positions on key issues</h4>
                <div className={styles.detailPositions}>
                  {(
                    openDetail.positions as {
                      _id: string;
                      yes: boolean;
                      position: string;
                    }[]
                  ).map((p) => (
                    <div key={p._id} className={styles.detailPosition}>
                      <span
                        className={`${styles.posMark}${
                          p.yes ? "" : ` ${styles.no}`
                        }`}
                      >
                        {p.yes ? "✓" : "✗"}
                      </span>
                      <span>{p.position}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className={styles.detailClose}
                onClick={handleCloseDetail}
              >
                Close
              </button>
            </div>
          </div>
        </section>
      )}

      <section className={styles.process} id="process">
        <div className={styles.processInner}>
          <div className={styles.processSide}>
            <h2>
              How an
              <br />
              endorsement <em>happens</em>.
            </h2>
            <p>{process && process.main}</p>
            <p
              style={{
                fontSize: "15px",
                color: "var(--ink-mute)",
                fontStyle: "italic",
              }}
            >
              {process && process.subtext}
            </p>
          </div>
          <div className={styles.processSteps}>
            {processSteps.map((step, i) => (
              <div className={styles.step} key={step._id}>
                <div className={styles.stepNum}>0{i + 1}</div>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.criteria} id="criteria">
        <div className={styles.criteriaHead}>
          <h2>What we look for</h2>
          <div className={styles.meta}>Five non-negotiables</div>
        </div>
        <div className={styles.criteriaGrid}>
          {criteria.map((c, i) => (
            <div className={styles.criterion} key={c._id}>
              <div className={styles.criterionNum}>0{i + 1}</div>
              <h4>{c.title}</h4>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.faq} id="faq">
        <div className={styles.faqInner}>
          <div className={styles.faqHead}>
            <div className={styles.eyebrow}>Frequently asked questions</div>
            <h2>
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

      <section className={styles.ctaStrip} id="act">
        <h2>
          The slate is the start. <em>Turnout finishes the job.</em>
        </h2>
        <p>
          Sign up to canvass, phonebank, or just commit to bringing one coworker
          to the polls. Close races are decided by who shows up.
        </p>
        <div className={styles.ctaButtons}>
          <a href="mailto:dale@ibewlu60.org">
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              Volunteer for the program
            </button>
          </a>
          <a
            rel="external noopener noreferrer"
            href="https://www.bexar.org/2229/Voter-Registration-Check-Polling-Locatio"
          >
            <button className={`${styles.btn} ${styles.btnGhost}`}>
              Find your polling place
            </button>
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image
              src="/logo_sm.png"
              width={160}
              height={57}
              alt="IBEW Local 60 Logo"
            />
            <p>{footer && footer.text}</p>
          </div>
          <div className={styles.footerCol}>
            <h4>The slate</h4>
            <ul>
              <li>
                <a href="#endorsements">All endorsements</a>
              </li>
              <li>
                <a href="#endorsements">Federal</a>
              </li>
              <li>
                <a href="#endorsements">Statewide</a>
              </li>
              <li>
                <a href="#endorsements">State legislature</a>
              </li>
              <li>
                <a href="#endorsements">County &amp; local</a>
              </li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>The process</h4>
            <ul>
              <li>
                <a href="#process">How endorsements happen</a>
              </li>
              <li>
                <a href="#criteria">Our criteria</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Get involved</h4>
            <ul>
              <li>
                <a href="mailto:dale@ibewlu60.org">Volunteer</a>
              </li>
              <li>
                <a
                  rel="external noopener noreferrer"
                  href="https://www.bexar.org/2229/Voter-Registration-Check-Polling-Locatio"
                >
                  Find your polling place
                </a>
              </li>
              <li>
                <a href="mailto:dale@ibewlu60.org">Contact the coordinator</a>
              </li>
              <li>
                <a href="https://www.ibewlu60.org/" rel="external">
                  Member portal
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBase}>
          <div>© 2026 Local 60 · Paid for by the IBEW Local 60 Union</div>
          <div>Made with input from members</div>
        </div>
      </footer>
    </>
  );
}
