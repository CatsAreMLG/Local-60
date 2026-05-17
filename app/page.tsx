"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

import styles from "./page.module.css";

const LABEL_QUERY = `*[
_type == "label"]
{ _id, label, value }`;

const FAQ_QUERY = `*[
_type == "faq"]
{ _id, question, answer }`;

const ENDORSEMENT_QUERY = `*[
_type == "endorsement"]
{ _id, race, name, office, initials, pull, why, positions[]->{ _id, yes, position } }`;

const faq_options = { next: { revalidate: 86400 } }; // every day
const label_options = { next: { revalidate: 86400 } }; // every day
const endorsement_options = { next: { revalidate: 3600 } }; // every hour

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());
  const [faqs, setFaqs] = useState<SanityDocument[]>([]);
  const [labels, setLabels] = useState<SanityDocument[]>([]);
  const [endorsements, setEndorsements] = useState<SanityDocument[]>([]);
  const detailRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    client.fetch<SanityDocument[]>(FAQ_QUERY, {}, faq_options).then(setFaqs);
    client
      .fetch<SanityDocument[]>(LABEL_QUERY, {}, label_options)
      .then(setLabels);
    client
      .fetch<SanityDocument[]>(ENDORSEMENT_QUERY, {}, endorsement_options)
      .then(setEndorsements);
  }, []);

  const filtered =
    activeFilter === "all"
      ? endorsements
      : endorsements.filter((e) => e.tier === activeFilter);

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
          <p className={styles.heroLede}>
            Twenty-six races. Twenty-eight endorsements. All vetted by IBEW
            Local 60 members on the issues that determine whether working
            families in San Antonio and across Texas get a fair shake: wages,
            healthcare, housing, the right to organize. Read the reasoning
            behind each one.
          </p>
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
            <p>
              Every endorsement on this page went through the same five-step
              process. No backroom deals, no top-down picks. The political
              committee is elected by you, and the final slate is ratified by
              the membership at general meeting.
            </p>
            <p
              style={{
                fontSize: "15px",
                color: "var(--ink-mute)",
                fontStyle: "italic",
              }}
            >
              Members in good standing can observe any committee meeting and
              submit testimony on any race under consideration.
            </p>
          </div>
          <div className={styles.processSteps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>01</div>
              <div>
                <h4>Questionnaire</h4>
                <p>
                  Every candidate in a race we may endorse receives a
                  14-question survey covering labor priorities: right-to-work,
                  prevailing wage, NLRB process, paid leave, healthcare access,
                  and housing supply. Responses are public.
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>02</div>
              <div>
                <h4>Voting record review</h4>
                <p>
                  For incumbents, we score every roll call vote on
                  labor-relevant legislation since the last endorsement cycle.
                  Scoring rubric is published before review begins.
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>03</div>
              <div>
                <h4>Member interview</h4>
                <p>
                  Top candidates by questionnaire and record are invited for an
                  in-person interview with the political committee. Members can
                  submit questions in advance through the local&apos;s portal.
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>04</div>
              <div>
                <h4>Committee recommendation</h4>
                <p>
                  The nine-member political committee, elected by membership for
                  two-year terms, votes on each endorsement. A two-thirds
                  majority is required. Dissents are recorded.
                </p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>05</div>
              <div>
                <h4>Member ratification</h4>
                <p>
                  The full slate is presented to the membership at general
                  meeting. A majority vote of members in attendance ratifies,
                  modifies, or rejects each recommendation. The slate published
                  here reflects what members ratified.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.criteria} id="criteria">
        <div className={styles.criteriaHead}>
          <h2>What we look for</h2>
          <div className={styles.meta}>Five non-negotiables</div>
        </div>
        <div className={styles.criteriaGrid}>
          <div className={styles.criterion}>
            <div className={styles.criterionNum}>01</div>
            <h4>Labor rights</h4>
            <p>
              Position on right-to-work, prevailing wage, project labor
              agreements, NLRB process protections, fair scheduling, and the
              ability of workers to organize without retaliation. This is the
              floor.
            </p>
          </div>
          <div className={styles.criterion}>
            <div className={styles.criterionNum}>02</div>
            <h4>Wages and benefits</h4>
            <p>
              Stance on minimum wage, overtime protections, paid family and
              medical leave, and worker access to affordable healthcare
              independent of employer.
            </p>
          </div>
          <div className={styles.criterion}>
            <div className={styles.criterionNum}>03</div>
            <h4>Cost of living</h4>
            <p>
              Concrete commitments on housing supply, transit access, childcare
              affordability, and energy costs. We back candidates who treat the
              affordability crisis as a labor issue.
            </p>
          </div>
          <div className={styles.criterion}>
            <div className={styles.criterionNum}>04</div>
            <h4>Public services</h4>
            <p>
              Public education funding, Medicaid expansion, public sector worker
              rights, and protection of the social safety net our members depend
              on.
            </p>
          </div>
          <div className={styles.criterion}>
            <div className={styles.criterionNum}>05</div>
            <h4>Track record</h4>
            <p>
              Have they kept past commitments? Do they answer member calls? An
              endorsement is a relationship. We back candidates who show up
              after the election, not just before it.
            </p>
          </div>
          <div className={styles.criterion}>
            <div className={styles.criterionNum}>+</div>
            <h4>One more thing</h4>
            <p>
              No candidate is perfect on every issue. We endorse the best
              available choice in each race, weighted by the criteria above.
              Where no candidate clears the bar, we make no endorsement.
            </p>
          </div>
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
            <p>
              Member-driven endorsements for races affecting electrical workers
              and working families in Bexar County and across Texas.
            </p>
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
