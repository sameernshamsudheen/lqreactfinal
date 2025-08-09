import "./style.css";
import gsap from "gsap";
import Lenis from "lenis";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
gsap.registerPlugin(ScrollTrigger);

const ImageReveal = () => {
  const navigate = useNavigate();
  const spotlightImagesRef = useRef(null);
  const maskContainerRef = useRef(null);
  const maskImageRef = useRef(null);
  const headlineElsRef = useRef([]);

  useEffect(() => {
    // Disable smooth scroll on mobile (width <= 768px) for performance
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const lenisInstance = new Lenis({
      smooth: !isMobile,
    });

    lenisInstance.on("scroll", ScrollTrigger.update);

    const rafCallback = (time) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    const spotlightImages = spotlightImagesRef.current;
    const maskContainer = maskContainerRef.current;
    const maskImage = maskImageRef.current;
    const headlineEls = headlineElsRef.current;

    const lastOpacities = new Array(headlineEls.length).fill(null);

    let lastMaskSize = "";
    let lastImageScale = null;
    let lastSpotlightY = null;

    const st = ScrollTrigger.create({
      trigger: ".image_revealsection",
      start: "top top",
      end: `+=${window.innerHeight * 7}px`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      markers: false,

      onUpdate: (self) => {
        const progress = self.progress;

        // Animate headline opacity efficiently
        const headlineStart = 0.0;
        const headlineEnd = 0.5;
        const totalHeadlines = headlineEls.length;
        const perHeadline = (headlineEnd - headlineStart) / totalHeadlines;

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

          if (lastOpacities[index] !== opacity) {
            el.style.opacity = opacity;
            lastOpacities[index] = opacity;
          }
        });

        // Animate spotlight images Y position
        let currentY;
        if (progress >= 0 && progress < 0.5) {
          const imageMoveProgress = progress / 0.5;
          const startY = 5;
          const endY = -100;
          currentY = startY + (endY - startY) * imageMoveProgress;
        } else if (progress >= 0.5) {
          currentY = -100;
        }
        if (lastSpotlightY !== currentY) {
          gsap.set(spotlightImages, { y: `${currentY}%` });
          lastSpotlightY = currentY;
        }

        // Animate mask container and mask image scale
        if (progress > 0.5 && progress < 0.8) {
          const maskProgress = (progress - 0.5) / 0.3;
          const maskSize = `${maskProgress * 450}%`;
          const imageScale = 1.5 - maskProgress * 0.5;

          if (lastMaskSize !== maskSize) {
            maskContainer.style.setProperty("-webkit-mask-size", maskSize);
            maskContainer.style.setProperty("mask-size", maskSize);
            lastMaskSize = maskSize;
          }
          if (lastImageScale !== imageScale) {
            gsap.set(maskImage, { scale: imageScale });
            lastImageScale = imageScale;
          }
        } else if (progress <= 0.5) {
          if (lastMaskSize !== "0%") {
            maskContainer.style.setProperty("-webkit-mask-size", "0%");
            maskContainer.style.setProperty("mask-size", "0%");
            lastMaskSize = "0%";
          }
          if (lastImageScale !== 1.5) {
            gsap.set(maskImage, { scale: 1.5 });
            lastImageScale = 1.5;
          }
        } else if (progress >= 0.8) {
          if (lastMaskSize !== "450%") {
            maskContainer.style.setProperty("-webkit-mask-size", "450%");
            maskContainer.style.setProperty("mask-size", "450%");
            lastMaskSize = "450%";
          }
          if (lastImageScale !== 1) {
            gsap.set(maskImage, { scale: 1 });
            lastImageScale = 1;
          }
        }
      },
    });

    return () => {
      st.kill();
      lenisInstance.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  return (
    <div>
      <section className="image_revealsection">
        <div className="image_reveal_text_container headline-sequence">
          {[1, 2, 3].map((i) => (
            <div
              className="text_block"
              key={i}
              ref={(el) => (headlineElsRef.current[i - 1] = el)}
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
          <div className="image_revealrow">
            <img loading="lazy" src="/imageone.webp" />
            <img loading="lazy" src="/imagetwo.webp" />
          </div>
          <div className="image_revealrow">
            <img loading="lazy" src="/imagethree.webp" />
            <img loading="lazy" src="/imagefour.webp" />
          </div>
          <div className="image_revealrow">
            <img loading="lazy" src="/imagefive.webp" />
            <img loading="lazy" src="/imagesix.webp" />
          </div>
          <div className="image_revealrow">
            <img loading="lazy" src="/imageseven.webp" />
            <img loading="lazy" src="/imageeight.webp" />
          </div>
          <div className="image_revealrow">
            <img loading="lazy" src="/imagenine.webp" />
            <img loading="lazy" src="/imagesix.webp" />
          </div>
          <div className="image_revealrow">
            <img loading="lazy" src="/imagefive.webp" />
            <img loading="lazy" src="/imagesix.webp" />
          </div>
          <div className="image_revealrow">
            <img loading="lazy" src="/imagefive.webp" />
            <img loading="lazy" src="/imagesix.webp" />
          </div>
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
    </div>
  );
};

export default ImageReveal;
