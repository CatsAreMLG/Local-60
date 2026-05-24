import Image from "next/image";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

import styles from "./page.module.css";
import EndorsementsSection from "./EndorsementsSection";
import FaqSection from "./FaqSection";

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

export default async function Home() {
  const [
    hero,
    process,
    processSteps,
    criteria,
    faqs,
    labels,
    endorsements,
    footer,
  ] = await Promise.all([
    client.fetch<SanityDocument>(HERO_QUERY, {}, day_options),
    client.fetch<SanityDocument>(PROCESS_QUERY, {}, day_options),
    client.fetch<SanityDocument[]>(PROCESS_STEPS_QUERY, {}, day_options),
    client.fetch<SanityDocument[]>(CRITERIA_QUERY, {}, day_options),
    client.fetch<SanityDocument[]>(FAQ_QUERY, {}, day_options),
    client.fetch<SanityDocument[]>(LABEL_QUERY, {}, day_options),
    client.fetch<SanityDocument[]>(ENDORSEMENT_QUERY, {}, hour_options),
    client.fetch<SanityDocument>(FOOTER_QUERY, {}, day_options),
  ]);

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
              priority
            />
          </div>
          <nav className={styles.nav} aria-label="Main navigation">
            <a href="#endorsements">Endorsements</a>
            <a href="#process">Our process</a>
            <a href="#criteria">Criteria</a>
            <a href="#faq">FAQ</a>
            <a href="#act" style={{ color: "#D85A50" }}>
              Get involved →
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="hero-heading">
          <div>
            <div className={styles.heroEyebrow}>2026 General election</div>
            <h1 id="hero-heading">
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

        <EndorsementsSection labels={labels} endorsements={endorsements} />

        <section
          className={styles.process}
          id="process"
          aria-labelledby="process-heading"
        >
          <div className={styles.processInner}>
            <div className={styles.processSide}>
              <h2 id="process-heading">
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
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className={styles.criteria}
          id="criteria"
          aria-labelledby="criteria-heading"
        >
          <div className={styles.criteriaHead}>
            <h2 id="criteria-heading">What we look for</h2>
            <div className={styles.meta}>Five non-negotiables</div>
          </div>
          <div className={styles.criteriaGrid}>
            {criteria.map((c, i) => (
              <div className={styles.criterion} key={c._id}>
                <div className={styles.criterionNum}>0{i + 1}</div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        <FaqSection faqs={faqs} />

        <section
          className={styles.ctaStrip}
          id="act"
          aria-labelledby="act-heading"
        >
          <h2 id="act-heading">
            The slate is the start. <em>Turnout finishes the job.</em>
          </h2>
          <p>
            Sign up to canvass, phonebank, or just commit to bringing one
            coworker to the polls. Close races are decided by who shows up.
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
      </main>

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
            <h3>The slate</h3>
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
            <h3>The process</h3>
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
            <h3>Get involved</h3>
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
