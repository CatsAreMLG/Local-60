"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

import styles from "./page.module.css";

interface Position {
  label: string;
  yes: boolean;
}

interface Endorsement {
  id: number;
  tier: string;
  tierLabel: string;
  name: string;
  office: string;
  initials: string;
  pull: string;
  why: string;
  positions: Position[];
}

const STD_POSITIONS: Position[] = [
  { label: "Right to organize", yes: true },
  { label: "Prevailing wage", yes: true },
  { label: "Healthcare access", yes: true },
  { label: "Public education", yes: true },
  { label: "Cost of living / housing", yes: true },
  { label: "Member engagement", yes: true },
];

const endorsements: Endorsement[] = [
  // Federal
  {
    id: 1,
    tier: "federal",
    tierLabel: "US House: TX-15",
    name: "Bobby Pulido",
    office: "US House of Representatives, District 15",
    initials: "BP",
    pull: "A rural-suburban Democratic coalition built around the economic concerns the local prioritizes.",
    why: "The committee endorsed Pulido for District 15 based on alignment with national labor priorities and the candidate's response to the political program's questionnaire. Full reasoning will detail district-specific labor concerns and committee interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 2,
    tier: "federal",
    tierLabel: "US House: TX-20",
    name: "Joaquin Castro",
    office: "US House of Representatives, District 20",
    initials: "JC",
    pull: "A reliable pro-labor vote and a known quantity for Local 60 members.",
    why: "The committee endorsed Castro for District 20 based on his record in Congress on labor priorities and continued member access. Full reasoning will detail his voting record and committee interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 3,
    tier: "federal",
    tierLabel: "US House: TX-21",
    name: "Kristen Hook",
    office: "US House of Representatives, District 21",
    initials: "KH",
    pull: "A challenger candidate aligned with PRO Act priorities and worker-first economic policy.",
    why: "The committee endorsed Hook for District 21 based on questionnaire responses, public commitments on labor priorities, and committee evaluation of the race. Full reasoning will detail platform commitments and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 4,
    tier: "federal",
    tierLabel: "US House: TX-23",
    name: "Santos Limon",
    office: "US House of Representatives, District 23",
    initials: "SL",
    pull: "Coalition strategy the committee considers viable for a district drawn to ignore working-family concerns.",
    why: "The committee endorsed Limon for District 23 based on alignment with the local's priorities and committee evaluation of the race. Full reasoning will detail platform commitments and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 5,
    tier: "federal",
    tierLabel: "US House: TX-35 (dual)",
    name: "Johnny Garcia & John Lira",
    office: "US House of Representatives, District 35",
    initials: "JG/JL",
    pull: "Dual endorsement: the committee determined both candidates clear the labor criteria.",
    why: "The committee issued a dual endorsement for District 35, reflecting the assessment that both Garcia and Lira meet the political program's criteria. Full reasoning will detail the rationale for dual endorsement and individual candidate evaluations.",
    positions: STD_POSITIONS,
  },
  {
    id: 6,
    tier: "federal",
    tierLabel: "US Senate",
    name: "James Talarico",
    office: "United States Senator, Texas",
    initials: "JT",
    pull: "The most consequential race on the ballot, and the candidate most aligned with the local's priorities.",
    why: "The committee endorsed Talarico for the US Senate based on his record, public commitments on labor priorities, and committee evaluation of the race. Full reasoning will detail platform commitments, voting record review, and interview notes.",
    positions: STD_POSITIONS,
  },

  // Statewide
  {
    id: 7,
    tier: "statewide",
    tierLabel: "Governor",
    name: "Gina Hinojosa",
    office: "Governor of Texas",
    initials: "GH",
    pull: "Executive authority over Workforce Commission appointments, prevailing wage policy, and worker safety rules.",
    why: "The committee endorsed Hinojosa for Governor based on the executive authority the office holds over labor policy and her platform commitments. Full reasoning will detail platform specifics and committee interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 8,
    tier: "statewide",
    tierLabel: "Lieutenant Governor",
    name: "Vikki Goodwin",
    office: "Lieutenant Governor of Texas",
    initials: "VG",
    pull: "The Senate gavel decides which labor bills get a hearing. That procedural authority is what we're backing.",
    why: "The committee endorsed Goodwin for Lt. Governor based on the Senate procedural authority the office holds over labor-priority legislation and her commitments on calendar process. Full reasoning will detail her platform and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 9,
    tier: "statewide",
    tierLabel: "Railroad Commissioner",
    name: "Jon Rosenthal",
    office: "Texas Railroad Commissioner",
    initials: "JR",
    pull: "Energy and pipeline oversight that takes worker safety seriously rather than as an afterthought.",
    why: "The committee endorsed Rosenthal for Railroad Commissioner based on his platform commitments on pipeline safety, regulatory enforcement, and worker protections. Full reasoning will detail his record and interview notes.",
    positions: STD_POSITIONS,
  },

  // Texas Senate
  {
    id: 10,
    tier: "tx-senate",
    tierLabel: "TX Senate: SD-19",
    name: "Roland Gutierrez",
    office: "Texas State Senate, District 19",
    initials: "RG",
    pull: "Senate seat held by a candidate the committee has worked with on labor-priority legislation.",
    why: "The committee endorsed Gutierrez for SD-19 based on his legislative record, member access track record, and committee interview. Full reasoning will detail specific bill activity and platform commitments.",
    positions: STD_POSITIONS,
  },
  {
    id: 11,
    tier: "tx-senate",
    tierLabel: "TX Senate: SD-21",
    name: "Judith Zaffirini",
    office: "Texas State Senate, District 21",
    initials: "JZ",
    pull: "A senior Senate voice with a sustained record of constituent service in the district.",
    why: "The committee endorsed Zaffirini for SD-21 based on her sustained legislative record and constituent service operation. Full reasoning will detail bill activity and member access.",
    positions: STD_POSITIONS,
  },
  {
    id: 12,
    tier: "tx-senate",
    tierLabel: "TX Senate: SD-26",
    name: "Jose Menendez",
    office: "Texas State Senate, District 26",
    initials: "JM",
    pull: "A San Antonio Senate seat with a record of labor engagement and member access.",
    why: "The committee endorsed Menendez for SD-26 based on his record on labor-priority issues and engagement with Local 60 members. Full reasoning will detail bill activity and interview notes.",
    positions: STD_POSITIONS,
  },

  // Texas House
  {
    id: 13,
    tier: "tx-house",
    tierLabel: "TX House: HD-116",
    name: "Trey Martinez Fischer",
    office: "Texas House of Representatives, District 116",
    initials: "TF",
    pull: "Senior House voice with sustained engagement on labor-priority bills and member access.",
    why: "The committee endorsed Martinez Fischer for HD-116 based on his legislative record and sustained engagement with the local. Full reasoning will detail bill activity and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 14,
    tier: "tx-house",
    tierLabel: "TX House: HD-117",
    name: "Philip Cortez",
    office: "Texas House of Representatives, District 117",
    initials: "PC",
    pull: "A returning House member with a consistent voting record on the local's priority issues.",
    why: "The committee endorsed Cortez for HD-117 based on his voting record and continued alignment with labor priorities. Full reasoning will detail bill activity and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 15,
    tier: "tx-house",
    tierLabel: "TX House: HD-118",
    name: "Kristian Carranza",
    office: "Texas House of Representatives, District 118",
    initials: "KC",
    pull: "Strong on housing supply as a labor issue, and an active presence at local political events.",
    why: "The committee endorsed Carranza for HD-118 based on her platform commitments and engagement with the local during the campaign. Full reasoning will detail platform specifics and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 16,
    tier: "tx-house",
    tierLabel: "TX House: HD-119",
    name: 'Elizabeth "Liz" Campos',
    office: "Texas House of Representatives, District 119",
    initials: "LC",
    pull: "A current House member with active member engagement and labor-aligned priorities.",
    why: "The committee endorsed Campos for HD-119 based on her voting record and active engagement with the local. Full reasoning will detail bill activity and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 17,
    tier: "tx-house",
    tierLabel: "TX House: HD-120",
    name: "Jordan Brown",
    office: "Texas House of Representatives, District 120",
    initials: "JB",
    pull: "A challenger candidate strong on labor priorities and visible at the local's political events.",
    why: "The committee endorsed Brown for HD-120 based on platform commitments and engagement with the local during the campaign. Full reasoning will detail platform specifics and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 18,
    tier: "tx-house",
    tierLabel: "TX House: HD-121",
    name: "Zack Dunn",
    office: "Texas House of Representatives, District 121",
    initials: "ZD",
    pull: "A challenger candidate the committee considers competitive and aligned with stated priorities.",
    why: "The committee endorsed Dunn for HD-121 based on platform commitments, questionnaire responses, and committee evaluation of the race. Full reasoning will detail platform specifics and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 19,
    tier: "tx-house",
    tierLabel: "TX House: HD-123",
    name: "Diego Bernal",
    office: "Texas House of Representatives, District 123",
    initials: "DB",
    pull: "A House voice with sustained focus on public education and economic priorities for working families.",
    why: "The committee endorsed Bernal for HD-123 based on his legislative record and sustained focus on the local's priority areas. Full reasoning will detail bill activity and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 20,
    tier: "tx-house",
    tierLabel: "TX House: HD-124",
    name: "Josey Garcia",
    office: "Texas House of Representatives, District 124",
    initials: "JG",
    pull: "A current House member with a labor-aligned voting record and active constituent service.",
    why: "The committee endorsed Garcia for HD-124 based on her voting record and active constituent service operation. Full reasoning will detail bill activity and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 21,
    tier: "tx-house",
    tierLabel: "TX House: HD-125 (dual)",
    name: "Donovon Rodriguez & Adrian Reyna",
    office: "Texas House of Representatives, District 125",
    initials: "DR/AR",
    pull: "Dual endorsement: the committee determined both candidates clear the labor criteria.",
    why: "The committee issued a dual endorsement for HD-125, reflecting the assessment that both Rodriguez and Reyna meet the political program's criteria. Full reasoning will detail the rationale for dual endorsement and individual candidate evaluations.",
    positions: STD_POSITIONS,
  },

  // Bexar County
  {
    id: 22,
    tier: "county",
    tierLabel: "Bexar County: DA",
    name: "Shannon Locke",
    office: "Bexar County District Attorney",
    initials: "SL",
    pull: "County prosecutorial authority on wage theft and worker classification: issues most DA offices ignore.",
    why: "The committee endorsed Locke for District Attorney based on her platform commitments on wage theft prosecution and worker classification enforcement. Full reasoning will detail platform specifics and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 23,
    tier: "county",
    tierLabel: "Bexar County: Judge",
    name: "Ron Nirenberg",
    office: "Bexar County Judge",
    initials: "RN",
    pull: "Procurement and policy authority affecting more than $1B in annual county-funded work.",
    why: "The committee endorsed Nirenberg for County Judge based on his record and the office's authority over county procurement, prevailing wage policy, and capital projects. Full reasoning will detail his record and interview notes.",
    positions: STD_POSITIONS,
  },
  {
    id: 24,
    tier: "county",
    tierLabel: "Bexar County: Clerk",
    name: "Lucy Adame-Clark",
    office: "Bexar County Clerk",
    initials: "LA",
    pull: "Election administration and public records oversight: operational competence the local values.",
    why: "The committee endorsed Adame-Clark for County Clerk based on her record and the operational importance of the office. Full reasoning will detail her record and platform commitments.",
    positions: STD_POSITIONS,
  },
  {
    id: 25,
    tier: "county",
    tierLabel: "Bexar County: Commissioner Pct 2",
    name: "Justin Rodriguez",
    office: "Bexar County Commissioner, Precinct 2",
    initials: "JR",
    pull: "Precinct-level authority on county capital projects, services, and procurement.",
    why: "The committee endorsed Rodriguez for Commissioner Pct 2 based on his record on county capital and procurement decisions. Full reasoning will detail his record and platform commitments.",
    positions: STD_POSITIONS,
  },
  {
    id: 26,
    tier: "county",
    tierLabel: "Bexar County: Commissioner Pct 4",
    name: "Tommy Calvert",
    office: "Bexar County Commissioner, Precinct 4",
    initials: "TC",
    pull: "Precinct-level authority on county capital projects, services, and procurement.",
    why: "The committee endorsed Calvert for Commissioner Pct 4 based on his record on county capital and procurement decisions. Full reasoning will detail his record and platform commitments.",
    positions: STD_POSITIONS,
  },
];

