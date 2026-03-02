import { Section } from "./components/Section";
import { CliToolbar } from "./components/CliToolbar";
import { ScrollProgress } from "./components/ScrollProgress";
import { Divider } from "./components/Divider";
import { SectionHeader } from "./components/SectionHeader";
import { TypingCursor } from "./components/TypingCursor";
import { ProjectPreview } from "./components/ProjectPreview";
import { Gallery } from "./components/Gallery";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useTypingEffect } from "./hooks/useTypingEffect";
import { useReturningVisitor } from "./hooks/useReturningVisitor";
import {
  MAX_CONTENT_WIDTH,
  MOTION,
  TYPING_DELAY_START,
  TYPING_SPEED,
  TEXT,
  ROW_CLASS,
} from "./constants/ui";
import galleryPhotos from "../../public/gallery/index.json";

/** Main single-page portfolio application. */
export default function App() {
  const { t } = useTranslation();
  const isReturning = useReturningVisitor();

  const profileName = t(isReturning ? "profile.nameReturning" : "profile.name");
  const profileTitle = t("profile.title");
  const aboutText = t("home.aboutText");
  const subtitleText = `${profileTitle}`;

  const nameDelay = TYPING_DELAY_START;
  const subtitleDelay = nameDelay + profileName.length * TYPING_SPEED.name;
  const aboutDelay = subtitleDelay + subtitleText.length * TYPING_SPEED.subtitle + 100;

  const typedName = useTypingEffect(profileName, TYPING_SPEED.name, nameDelay);
  const typedSubtitle = useTypingEffect(subtitleText, TYPING_SPEED.subtitle, subtitleDelay);
  const typedAbout = useTypingEffect(aboutText, TYPING_SPEED.about, aboutDelay);

  const education = t("education.items", { returnObjects: true }) as {
    date: string; title: string; org: string;
  }[];
  const work = t("work.items", { returnObjects: true }) as {
    date: string; title: string; org: string; description?: string;
  }[];
  const skills = {
    programming: t("skills.programming", { returnObjects: true }) as string[],
    database: t("skills.database", { returnObjects: true }) as string[],
    web: t("skills.web", { returnObjects: true }) as string[],
    media: t("skills.media", { returnObjects: true }) as string[],
    cloudProvider: t("skills.cloudProvider", { returnObjects: true }) as string[],
  };
  const skillTitles = {
    programming: t("skills.titles.programming"),
    database: t("skills.titles.database"),
    web: t("skills.titles.web"),
    media: t("skills.titles.media"),
    cloudProvider: t("skills.titles.cloudProvider")
  };
  const photos = galleryPhotos;

  type Tool = {
    key: string;
    github?: string;
    comingSoon?: boolean;
    preview?: {
      images: Array<{ src: string; alt: string }>;
      stack: string[];
      year: string;
      chromeLabel: string;
      badgeLabel?: string;
    };
  };

  const tools: Tool[] = [
    {
      key: "hawkMcp",
      github: t("toolbox.hawkMcp.github"),
      preview: {
        images: [{ src: "/projects/hawk-mcp.png", alt: "HAWK MCP Terminal Assistant" }],
        stack: ["MCP", "Ollama", "Local AI"],
        year: "2025",
        chromeLabel: "HAWK-MCP.SRC",
        badgeLabel: "[ READY ]",
      },
    },
    {
      key: "hawkMobile",
      github: t("toolbox.hawkMobile.github"),
      preview: {
        images: [
          { src: "/projects/hawk-mobile-app.png", alt: "HAWK Mobile Chat" },
          { src: "/projects/hawk-mobile-settings.png", alt: "HAWK Mobile Settings" },
        ],
        stack: ["React Native", "Expo", "Gemini"],
        year: "2025",
        chromeLabel: "HAWK-MOBILE.SRC",
        badgeLabel: "[ READY ]",
      },
    },
    {
      key: "pixelWidgets",
      github: t("toolbox.pixelWidgets.github"),
      preview: {
        images: [{ src: "/projects/ysstudiowidget.png", alt: "Google Pixel Home Screen Widgets" }],
        stack: ["Android", "Jetpack Glance"],
        year: "2025",
        chromeLabel: "PIXEL-WIDGETS.SRC",
        badgeLabel: "[ READY ]",
      },
    },
    { key: "pdf", comingSoon: true },
    { key: "tictactoe", comingSoon: true },
    { key: "flipcoin", comingSoon: true },
    {
      key: "rag",
      comingSoon: true,
      preview: {
        images: [
          { src: "/projects/rag-tool-document.png", alt: "RAG Chatbot Document Upload" },
          { src: "/projects/rag-tool-conversation.png", alt: "RAG Chatbot Conversational Interface" },
        ],
        stack: ["Next.js", "FastAPI", "RAG"],
        year: "2026",
        chromeLabel: "RAG-CHATBOT.PREVIEW",
        badgeLabel: "[ COMING SOON ]",
      },
    },
  ];

  return (
    <div className="bg-background text-foreground pb-16">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-1 focus:left-1 focus:z-[200] focus:bg-background focus:text-accent focus:px-3 focus:py-1 focus:text-xs focus:uppercase focus:tracking-widest focus:border focus:border-accent"
      >
        [ SKIP TO CONTENT ]
      </a>

      <ScrollProgress />

      <main id="main-content">

        {/* HERO */}
        <Section>
          <div className={MAX_CONTENT_WIDTH}>
            <motion.div {...MOTION.heroFade} className="space-y-8">

              <div className="flex items-center gap-3" aria-hidden="true">
                <span className="text-accent text-sm font-bold">{">"}</span>
                <span className="w-2 h-5 bg-accent animate-pulse" />
              </div>

              <figure className="w-[180px] sm:w-[200px] border border-border">
                <div className="border-b border-border px-2.5 py-1.5 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.18em] opacity-70">PROFILE.LOG</span>
                  <span className="text-[10px] uppercase tracking-widest text-accent/70">[ ACTIVE ]</span>
                </div>
                <img
                  src="/my-notion-face-transparent.png"
                  alt={`${profileName} profile`}
                  width={600}
                  height={600}
                  className="w-full aspect-square object-cover grayscale contrast-125 brightness-90 border-b border-border"
                  loading="eager"
                />
                <figcaption className="px-2.5 py-1.5 text-[10px] uppercase tracking-widest opacity-60">
                  [ VISUAL ID ]
                </figcaption>
              </figure>

              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl uppercase tracking-[0.2em] leading-tight min-h-[2em]">
                  {typedName}
                </h1>
                <p className="text-[11px] sm:text-xs uppercase tracking-widest opacity-60 mt-2 min-h-[1.5em]">
                  {typedSubtitle}
                </p>
              </div>

              <Divider />

              <div className={TEXT.profileSummary}>
                {typedAbout}{typedAbout === aboutText && <TypingCursor />}
              </div>

            </motion.div>
          </div>
        </Section>

        {/* EDUCATION */}
        <Section>
          <div className={MAX_CONTENT_WIDTH}>
            <SectionHeader>{t("home.educationTitle")}</SectionHeader>
            <div className="space-y-1">
              {education.map((item, i) => (
                <motion.div key={i} {...MOTION.listItem(i)} className={ROW_CLASS}>
                  <div className="grid grid-cols-12 gap-3 md:gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <span className={TEXT.metaLabel}>{item.date}</span>
                    </div>
                    <div className="col-span-9 sm:col-span-10 space-y-1">
                      <h3 className={TEXT.rowTitle}>{item.title}</h3>
                      <p className={TEXT.rowSub}>{item.org}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* WORK */}
        <Section>
          <div className={MAX_CONTENT_WIDTH}>
            <SectionHeader>{t("home.workTitle")}</SectionHeader>
            <div className="space-y-1">
              {work.map((item, i) => (
                <motion.div key={i} {...MOTION.listItem(i)} className={ROW_CLASS}>
                  <div className="grid grid-cols-12 gap-3 md:gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <span className={TEXT.metaLabel}>{item.date}</span>
                    </div>
                    <div className="col-span-9 sm:col-span-10 space-y-1">
                      <h3 className={TEXT.rowTitle}>{item.title}</h3>
                      <p className={TEXT.rowSub}>{item.org}</p>
                      {item.description && (
                        <p className={`${TEXT.rowSub} leading-relaxed max-w-3xl opacity-80`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* SKILLS */}
        <Section>
          <div className={MAX_CONTENT_WIDTH}>
            <SectionHeader>{t("home.skillsTitle")}</SectionHeader>
            <div className="grid sm:grid-cols-2 gap-10 md:gap-12">
              {(Object.entries(skills) as [keyof typeof skills, string[]][]).map(([key, items]) => (
                <motion.div key={key} {...MOTION.gridItem}>
                  <h3 className="text-[10px] md:text-xs uppercase tracking-widest text-accent mb-4">
                    {skillTitles[key]}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {items.map((skill) => (
                      <span key={skill} className={TEXT.chip}>{skill}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* GALLERY */}
        <Section>
          <div className={MAX_CONTENT_WIDTH}>
            <Gallery
              photos={photos}
              title={t("gallery.title")}
              subtitle={t("gallery.subtitle")}
            />
          </div>
        </Section>

        {/* PROJECTS */}
        <Section>
          <div className={MAX_CONTENT_WIDTH}>
            <SectionHeader>{t("toolbox.title")}</SectionHeader>
            <p className="text-[11px] sm:text-xs uppercase tracking-wider opacity-70 mb-8">
              {t("toolbox.subtitle")}
            </p>
            <div className="space-y-1">
              {tools.map((tool, i) => (
                <motion.div key={tool.key} {...MOTION.toolItem(i)} className={ROW_CLASS}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-accent text-[11px]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-xs sm:text-sm uppercase tracking-wide group-hover:text-accent transition-colors duration-300">
                          {t(`toolbox.${tool.key}.title`)}
                        </h3>
                        {tool.comingSoon && (
                          <span className="text-[9px] sm:text-[11px] uppercase tracking-widest border border-accent/50 text-accent/70 px-2 py-0.5">
                            {t(`toolbox.${tool.key}.comingSoon`)}
                          </span>
                        )}
                      </div>
                      <p className={`${TEXT.rowSub} max-w-lg leading-relaxed`}>
                        {t(`toolbox.${tool.key}.desc`)}
                      </p>
                    </div>
                    {tool.github && !tool.preview && (
                      <a
                        href={tool.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t(`toolbox.${tool.key}.title`)} on GitHub`}
                        className="text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-accent transition-all duration-300 shrink-0"
                      >
                        [ GITHUB ]
                      </a>
                    )}
                  </div>

                  {tool.preview && (
                    <ProjectPreview
                      images={tool.preview.images}
                      githubUrl={tool.github}
                      stack={tool.preview.stack}
                      year={tool.preview.year}
                      chromeLabel={tool.preview.chromeLabel}
                      badgeLabel={tool.preview.badgeLabel}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* CONTACT / FOOTER */}
        <Section>
          <div className={MAX_CONTENT_WIDTH}>
            <div className="space-y-12 md:space-y-16">

              <motion.div {...MOTION.sectionFade} className="grid sm:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <h2 className={TEXT.sectionHeader}>
                    {"// "}{t("profile.locationTitle").split(",")[1]?.trim() || "LOCATION"}
                  </h2>
                  <div className={TEXT.locationInfo}>
                    <p>{t("profile.location")}</p>
                  </div>
                </div>

                <div>
                  <h2 className={TEXT.sectionHeader}>
                    {"// "}{t("about.contactTitle")}
                  </h2>
                  <div className="space-y-3">
                    {[
                      { href: "mailto:hello@yohanncch.studio", label: "Send email to hello@yohanncch.studio", text: "HELLO@YOHANNCCH.STUDIO" },
                      { href: "https://github.com/Yohvnn", target: "_blank", label: "Yohann's GitHub profile", text: "GITHUB" },
                      { href: "https://linkedin.com/in/yohann-ccw", target: "_blank", label: "Yohann's LinkedIn profile", text: "LINKEDIN" },
                      { href: "https://www.strava.com/athletes/yohanncch", target: "_blank", label: "Yohann's Strava profile", text: "STRAVA" },
                    ].map(({ href, target, label, text }) => (
                      <a
                        key={href}
                        href={href}
                        target={target}
                        rel={target ? "noopener noreferrer" : undefined}
                        aria-label={label}
                        className={TEXT.contactLink}
                      >
                        <span className="text-accent opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 mr-1" aria-hidden="true">{"→"}</span>
                        {text}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="border-t border-border pt-8">
                <p className={TEXT.mutedParagraph}>{t("about.description")}</p>
              </div>

              <div className="pt-4 border-t border-border">
                <p className={TEXT.footer}>
                  {t("home.copyright", { year: new Date().getFullYear() })}
                </p>
              </div>

            </div>
          </div>
        </Section>

      </main>

      <CliToolbar />
    </div>
  );
}
