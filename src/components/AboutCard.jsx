import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import aboutData from "../../data/about.json";
import { bracketed, treeItem } from "../constants/symbols";
import {
  formatExactCount,
  formatScaledNumber,
  formatTenureExact,
  formatTenureYears,
  liveTokenTotal,
  parseLocalDate,
} from "../utils/liveStats";

const useTickingNow = (enabled) => {
  const shouldReduceMotion = useReducedMotion();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!enabled || shouldReduceMotion) return undefined;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [enabled, shouldReduceMotion]);

  return now;
};

const LiveStatValue = ({ display, exact, suffix }) => {
  const ref = useRef(null);
  const openRef = useRef(false);
  const [tip, setTip] = useState(null);

  const updateTip = () => {
    const el = ref.current;
    if (!el || !openRef.current) return;
    const rect = el.getBoundingClientRect();
    const gap = 8;
    const placeAbove = rect.top > 96;
    setTip({
      top: placeAbove ? rect.top - gap : rect.bottom + gap,
      left: rect.right,
      placeAbove,
    });
  };

  const showTip = () => {
    openRef.current = true;
    updateTip();
  };

  const hideTip = () => {
    openRef.current = false;
    setTip(null);
  };

  useLayoutEffect(() => {
    updateTip();
  }, [display, exact]);

  useEffect(() => {
    if (!tip) return undefined;
    window.addEventListener("scroll", hideTip, true);
    window.addEventListener("resize", hideTip);
    return () => {
      window.removeEventListener("scroll", hideTip, true);
      window.removeEventListener("resize", hideTip);
    };
  }, [tip]);

  return (
    <span
      ref={ref}
      className="tui-stat-live tui-stat-value text-fg font-medium shrink-0 text-right"
      aria-label={`${display}${suffix ? ` ${suffix}` : ""}. ${exact}`}
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      <span>{display}</span>
      {suffix && (
        <span className="text-muted text-xs ml-1"> {suffix}</span>
      )}
      {tip &&
        createPortal(
          <span
            className="tui-stat-live-tip"
            role="tooltip"
            aria-hidden="true"
            style={{
              top: tip.top,
              left: tip.left,
              transform: tip.placeAbove
                ? "translate(-100%, -100%)"
                : "translate(-100%, 0)",
            }}
          >
            {exact}
          </span>,
          document.body,
        )}
    </span>
  );
};

const LiveTenureValue = ({ startDate, suffix }) => {
  const start = parseLocalDate(startDate);
  const now = useTickingNow(Boolean(start));
  return (
    <LiveStatValue
      display={formatTenureYears(start, now)}
      exact={formatTenureExact(start, now)}
      suffix={suffix}
    />
  );
};

const LiveTokenValue = ({ stats, suffix }) => {
  const now = useTickingNow(true);
  const total = liveTokenTotal(stats, now);
  return (
    <LiveStatValue
      display={formatScaledNumber(total)}
      exact={`${formatExactCount(total)} tokens`}
      suffix={suffix}
    />
  );
};

