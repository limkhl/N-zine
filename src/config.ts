import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://n-zine.vercel.app/",
  author: "limkhl",
  profile: "https://github.com/limkhl",
  desc: "쓰는 사람이 되기 위해 시작한 zine 프로젝트",
  title: "N-zine",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "ko", // html lang code. Set this empty and default will be "en"
  langTag: ["ko-KR", "en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 166,
  height: 99,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/limkhl",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Facebook`,
    active: false,
  },
  {
    name: "Instagram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Instagram`,
    active: false,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/kyunghee-lim",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:limkh.dev@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitter`,
    active: false,
  },
];
