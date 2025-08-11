import "./style.css";
import gsap from "gsap";
import Lenis from "lenis";
import ScrollTrigger from "gsap/ScrollTrigger";
import React, { useEffect, useRef, useMemo, useCallback } from "react";

gsap.registerPlugin(ScrollTrigger);

const ImageReveal = () => {
  const revealImages = [
    "/imageone.png",
    "/imagetwo.png",
    "/imagethree.png",
    "/imagefour.png",
    "/imagefive.png",
    "/imagesix.png",
    "/imageseven.png",
    "/imageeight.png",
    "/imagenine.png",
    "/imageeleven.png",
    "/imagetwelve.png",
    "/imagethirteen.png",
      "/imagefourteen.png",
        "/imagefifteen.png",

  ];
  const spotlightImagesRef = useRef(null);
  const maskContainerRef = useRef(null);
  const maskImageRef = useRef(null);
  const headlineElsRef = useRef([]);
  const benefitsRef = useRef([]); // NEW

  const { textBlocks, headlineStart, headlineEnd } = useMemo(
    () => ({
      textBlocks: [
        {
          title: "Why community?",
          paragraph:
            "Whether you are a seasoned expert or an emerging talent, LQI 30.7 offers: A growing network of thought leaders who challenge conventional thinking. A launchpad for ideas, collaborations, and support. A space to grow continuously, gain exposure, and build influence. A chance to be part of something bigger than work, a shared purpose.",
        },
        {
          title: "What is in a name?",
          paragraph: "Etymology of LQI 30.7.",
        },
        {
          title: "Are you a student?",
          paragraph:
            "Mentorship by Experts: Learn from leaders who've shaped industry success. Real-World Exposure: Live case challenges, research projects, and idea labs. Skill Building & Certification: Practical, future-focused skills. Visibility & Recognition: Stand out to recruiters and mentors. Career Pathways: Fast-track entry into community partner companies.",
        },
        {
          title: "Who's Behind LQI 30.7?",
          paragraph:
            "LQI 30.7 is powered by Litmus7, a global leader in retail-led transformation. This is not just our initiative — it is your platform. Litmus7 provides the foundation, resources, and vision. The growth, strength, and success of this community comes from you, the members. Together, we create a quotient that defines what is next.",
        },
      ],
      headlineStart: 0.0,
      headlineEnd: 0.5,
    }),
    []
  );

  const setHeadlineRef = useCallback((el, index) => {
    if (el) headlineElsRef.current[index] = el;
  }, []);

  const handleUpdate = useCallback(
    (self) => {
      const spotlightImages = spotlightImagesRef.current;
      const maskContainer = maskContainerRef.current;
      const maskImage = maskImageRef.current;
      const headlineEls = headlineElsRef.current;
      const benefitsEl = benefitsRef.current;

      const totalHeadlines = headlineEls.length;
      const perHeadline = (headlineEnd - headlineStart) / totalHeadlines;

      const progress = self.progress;

      // --- Headline opacity ---
      headlineEls.forEach((el, index) => {
        const start = headlineStart + index * perHeadline;
        const end = start + perHeadline;

        let opacity = 0;
        if (progress >= start && progress < end) {
          const localProgress = (progress - start) / perHeadline;
          if (localProgress < 0.3) {
            opacity = localProgress / 0.3;
          } else if (localProgress > 0.7) {
            opacity = (1 - localProgress) / 0.3;
          } else {
            opacity = 1;
          }
        }
        el.style.opacity = opacity;
      });

      // --- Spotlight movement ---
      if (progress >= 0 && progress < 0.5) {
        const imageMoveProgress = progress / 0.5;

        // Speed factor: >1 faster, <1 slower
        const speedFactor = 1.5; // try 0.5 for slower, 2 for faster, etc.

        const startY = 5;
        const endY = -100;

        // Multiply progress by speedFactor and clamp max to 1 (so it doesn't overshoot)
        const adjustedProgress = Math.min(imageMoveProgress * speedFactor, 1);

        const currentY = startY + (endY - startY) * adjustedProgress;

        gsap.set(spotlightImages, { y: `${currentY}%`, overwrite: "auto" });
      } else if (progress >= 0.5) {
        gsap.set(spotlightImages, { y: `-100%`, overwrite: "auto" });
      }

      // --- Mask scaling ---
      if (progress > 0.5 && progress < 0.8) {
        const maskProgress = (progress - 0.5) / 0.3;
        const maskSize = `${maskProgress * 450}%`;
        const imageScale = 1.5 - maskProgress * 0.5;

        maskContainer.style.setProperty("-webkit-mask-size", maskSize);
        maskContainer.style.setProperty("mask-size", maskSize);
        gsap.set(maskImage, { scale: imageScale, overwrite: "auto" });
      } else if (progress <= 0.5) {
        maskContainer.style.setProperty("-webkit-mask-size", "0%");
        maskContainer.style.setProperty("mask-size", "0%");
        gsap.set(maskImage, { scale: 1.5, overwrite: "auto" });
      } else if (progress >= 0.8) {
        maskContainer.style.setProperty("-webkit-mask-size", "450%");
        maskContainer.style.setProperty("mask-size", "450%");
        gsap.set(maskImage, { scale: 1, overwrite: "auto" });
      }

      // --- Benefits fade in after mask is done ---
      if (benefitsEl) {
        if (progress >= 0.8) {
          // Map progress from 0.8–1.0 to fade 0–1
          const fadeProgress = (progress - 0.8) / 0.2;
          gsap.set(benefitsEl, {
            opacity: fadeProgress,
            y: (1 - fadeProgress) * 100, // slide up as it fades
            overwrite: "auto",
          });
        } else {
          gsap.set(benefitsEl, { opacity: 0, y: 100, overwrite: "auto" });
        }
      }
    },
    [headlineStart, headlineEnd]
  );

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const lenisInstance = new Lenis({ smooth: true });

    lenisInstance.on("scroll", ScrollTrigger.update);
    const rafCallback = (time) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    const st = ScrollTrigger.create({
      trigger: ".image_revealsection",
      start: "top top",
      end: `+=${window.innerHeight * 7}px`,
      pin: true,
      scrub: isMobile ? 0.5 : 1,
      markers: false,
      onUpdate: handleUpdate,
    });

    return () => {
      st.kill();
      lenisInstance.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, [handleUpdate]);

  return (
    <section className="image_revealsection">
      <div className="image_reveal_text_container headline-sequence">
        {textBlocks.map((block, i) => (
          <div
            className="text_block"
            key={i}
            ref={(el) => setHeadlineRef(el, i)}
          >
            <h1>{block?.title}</h1>
            <p>{block?.paragraph}</p>
          </div>
        ))}
      </div>

      <div ref={spotlightImagesRef} className="image_reveal_container">
        {Array.from({ length: Math.ceil(revealImages.length / 2) }).map(
          (_, rowIndex) => {
            const firstImg = revealImages[rowIndex * 2];
            const secondImg = revealImages[rowIndex * 2 + 1];
            return (
              <div className="image_revealrow" key={rowIndex}>
                {firstImg && <img src={firstImg} alt="" />}
                {secondImg && <img loading="lazy" src={secondImg} alt="" />}
              </div>
            );
          }
        )}
      </div>

      <div ref={maskContainerRef} className="mask-container">
        <div className="mask-img">
          <div
            loading="lazy"
            className="imagereveal_banner"
            style={{ backgroundColor: "black" }}
            alt="dr"
            ref={maskImageRef}
          >
            <div className="join_container">
              <img className="banner_text" src="/litmuslogo.webp" />
              <button
                onClick={() =>
                  (window.location.href =
                    "https://forms.cloud.microsoft/pages/responsepage.aspx?id=0QyJDJvRYU6SM9QVMV1Ex253J0F_AUhJsp7TZZx-3wRUNUJaWTBaU1JQTllTNVFFRjZSRTZRM1VQQy4u&route=shorturl")
                }
                className="join_button"
              >
                Join Now
              </button>
            </div>

            {/* NEW — Benefits animation items */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ImageReveal);