const AboutCard = ({ onFlip }) => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [openStatKey, setOpenStatKey] = useState(null);
  const [backMode, setBackMode] = useState("ai");
  const [openResumeSections, setOpenResumeSections] = useState({
    experience: true,
    skills: true,
    education: true,
    leadership: true,
    credentials: true,
    interests: true,
  });
  const [showFrontTopShadow, setShowFrontTopShadow] = useState(false);
  const [showFrontBottomShadow, setShowFrontBottomShadow] = useState(false);
  const [showBackTopShadow, setShowBackTopShadow] = useState(false);
  const [showBackBottomShadow, setShowBackBottomShadow] = useState(false);
  const frontScrollRef = useRef(null);
  const backScrollRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Keep the terminal-style scroll edge fades in sync with each face.
  useEffect(() => {
    const checkScroll = (
      ref,
      setTopShadow,
      setBottomShadow,
      isAvatar = false,
    ) => {
      if (!ref.current) return;
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      const isScrollable = scrollHeight > clientHeight;

      if (isAvatar) {
        // Avoid darkening the portrait for tiny scroll adjustments.
        const avatarHeight = 200; // approximate avatar + margins
        const isAvatarBeingCutOff = scrollTop > 48 && scrollTop < avatarHeight;
        setTopShadow(isScrollable && isAvatarBeingCutOff);
      } else {
        const isAtTop = scrollTop < 1;
        setTopShadow(isScrollable && !isAtTop);
      }

      const isAtBottom = scrollHeight - scrollTop - clientHeight < 1;
      setBottomShadow(isScrollable && !isAtBottom);
    };

    const handleFrontScroll = () =>
      checkScroll(
        frontScrollRef,
        setShowFrontTopShadow,
        setShowFrontBottomShadow,
        true,
      );
    const handleBackScroll = () =>
      checkScroll(
        backScrollRef,
        setShowBackTopShadow,
        setShowBackBottomShadow,
        false,
      );

    const frontEl = frontScrollRef.current;
    const backEl = backScrollRef.current;

    if (frontEl) {
      handleFrontScroll();
      frontEl.addEventListener("scroll", handleFrontScroll, { passive: true });
    }
    if (backEl) {
      handleBackScroll();
      backEl.addEventListener("scroll", handleBackScroll, { passive: true });
    }

    const handleResize = () => {
      handleFrontScroll();
      handleBackScroll();
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (frontEl) frontEl.removeEventListener("scroll", handleFrontScroll);
      if (backEl) backEl.removeEventListener("scroll", handleBackScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const calculateYears = () => {
    if (!aboutData.startDate) return "6+";
    const start = new Date(aboutData.startDate);
    const now = new Date();
    const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
    return years.toFixed(1);
  };

  // Calculate terminal hours (2hrs/day, 5 days/week since terminalStartDate)
  const calculateTerminalHours = () => {
    if (!aboutData.terminalStartDate) return "14k";
    const start = new Date(aboutData.terminalStartDate);
    const now = new Date();
    const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const hours = weeks * 5 * 2; // 5 days per week, 2 hours per day
    return hours >= 1000 ? `${(hours / 1000).toFixed(1)}k` : hours.toString();
  };

  const getStatValue = (stat) => {
    if (stat.value === "auto-years") return calculateYears();
    if (stat.value === "auto-terminal") return calculateTerminalHours();
    if (stat.value === "auto-github") {
      return aboutData.cachedGithubStats?.totalLines || "~50k";
    }
    if (stat.value === "auto-repos") {
      return aboutData.cachedGithubStats?.repoCount?.toString() || "15+";
    }
    if (stat.value === "auto-projects") {
      return (
        aboutData.cachedLocalStats?.projectCount?.toString() ||
        aboutData.cachedGithubStats?.repoCount?.toString() ||
        "15+"
      );
    }
    if (stat.value === "auto-agent-systems") {
      return aboutData.cachedLocalStats?.agentSystemCount?.toString() || "6";
    }
    if (stat.value === "auto-ai-ide-total") {
      return aboutData.cachedLocalStats?.aiIdeTokenTotal || "10B+";
    }
    if (stat.value === "auto-ai-ide-monthly") {
      return aboutData.cachedLocalStats?.aiIdeMonthlyPace || "1B+";
    }
    return stat.value;
  };

  const getStatKey = (stat, index) =>
    `${stat.label || stat.value}-${index}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

  const getStatDetail = (stat) => {
    if (!stat.detail) return "";

    const aiAidedProjectCount =
      aboutData.cachedLocalStats?.aiAidedProjectCount?.toString() || "13";
    const aiIdeMonthlyPace =
      aboutData.cachedLocalStats?.aiIdeMonthlyPace || "1B+";

    return stat.detail
      .replace("auto-ai-projects", aiAidedProjectCount)
      .replace("auto-ai-ide-monthly", aiIdeMonthlyPace);
  };

  const handleStatToggle = (event, statKey, isOpen) => {
    const row = event.currentTarget.closest(".tui-stat-row");
    setOpenStatKey(isOpen ? null : statKey);

    if (!isOpen) {
      window.setTimeout(
        () => {
          row?.scrollIntoView({
            block: "nearest",
            behavior: shouldReduceMotion ? "auto" : "smooth",
          });
        },
        shouldReduceMotion ? 0 : 180,
      );
    }
  };

  const toggleResumeSection = (sectionKey) => {
    setOpenResumeSections((currentSections) => ({
      ...currentSections,
      [sectionKey]: !currentSections[sectionKey],
    }));
  };

  const renderResumeSection = (sectionKey, label, children) => {
    const isOpen = openResumeSections[sectionKey];
    const buttonId = `resume-section-button-${sectionKey}`;
    const contentId = `resume-section-content-${sectionKey}`;

    return (
      <div>
        <button
          type="button"
          id={buttonId}
          className="tui-about-section-trigger text-fg font-semibold mb-3 text-sm sm:text-base font-mono"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => toggleResumeSection(sectionKey)}
        >
          <span className="text-accent" aria-hidden="true">
            {isOpen ? "▼" : "▶"}
          </span>
          <span>{label}</span>
        </button>
        {isOpen && (
          <div
            id={contentId}
            role="region"
            aria-labelledby={buttonId}
          >
            {children}
          </div>
        )}
      </div>
    );
  };

  const handleFlip = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    onFlip?.(nextFlipped);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    navigate("/");
  };

  const aiProfile = aboutData.back.aiProfile;

  return (
    <div className="flex justify-center w-full py-4">
      <motion.div
        className="tui-about-card relative w-full max-w-2xl max-h-[min(42rem,calc(100svh-8rem))] perspective-1000 pointer-events-auto"
      >
        <motion.div
          className="relative w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Front of card */}
          <motion.div
            className="tui-about-face relative w-full backface-hidden px-5 pt-5 pb-0 sm:px-7 sm:pt-6 sm:pb-0"
            style={{
              transform: "rotateY(0deg)",
              pointerEvents: isFlipped ? "none" : "auto",
              zIndex: isFlipped ? 1 : 2,
            }}
          >
            {/* Close button */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 pointer-events-auto">
              <button
                type="button"
                onClick={handleClose}
                className="tui-action min-w-10 min-h-10 inline-flex items-center justify-center border border-line/70 bg-card-bg font-mono text-muted text-sm"
                aria-label="Close and return home"
              >
                <span className="tui-action-content">[×]</span>
              </button>
            </div>

            <div className="flex flex-col">
              {/* Top shadow - fixed at top of scroll area, avatar-width, accounting for scrollbar */}
              <div
                className="absolute top-6 left-1/2 w-36 sm:w-40 h-8 pointer-events-none z-20 transition-opacity duration-200"
                style={{
                  background:
                    "linear-gradient(to bottom, var(--about-face-bg) 0%, transparent 100%)",
                  transform: "translateX(calc(-50% - 4px))",
                  opacity: showFrontTopShadow ? 1 : 0,
                }}
              ></div>

              {/* Scrollable content anchored to top */}
              <div
                ref={frontScrollRef}
                className="min-h-0 overflow-y-auto ascii-scrollbar pr-1 sm:pr-2"
                role="region"
                aria-label="About summary stats"
                tabIndex={0}
              >
                <div className="mb-3 flex justify-center">
                  <div className="tui-avatar-frame w-28 h-28 sm:w-32 sm:h-32 overflow-hidden">
                    <img
                      src="/avatar-336.png"
                      srcSet="/avatar-336.png 1x, /avatar-672.png 2x"
                      alt="Tucker Craig"
                      width="336"
                      height="336"
                      className="w-full h-full object-cover tui-dither"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Name and Role */}
                <h2 className="text-2xl sm:text-3xl font-bold text-fg mb-1 font-mono text-center">
                  {aboutData.name}
                </h2>
                <p className="text-accent font-medium mb-1 font-mono text-center text-sm sm:text-lg">
                  {aboutData.role}
                </p>
                <p className="text-muted text-sm sm:text-base mb-2 text-center font-mono">
                  {aboutData.education}
                </p>

                <div className="tui-stat-list">
                  <div className="text-[0.82rem] sm:text-[0.9rem] font-mono">
                    {aboutData.front.stats.map((stat, index) => {
                      const statKey = getStatKey(stat, index);
                      const detail = getStatDetail(stat);
                      const isOpen = openStatKey === statKey;
                      const buttonId = `about-stat-button-${statKey}`;
                      const detailId = `about-stat-detail-${statKey}`;

                      return (
                        <div
                          key={statKey}
                          className="tui-stat-row"
                          data-open={isOpen ? "true" : "false"}
                        >
                          <button
                            type="button"
                            id={buttonId}
                            className="tui-stat-trigger"
                            aria-expanded={isOpen}
                            aria-controls={detailId}
                            onClick={(event) =>
                              handleStatToggle(event, statKey, isOpen)
                            }
                          >
                            <span className="tui-stat-label text-muted min-w-0">
                              <span
                                className="tui-stat-marker text-accent"
                                aria-hidden="true"
                              >
                                ▸
                              </span>
                              <span>{stat.label}</span>
                            </span>
                            {stat.value === "auto-years" ? (
                              <LiveTenureValue
                                startDate={aboutData.startDate}
                                suffix={stat.suffix}
                              />
                            ) : stat.value === "auto-ai-ide-total" ? (
                              <LiveTokenValue
                                stats={aboutData.cachedLocalStats}
                                suffix={stat.suffix}
                              />
                            ) : (
                              <span className="tui-stat-value text-fg font-medium shrink-0 text-right">
                                {getStatValue(stat)}
                                {stat.suffix && (
                                  <span className="text-muted text-xs ml-1">
                                    {" "}
                                    {stat.suffix}
                                  </span>
                                )}
                              </span>
                            )}
                          </button>

                          {isOpen && detail && (
                            <div
                              id={detailId}
                              role="region"
                              aria-labelledby={buttonId}
                              className="tui-stat-detail"
                            >
                              <div>{detail}</div>
                              {stat.cta?.to && (
                                <Link
                                  to={stat.cta.to}
                                  className="tui-stat-cta"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  {stat.cta.label}
                                </Link>
                              )}
                              {stat.cta?.href && (
                                <a
                                  href={stat.cta.href}
                                  className="tui-stat-cta"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  {stat.cta.label}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Flip hint at bottom */}
              <div className="tui-about-flip-footer relative shrink-0">
                <div
                  className="absolute bottom-full left-0 right-0 h-6 pointer-events-none transition-opacity duration-200"
                  style={{
                    background:
                      "linear-gradient(to top, var(--about-face-bg) 0%, transparent 100%)",
                    opacity: showFrontBottomShadow ? 1 : 0,
                  }}
                ></div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleFlip();
                  }}
                  className="tui-action tui-card-action flex w-fit mx-auto min-h-10 px-4 border border-line/70 bg-card-bg text-muted text-xs sm:text-sm text-center font-mono opacity-90"
                  aria-label="Flip card to the AI card and resume"
                >
                  <span className="tui-action-content">ai card / resume →</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Back of card */}
          <motion.div
            className="tui-about-face absolute inset-0 w-full h-full backface-hidden p-5 sm:p-7 md:p-8"
            style={{
              transform: "rotateY(180deg)",
              pointerEvents: isFlipped ? "auto" : "none",
              zIndex: isFlipped ? 2 : 1,
            }}
          >
            {/* Close button */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 pointer-events-auto">
              <button
                type="button"
                onClick={handleClose}
                className="tui-action min-w-10 min-h-10 inline-flex items-center justify-center border border-line/70 bg-card-bg font-mono text-muted text-sm"
                aria-label="Close and return home"
              >
                <span className="tui-action-content">[×]</span>
              </button>
            </div>

            <div className="h-full flex flex-col">
              <div className="relative border-b border-line/80 pb-2 pr-12">
                <h3 className="text-base sm:text-lg font-bold text-accent font-mono">
                  {bracketed(backMode === "ai" ? "ai card" : "resume")}
                </h3>
                <div
                  className="tui-about-mode-toggle mt-3"
                  role="tablist"
                  aria-label="About detail mode"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={backMode === "ai"}
                    className="tui-about-mode-button"
                    onClick={() => setBackMode("ai")}
                  >
                    ai card
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={backMode === "resume"}
                    className="tui-about-mode-button"
                    onClick={() => setBackMode("resume")}
                  >
                    resume
                  </button>
                </div>
                <div
                  className="absolute top-full left-0 right-0 h-6 pointer-events-none transition-opacity duration-200"
                  style={{
                    background:
                      "linear-gradient(to bottom, var(--about-face-bg) 0%, transparent 100%)",
                    opacity: showBackTopShadow ? 1 : 0,
                  }}
                ></div>
              </div>

              <div
                ref={backScrollRef}
                className="min-h-0 flex-1 space-y-4 sm:space-y-5 overflow-y-auto ascii-scrollbar pr-1 sm:pr-2 pt-5 pb-7 sm:pb-8"
                role="region"
                aria-label="About details"
                tabIndex={0}
              >
                {backMode === "ai" && aiProfile && (
                  <>
                    <div className="tui-ai-sheet">
                      <div className="tui-ai-kicker">applied ai</div>
                      <h4 className="tui-ai-title">{aiProfile.title}</h4>
                      <div className="tui-ai-tagline">{aiProfile.tagline}</div>
                      <p className="tui-ai-summary">{aiProfile.summary}</p>
                    </div>

                    <div className="tui-ai-stat-grid">
                      {aiProfile.stats.map((stat, index) => (
                        <div
                          key={`${stat.label}-${index}`}
                          className="tui-ai-stat"
                        >
                          <div className="tui-ai-stat-value">{stat.value}</div>
                          <div className="tui-ai-stat-label">{stat.label}</div>
                          <div className="tui-ai-stat-detail">
                            {stat.detail}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="text-fg font-semibold mb-3 text-sm sm:text-base font-mono">
                        {treeItem("recent proof")}
                      </h4>
                      <div className="space-y-3 text-sm sm:text-base">
                        {aiProfile.highlights.map((item, index) => (
                          <div
                            key={`${item.name}-${index}`}
                            className="tui-ai-highlight"
                          >
                            <div className="text-accent font-mono font-medium mb-1">
                              {item.name}
                            </div>
                            <div className="text-muted font-mono text-xs sm:text-sm leading-6">
                              {item.detail}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-fg font-semibold mb-3 text-sm sm:text-base font-mono">
                        {treeItem("working toolkit")}
                      </h4>
                      <div className="tui-ai-skill-cloud">
                        {aiProfile.skills.map((skill) => (
                          <span key={skill} className="tui-ai-skill">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-fg font-semibold mb-3 text-sm sm:text-base font-mono">
                        {treeItem("I know what to do when...")}
                      </h4>
                      <div className="tui-about-row space-y-2 text-sm sm:text-base text-muted font-mono border-l border-line/80 pl-3 mb-4">
                        {aiProfile.direction.map((item, index) => (
                          <div key={index} className="flex gap-2 leading-6">
                            <span className="text-accent shrink-0">-</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {backMode === "resume" && (
                  <>
                    {/* Bio */}
                    <div className="text-muted text-sm sm:text-base leading-7 font-mono">
                      {aboutData.back.bio}
                    </div>

                    {aboutData.back.experience?.length > 0 &&
                      renderResumeSection(
                        "experience",
                        "Experience",
                        <div className="space-y-4 text-sm sm:text-base">
                          {aboutData.back.experience.map((item, index) => (
                            <div
                              key={`${item.role}-${index}`}
                              className="tui-about-row border-l border-line/80 pl-3"
                            >
                              <div className="flex flex-col gap-0.5 font-mono sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                                <div className="text-accent font-medium">
                                  {item.role}
                                </div>
                                <div className="text-muted text-xs sm:text-sm shrink-0">
                                  {item.period}
                                </div>
                              </div>
                              <div className="text-muted font-mono text-xs sm:text-sm mb-2">
                                {item.org}
                                {item.location ? ` - ${item.location}` : ""}
                              </div>
                              <ul className="space-y-1.5 text-muted font-mono text-xs sm:text-sm leading-6">
                                {item.points.map((point, pointIndex) => (
                                  <li key={pointIndex} className="flex gap-2">
                                    <span className="text-accent shrink-0">
                                      -
                                    </span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>,
                      )}

                    {/* Skills by category */}
                    {renderResumeSection(
                      "skills",
                      "Skills",
                      <div className="space-y-3 text-sm sm:text-base">
                        {aboutData.back.skills.map((category, index) => (
                          <div
                            key={index}
                            className="tui-about-row border-l border-line/80 pl-3"
                          >
                            <div className="text-accent font-mono font-medium mb-1">
                              {category.category}
                            </div>
                            <div className="text-muted font-mono">
                              {category.items.join(", ")}
                            </div>
                          </div>
                        ))}
                      </div>,
                    )}

                    {aboutData.back.educationDetails?.length > 0 &&
                      renderResumeSection(
                        "education",
                        "Education",
                        <div className="space-y-2 text-sm sm:text-base">
                          {aboutData.back.educationDetails.map(
                            (item, index) => (
                              <div
                                key={`${item.school}-${index}`}
                                className="tui-about-row border-l border-line/80 pl-3 font-mono"
                              >
                                <div className="flex items-baseline justify-between gap-3">
                                  <span className="text-accent font-medium">
                                    {item.school}
                                  </span>
                                  <span className="text-muted text-xs sm:text-sm shrink-0">
                                    {item.period}
                                  </span>
                                </div>
                                <div className="text-muted text-xs sm:text-sm mt-1">
                                  {item.detail}
                                </div>
                              </div>
                            ),
                          )}
                        </div>,
                      )}

                    {aboutData.back.leadership?.length > 0 &&
                      renderResumeSection(
                        "leadership",
                        "Leadership",
                        <div className="space-y-2 text-sm sm:text-base">
                          {aboutData.back.leadership.map((item, index) => (
                            <div
                              key={`${item.role}-${index}`}
                              className="tui-about-row border-l border-line/80 pl-3 font-mono"
                            >
                              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                                <span className="text-accent font-medium">
                                  {item.role}
                                </span>
                                <span className="text-muted text-xs sm:text-sm shrink-0">
                                  {item.period}
                                </span>
                              </div>
                              <div className="text-muted text-xs sm:text-sm mt-1">
                                {item.org} - {item.detail}
                              </div>
                            </div>
                          ))}
                        </div>,
                      )}

                    {aboutData.back.badges?.length > 0 &&
                      renderResumeSection(
                        "credentials",
                        "Credentials",
                        <div className="tui-about-row space-y-2 text-sm sm:text-base border-l border-line/80 pl-3">
                          {aboutData.back.badges.map((badge, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center font-mono"
                            >
                              <span className="text-muted">{badge.name}</span>
                              <span className="text-accent">{badge.year}</span>
                            </div>
                          ))}
                        </div>,
                      )}

                    {aboutData.back.interests?.length > 0 &&
                      renderResumeSection(
                        "interests",
                        "Interests",
                        <div className="tui-about-row space-y-1 text-sm sm:text-base text-muted font-mono border-l border-line/80 pl-3 mb-4">
                          {aboutData.back.interests.map((interest, index) => (
                            <div key={index}>{interest}</div>
                          ))}
                        </div>,
                      )}
                  </>
                )}
              </div>

              <div className="tui-about-flip-footer relative shrink-0 border-t border-line/80">
                <div
                  className="absolute bottom-full left-0 right-0 h-6 pointer-events-none transition-opacity duration-200"
                  style={{
                    background:
                      "linear-gradient(to top, var(--about-face-bg) 0%, transparent 100%)",
                    opacity: showBackBottomShadow ? 1 : 0,
                  }}
                ></div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleFlip();
                  }}
                  className="tui-action tui-card-action flex w-fit mx-auto min-h-10 px-4 border border-line/70 bg-card-bg text-muted text-xs sm:text-sm text-center font-mono opacity-90"
                  aria-label="Flip card to see front"
                >
                  <span className="tui-action-content">← summary</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutCard;
