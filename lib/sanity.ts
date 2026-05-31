import { sanityFetch } from "@/sanity/live";

const HERO_QUERY = `*[_type == "hero"][0]{ text }`;
const PROCESS_QUERY = `*[_type == "process"][0]{ main, subtext }`;
const PROCESS_STEPS_QUERY = `*[_type == "process-steps"] | order(_createdAt asc){ _id, title, text }`;
const CRITERIA_QUERY = `*[_type == "criteria"] | order(_createdAt asc){ _id, title, text }`;
const LABEL_QUERY = `*[_type == "label"]{ _id, label, value }`;
const FAQ_QUERY = `*[_type == "faq"]{ _id, question, answer }`;
const ENDORSEMENT_QUERY = `*[_type == "endorsement"]{ _id, tier[0]->{ _id, label, value }, race, name, office, initials, pull, why, positions[]->{ _id, yes, position } }`;
const FOOTER_QUERY = `*[_type == "footer"][0]{ text }`;

export type Hero = { text: string };
export type Process = { main: string; subtext: string };
export type ProcessStep = { _id: string; title: string; text: string };
export type Criterion = { _id: string; title: string; text: string };
export type Label = { _id: string; label: string; value: string };
export type Faq = { _id: string; question: string; answer: string };
export type Position = { _id: string; yes: boolean; position: string };
export type Tier = { _id: string; label: string; value: string };
export type image = { _id: string; url: string };
export type Endorsement = {
  _id: string;
  tier: Tier;
  portrait: image;
  race: string;
  name: string;
  office: string;
  initials: string;
  pull: string;
  why: string;
  endorsed: boolean;
  positions: Position[];
};
export type Footer = { text: string };

const [
  hero,
  processData,
  processSteps,
  criteria,
  faqs,
  labels,
  endorsements,
  footer,
] = await Promise.all([
  sanityFetch({ query: HERO_QUERY }).then((r) => r.data as Hero | null),
  sanityFetch({ query: PROCESS_QUERY }).then((r) => r.data as Process | null),
  sanityFetch({ query: PROCESS_STEPS_QUERY }).then(
    (r) => r.data as ProcessStep[],
  ),
  sanityFetch({ query: CRITERIA_QUERY }).then((r) => r.data as Criterion[]),
  sanityFetch({ query: FAQ_QUERY }).then((r) => r.data as Faq[]),
  sanityFetch({ query: LABEL_QUERY }).then((r) => r.data as Label[]),
  sanityFetch({ query: ENDORSEMENT_QUERY }).then(
    (r) => r.data as Endorsement[],
  ),
  sanityFetch({ query: FOOTER_QUERY }).then((r) => r.data as Footer | null),
]);

export {
  hero,
  processData as process,
  processSteps,
  criteria,
  faqs,
  labels,
  endorsements,
  footer,
};
