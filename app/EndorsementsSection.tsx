"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { type Label, type Endorsement } from "@/lib/sanity";

import styles from "./page.module.css";
import defaultPortrait from "@/public/default.png";

export default function EndorsementsSection({
  labels,
  endorsements,
}: {
  labels: Label[];
  endorsements: Endorsement[];
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const detailRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  const handleCardClick = (e: Endorsement) => {
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

  return (
    <>
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
            <div className={styles.cardTier}>{e.tier?.label}</div>
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
            <div className={styles.detailPhoto}>
              {openDetail.portrait ? (
                <Image
                  src={openDetail.portrait.url}
                  alt="Picture of the candidate"
                  width={200}
                  height={240}
                />
              ) : (
                openDetail.initials
              )}
            </div>
            <div>
              <div className={styles.detailTier}>{openDetail.tier?.label}</div>
              <h3>{openDetail.name}</h3>
              <div className={styles.detailOffice}>{openDetail.office}</div>
              <div className={styles.detailSection}>
                <h4>Why we {openDetail.endorsed ? "endorsed" : "support"}</h4>
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
    </>
  );
}
