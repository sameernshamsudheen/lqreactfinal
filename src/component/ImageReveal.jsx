import "./style.css";
import gsap from "gsap";
import Lenis from "lenis";
import ScrollTrigger from "gsap/ScrollTrigger";
import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const ImageReveal = () => {
  const spotlightImagesRef = useRef(null);
  const maskContainerRef = useRef(null);
  const maskImageRef = useRef(null);
  const headlineElsRef = useRef([]);

  // Precompute constants (only runs once)
  const { textBlocks, headlineStart, headlineEnd } = useMemo(
    () => ({
      textBlocks: [1, 2, 3], // three blocks
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
    const lenisInstance = new Lenis({ smooth: !isMobile });

    lenisInstance.on("scroll", ScrollTrigger.update);

    const rafCallback = (time) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    const st = ScrollTrigger.create({
      trigger: ".image_revealsection",
      start: "top top",
      end: `+=${window.innerHeight * 7}px`,
      pin: true,
      scrub: true,
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
        {textBlocks.map((i) => (
          <div
            className="text_block"
            key={i}
            ref={(el) => setHeadlineRef(el, i - 1)}
          >
            <h1>Text{i}</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem architecto labore unde harum assumenda temporibus
              deserunt, quidem dolor et sunt, voluptas eos illum consectetur.
              Repudiandae ratione incidunt maxime ipsam qui.
            </p>
          </div>
        ))}
      </div>

      <div ref={spotlightImagesRef} className="image_reveal_container">
        {[...Array(7)].map((_, rowIndex) => (
          <div className="image_revealrow" key={rowIndex}>
            <img loading="lazy" src="/imageone.webp" alt="" />
            <img loading="lazy" src="/imagetwo.webp" alt="" />
          </div>
        ))}
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
          <h1 className="banner_text">be the one to join</h1>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ImageReveal);
