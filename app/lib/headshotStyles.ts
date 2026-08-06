export type HeadshotStyleGroup = "platform" | "profession" | "special";

export type HeadshotStyle = {
  id: string;
  label: string;
  badgeColor: string;
  group: HeadshotStyleGroup;
  exampleImage: string;
};

const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=400&h=500&fit=crop&auto=format&q=80`;

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  // ── Social & Platform ──────────────────────────────────────────────────────
  {
    id: "linkedin",
    label: "LinkedIn",
    badgeColor: "#0A66C2",
    group: "platform",
    exampleImage: U("photo-1560250097-0b93528c311a"),
  },
  {
    id: "cv",
    label: "CV / Resume",
    badgeColor: "#374151",
    group: "platform",
    exampleImage: U("photo-1507003211169-0a1dd7228f2d"),
  },
  {
    id: "freelancer",
    label: "Freelancer",
    badgeColor: "#7C3AED",
    group: "platform",
    exampleImage: U("photo-1519085360753-af0119f7cbe7"),
  },
  {
    id: "fiverr",
    label: "Fiverr",
    badgeColor: "#1DBF73",
    group: "platform",
    exampleImage: U("photo-1494790108377-be9c29b29330"),
  },
  {
    id: "upwork",
    label: "Upwork",
    badgeColor: "#14A800",
    group: "platform",
    exampleImage: U("photo-1438761681033-6461ffad8d80"),
  },
  {
    id: "github",
    label: "GitHub",
    badgeColor: "#24292F",
    group: "platform",
    exampleImage: U("photo-1506794778202-cad84cf45f1d"),
  },
  {
    id: "youtube",
    label: "YouTube",
    badgeColor: "#FF0000",
    group: "platform",
    exampleImage: U("photo-1529626455594-4ff0802cfb7e"),
  },
  {
    id: "facebook",
    label: "Facebook",
    badgeColor: "#1877F2",
    group: "platform",
    exampleImage: U("photo-1500648767791-00dcc994a43e"),
  },
  {
    id: "instagram",
    label: "Instagram",
    badgeColor: "#C13584",
    group: "platform",
    exampleImage: U("photo-1488426862026-3ee34a7d66df"),
  },
  {
    id: "twitter",
    label: "X / Twitter",
    badgeColor: "#14171A",
    group: "platform",
    exampleImage: U("photo-1557862921-37829c790f19"),
  },

  // ── By Profession ──────────────────────────────────────────────────────────
  {
    id: "speaker",
    label: "Speaker",
    badgeColor: "#D97706",
    group: "profession",
    exampleImage: U("photo-1542744173-8e7e53415bb0"),
  },
  {
    id: "ceo",
    label: "CEO",
    badgeColor: "#111827",
    group: "profession",
    exampleImage: U("photo-1504257432389-52343af06ae3"),
  },
  {
    id: "author",
    label: "Author",
    badgeColor: "#92400E",
    group: "profession",
    exampleImage: U("photo-1541963463532-d68292c34b19"),
  },
  {
    id: "doctor",
    label: "Doctor",
    badgeColor: "#0284C7",
    group: "profession",
    exampleImage: U("photo-1612349317150-e413f6a5b16d"),
  },
  {
    id: "lawyer",
    label: "Lawyer",
    badgeColor: "#1F2937",
    group: "profession",
    exampleImage: U("photo-1568602471122-7832951cc4c5"),
  },
  {
    id: "teacher",
    label: "Teacher",
    badgeColor: "#B45309",
    group: "profession",
    exampleImage: U("photo-1580489944761-15a19d654956"),
  },
  {
    id: "student",
    label: "Student",
    badgeColor: "#6D28D9",
    group: "profession",
    exampleImage: U("photo-1523240795612-9a054b0db644"),
  },

  // ── Special Purpose ────────────────────────────────────────────────────────
  {
    id: "passport",
    label: "Passport Style",
    badgeColor: "#4B5563",
    group: "special",
    exampleImage: U("photo-1547425260-76bcadfb4f2c"),
  },
  {
    id: "corporate-team",
    label: "Corporate Team",
    badgeColor: "#0F766E",
    group: "special",
    exampleImage: U("photo-1522071820081-009f0129c71c"),
  },
  {
    id: "farmer",
    label: "Farmer",
    badgeColor: "#4D7C0F",
    group: "special",
    exampleImage: U("photo-1560958089-b8a1929cea89"),
  },
  {
    id: "office-support",
    label: "Office Support",
    badgeColor: "#0891B2",
    group: "special",
    exampleImage: U("photo-1453614512568-c4024d13c247"),
  },
  {
    id: "tea-boy",
    label: "Tea Boy",
    badgeColor: "#78350F",
    group: "special",
    exampleImage: U("photo-1498837167922-ddd27525d352"),
  },
  {
    id: "foreman",
    label: "Foreman",
    badgeColor: "#B91C1C",
    group: "special",
    exampleImage: U("photo-1537511446984-935f663eb1f4"),
  },
];

export const GROUP_LABELS: Record<HeadshotStyleGroup, string> = {
  platform: "Social & Platform",
  profession: "By Profession",
  special: "Special Purpose",
};

export const HEADSHOT_STYLE_GROUPS: HeadshotStyleGroup[] = [
  "platform",
  "profession",
  "special",
];
