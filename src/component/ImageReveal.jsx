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

    "/imageseven.png",

    "/imagenine.png",
    "/imagenine.png",
    "/imagenine.png",
    "/imagenine.png",
    "/imagenine.png",
    "/imagenine.png",
  ];
  const spotlightImagesRef = useRef(null);
  const maskContainerRef = useRef(null);
  const maskImageRef = useRef(null);
  const headlineElsRef = useRef([]);

  // Precompute constants (only runs once)
  const { textBlocks, headlineStart, headlineEnd } = useMemo(
    () => ({
      textBlocks: [
        {
          title: "Why community?",
          paragraphs: [
            "Whether you are a seasoned expert or an emerging talent, LQI 30.7 offers:",
            "A growing network of thought leaders who challenge conventional thinking.",
            "A launchpad for ideas, collaborations, and support.",
            "A space to grow continuously, gain exposure, and build influence.",
            "A chance to be part of something bigger than work, a shared purpose.",
          ],
        },
        {
          title: "What is in a name?",
          paragraphs: ["Etymology of LQI 30.7"],
        },
        // {
        //   title: "Why join LQI 30.7?",
        //   paragraphs: [
        //     "By joining LQI 30.7 you are accessing powerful ideas and bold collaboration, you get to learn, lead and be part of the stalwarts in digital and tech.",
        //     "Access powerful ideas and bold collaborations, learn, lead, and be visible among the best.",
        //     "Work on what matters, with those who make it better.",
        //     "Create a platform for collaboration and networking.",
        //     "Promote a culture of learning.",
        //     "Support student and developer innovation.",
        //     "Work with industry leaders to share knowledge and drive growth.",
        //     "Support continuous professional development.",
        //     "Leverage community insights to stay ahead of trends and improve market research.",
        //     "Build a selective talent community through hire by invitation.",
        //     "Foster learning and growth by engaging industry leaders to inspire and develop talent.",
        //     "Litmus7 plays a major role in retail consulting and AI-led retail transformation.",
        //     "Litmus7 is a global hub for retail thought leadership and innovation.",
        //     "Being part of LQI 30.7 gives you unlimited opportunities, including:",
        //     "Opportunities to shape the future.",
        //     "Better learning opportunities with knowledge sharing from leaders and deep technical experts.",
        //     "Elite Peer Network: Connect with top-tier minds driving transformation.",
        //     "Thought Leadership Opportunities: Express yourself, mentor, publish ideas, and influence tech and AI innovation.",
        //     "First Access to Trends & Insights: Stay ahead through curated intelligence.",
        //     "Innovation Empowerment: Pitch, connect, and refine disruptive ideas.",
        //     "Exclusive Career Opportunities: Strategic roles or projects within the network.",
        //   ],
        // },
        {
          title: "Are you a student?",
          paragraphs: [
            "Mentorship by Experts: Learn from leaders who've shaped industry success.",
            "Real-World Exposure: Live case challenges, research projects, and idea labs.",
            "Skill Building & Certification: Practical, future-focused skills.",
            "Visibility & Recognition: Stand out to recruiters and mentors.",
            "Career Pathways: Fast-track entry into community partner companies.",
          ],
        },
        // {
        //   title: "How to join?",
        //   paragraphs: [
        //     "We welcome experienced professionals with deep technical expertise and a strong track record.",
        //     "You must be passionate about technology and ready to help shape the future.",
        //     "If you get an invitation, it means a like-minded professional believes you can add value.",
        //     "Ideal members have demonstrated excellence in innovative technologies.",
        //     "A proficient understanding of retail domain and business is ideal, but diverse backgrounds are welcome.",
        //     "A passion for sharing knowledge, mentoring, and driving meaningful change.",
        //     "A solution-oriented, innovative, forward-thinking mindset.",
        //     "Click the link below to express interest and provide your details.",
        //     "We will check your fitment and update you.",
        //     "Subscribe to our social channels and community platform to stay updated.",
        //     "We will run webinars, fire-side chats, workshops, hackathons, and more.",
        //   ],
        // },
        {
          title: "Who's Behind LQI 30.7?",
          paragraphs: [
            "LQI 30.7 is powered by Litmus7, a global leader in retail-led transformation.",
            "This is not just our initiative — it is your platform.",
            "Litmus7 provides the foundation, resources, and vision.",
            "The growth, strength, and success of this community comes from you, the members.",
            "Together, we create a quotient that defines what is next.",
          ],
        },
      ], // three blocks
      headlineStart: 0.0,
      headlineEnd: 0.5,
    }),
    []
  );

  // Ref setter for headlines
  const setHeadlineRef = useCallback((el, index) => {
    if (el) headlineElsRef.current[index] = el;
  }, []);

  // Main GSAP animation update logic
  const handleUpdate = useCallback(
    (self) => {
      const spotlightImages = spotlightImagesRef.current;
      const maskContainer = maskContainerRef.current;
      const maskImage = maskImageRef.current;
      const headlineEls = headlineElsRef.current;

      const totalHeadlines = headlineEls.length;
      const perHeadline = (headlineEnd - headlineStart) / totalHeadlines;

      const progress = self.progress;

      // Headline opacity control
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

      // Spotlight vertical movement
      if (progress >= 0 && progress < 0.5) {
        const imageMoveProgress = progress / 0.5;
        const startY = 5;
        const endY = -100;
        const currentY = startY + (endY - startY) * imageMoveProgress;
        gsap.set(spotlightImages, { y: `${currentY}%`, overwrite: "auto" });
      } else if (progress >= 0.5) {
        gsap.set(spotlightImages, { y: `-100%`, overwrite: "auto" });
      }

      // Mask scaling
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
    },
    [headlineStart, headlineEnd]
  );

  // Effect to setup ScrollTrigger + Lenis
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
            <h1>{block.title}</h1>
            {block.paragraphs.map((para, pIndex) => (
              <p key={pIndex}>{para}</p>
            ))}
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
          <img
            loading="lazy"
            className="imagereveal_banner"
            src="/spotlightbanner.webp"
            alt="dr"
            ref={maskImageRef}
          />
          <div className="join_container">
            <h1 className="banner_text">be the one to join</h1>
            <button
              onClick={() =>
                (window.location.href =
                  "https://forms.cloud.microsoft/pages/responsepage.aspx?id=0QyJDJvRYU6SM9QVMV1Ex253J0F_AUhJsp7TZZx-3wRUNUJaWTBaU1JQTllTNVFFRjZSRTZRM1VQQy4u&route=shorturl")
              }
              className="join_button"
            >
              {" "}
              Join Now{" "}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ImageReveal);