const FILTERS = [
  { label: "All races", value: "all" },
  { label: "Federal", value: "federal" },
  { label: "Statewide", value: "statewide" },
  { label: "Texas Senate", value: "tx-senate" },
  { label: "Texas House", value: "tx-house" },
  { label: "Bexar County", value: "county" },
];

const FAQ_QUERY = `*[
_type == "faq"]
{ _id, question, answer }`;

const faq_options = { next: { revalidate: 86400 } }; // every day

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [openDetailId, setOpenDetailId] = useState<number | null>(null);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());
  const [faqs, setFaqs] = useState<SanityDocument[]>([]);
  const detailRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    client.fetch<SanityDocument[]>(FAQ_QUERY, {}, faq_options).then(setFaqs);
  }, []);

  const filtered =
    activeFilter === "all"
      ? endorsements
      : endorsements.filter((e) => e.tier === activeFilter);

  const openDetail = endorsements.find((e) => e.id === openDetailId) ?? null;

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

  const handleCardClick = (e: Endorsement) => {
    if (openDetailId === e.id) {
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
      setOpenDetailId(e.id);
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
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`${styles.filterChip}${
              activeFilter === f.value ? ` ${styles.active}` : ""
            }`}
            onClick={() => {
              setActiveFilter(f.value);
              setOpenDetailId(null);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.grid} id="grid" ref={gridRef}>
        {filtered.map((e) => (
          <div
            key={e.id}
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
                  {openDetail.positions.map((p, i) => (
                    <div key={i} className={styles.detailPosition}>
                      <span
                        className={`${styles.posMark}${
                          p.yes ? "" : ` ${styles.no}`
                        }`}
                      >
                        {p.yes ? "✓" : "✗"}
                      </span>
                      <span>{p.label}</span>
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
                <a href="mailto:someone@example.com">Volunteer</a>
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
                <a href="mailto:someone@example.com">Contact the coordinator</a>
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
