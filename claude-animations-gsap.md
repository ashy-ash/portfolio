# GSAP Animation Style Guide

**Complete reference for all animation patterns used in the Flait website**

This style guide catalogs every animation pattern, providing reusable code snippets and implementation examples for use across any project.

---

## Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Animation Patterns](#animation-patterns)
   - [Blur Reveal](#1-blur-reveal)
   - [Fade Up](#2-fade-up)
   - [Fade Directional](#3-fade-directional)
   - [Scale Bounce](#4-scale-bounce)
   - [Section Expansion](#5-section-expansion)
   - [Stagger Cascade](#6-stagger-cascade)
   - [Scroll Scrub](#7-scroll-scrub)
   - [Scale + Rotate](#8-scale--rotate)
   - [Continuous Pulse](#9-continuous-pulse)
   - [Height Auto Accordion](#10-height-auto-accordion)
   - [Smooth Scroll](#11-smooth-scroll)
   - [Hover Text Slide](#12-hover-text-slide)
3. [Component Usage Examples](#component-usage-examples)
4. [Best Practices](#best-practices)
5. [Quick Reference](#quick-reference)

---

## Setup & Configuration

### Install Dependencies

```bash
npm install gsap@^3.13.0
```

### GSAP Configuration File

**File:** `src/utils/gsapConfig.js`

```jsx
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Default GSAP settings
export const gsapConfig = {
  ease: "power2.out",
  duration: 0.8,
  stagger: 0.15,
};

// Scroll animation defaults
export const scrollTriggerDefaults = {
  start: "top 80%",
  end: "bottom 20%",
  toggleActions: "play none none reverse",
};

// Animation presets
export const animations = {
  fadeUp: {
    opacity: 0,
    y: 50,
  },
  fadeDown: {
    opacity: 0,
    y: -50,
  },
  fadeLeft: {
    opacity: 0,
    x: -50,
  },
  fadeRight: {
    opacity: 0,
    x: 50,
  },
  scale: {
    opacity: 0,
    scale: 0.8,
  },
};

export { gsap, ScrollTrigger, ScrollToPlugin };
```

---

## Animation Patterns

---

### 1. Blur Reveal

**Character-by-character or word-by-word blur fade-in effect**

#### Visual Effect

Text characters/words start blurred and transparent, then sharpen and fade in sequentially.

#### When to Use

- Headlines and hero text
- Emphasis on important text
- Reading flow animation
- Storytelling sections

#### Implementation

**HTML Structure:**

```jsx
<h1 ref={headlineRef}>
  {"Your AI Travel Manager".split(" ").map((word, wordIndex, words) => (
    <span key={wordIndex} className="inline-block whitespace-nowrap">
      {word.split("").map((char, charIndex) => (
        <span key={charIndex} className="inline-block blur-char">
          {char}
        </span>
      ))}
      {wordIndex < words.length - 1 && (
        <span className="inline-block blur-char">&nbsp;</span>
      )}
    </span>
  ))}
</h1>
```

**Animation Code:**

```jsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from(headlineRef.current.querySelectorAll(".blur-char"), {
      filter: "blur(10px)",
      opacity: 0,
      duration: 0.8,
      stagger: 0.03,
      ease: "power2.out",
    });
  });

  return () => ctx.revert();
}, []);
```

**Scroll-Triggered Variant (Word-by-Word):**

```jsx
// Word-based blur reveal tied to scroll
gsap.from(textRef.current.querySelectorAll(".blur-word"), {
  filter: "blur(10px)",
  opacity: 0,
  stagger: 0.05,
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top bottom",
    end: "130% bottom",
    scrub: 1,
  },
});
```

#### Parameters

| Property   | Value                             | Purpose                |
| ---------- | --------------------------------- | ---------------------- |
| `filter`   | `blur(10px)`                      | Initial blur amount    |
| `opacity`  | `0`                               | Start transparent      |
| `duration` | `0.8s`                            | Animation length       |
| `stagger`  | `0.03s` (chars) / `0.05s` (words) | Delay between elements |
| `ease`     | `power2.out`                      | Easing function        |

#### Used In

- Hero headline (character-by-character)
- About section (word-by-word, scroll-scrubbed)

---

### 2. Fade Up

**Standard upward fade-in entrance animation**

#### Visual Effect

Element starts below final position with 0 opacity, then slides up while fading in.

#### When to Use

- Section titles
- Descriptions
- Forms
- Content blocks
- Default entrance animation

#### Implementation

**Basic Fade Up:**

```jsx
gsap.from(element, {
  ...animations.fadeUp, // { opacity: 0, y: 50 }
  duration: gsapConfig.duration,
  ease: gsapConfig.ease,
});
```

**Scroll-Triggered Fade Up:**

```jsx
gsap.from(titleRef.current, {
  ...animations.fadeUp,
  scrollTrigger: {
    trigger: titleRef.current,
    ...scrollTriggerDefaults,
  },
});
```

**With Delay:**

```jsx
gsap.from(descRef.current, {
  ...animations.fadeUp,
  duration: 0.8,
  delay: 0.4,
  ease: "power2.out",
});
```

#### Parameters

| Property   | Value        | Purpose             |
| ---------- | ------------ | ------------------- |
| `opacity`  | `0 → 1`      | Fade in             |
| `y`        | `50 → 0`     | Slide up 50px       |
| `duration` | `0.8s`       | Standard timing     |
| `ease`     | `power2.out` | Smooth deceleration |

#### Used In

- Hero description
- Hero form
- Section titles (How It Works, Features, Trust, CTA, FAQ)
- CTA description
- Nearly all text content

---

### 3. Fade Directional

**Fade-in with horizontal or vertical directional motion**

#### Visual Effect

Element enters from a specific direction (left, right, up, down) while fading in.

#### When to Use

- Creating visual flow
- Alternating patterns
- Directional emphasis
- Image/illustration entrances

#### Implementation

**Alternating Horizontal Slide:**

```jsx
gsap.from(featuresRef.current.children, {
  opacity: 0,
  x: (index) => (index % 2 === 0 ? -60 : 60), // Alternate directions
  y: 30,
  duration: 0.8,
  stagger: 0.15,
  ease: "power2.out",
  scrollTrigger: {
    trigger: featuresRef.current,
    ...scrollTriggerDefaults,
  },
});
```

**From Bottom (Illustration):**

```jsx
gsap.from(illustrationRef.current, {
  opacity: 0,
  y: 80,
  duration: 1,
  delay: 0.8,
  ease: "power2.out",
});
```

**Preset Variants:**

```jsx
// From left
gsap.from(element, {
  ...animations.fadeLeft, // { opacity: 0, x: -50 }
});

// From right
gsap.from(element, {
  ...animations.fadeRight, // { opacity: 0, x: 50 }
});

// From top
gsap.from(element, {
  ...animations.fadeDown, // { opacity: 0, y: -50 }
});
```

#### Parameters

| Property   | Values      | Purpose           |
| ---------- | ----------- | ----------------- |
| `x`        | `-60 to 60` | Horizontal offset |
| `y`        | `30 to 80`  | Vertical offset   |
| `opacity`  | `0 → 1`     | Fade in           |
| `duration` | `0.8s - 1s` | Animation length  |

#### Used In

- Feature items (alternating left/right)
- Hero illustration (from bottom)
- Mobile menu (from top)

---

### 4. Scale Bounce

**Scale entrance with elastic bounce effect**

#### Visual Effect

Element starts small and scales up with a bounce/overshoot at the end.

#### When to Use

- Playful interactions
- Icons
- Buttons
- Card entrances
- Drawing attention

#### Implementation

**Basic Scale Bounce:**

```jsx
gsap.from(cardsRef.current.children, {
  opacity: 0,
  y: 60,
  scale: 0.9,
  duration: 0.8,
  stagger: 0.2,
  ease: "back.out(1.2)",
  scrollTrigger: {
    trigger: cardsRef.current,
    ...scrollTriggerDefaults,
  },
});
```

**Icon Pop-In:**

```jsx
gsap.from(iconsRef.current.children, {
  opacity: 0,
  scale: 0.5,
  y: 20,
  duration: 0.6,
  stagger: 0.15,
  ease: "back.out(1.5)",
  scrollTrigger: {
    trigger: iconsRef.current,
    ...scrollTriggerDefaults,
  },
});
```

**Button Entrance:**

```jsx
gsap.from(buttonRef.current, {
  opacity: 0,
  scale: 0.8,
  duration: 0.6,
  delay: 0.6,
  ease: "back.out(1.5)",
  scrollTrigger: {
    trigger: sectionRef.current,
    ...scrollTriggerDefaults,
  },
});
```

#### Parameters

| Property  | Value                 | Purpose                    |
| --------- | --------------------- | -------------------------- |
| `scale`   | `0.5 - 0.9 → 1`       | Initial scale              |
| `opacity` | `0 → 1`               | Fade in                    |
| `ease`    | `back.out(1.2 - 1.5)` | Bounce intensity           |
| `y`       | `20 - 60`             | Vertical offset (optional) |

**Ease Values:**

- `back.out(1.2)` - Subtle bounce
- `back.out(1.5)` - Medium bounce
- `back.out(2.0)` - Strong bounce

#### Used In

- How It Works step cards
- Trust section icons
- CTA button
- FAQ items

---

### 5. Section Expansion

**Container width and border-radius animation on scroll**

#### Visual Effect

Section starts with rounded corners and limited width, then expands to full width with sharp corners as you scroll.

#### When to Use

- Section transitions
- Immersive scroll experiences
- Containerized to full-width reveals
- Background transitions

#### Implementation

```jsx
gsap.to(sectionRef.current, {
  maxWidth: "100vw",
  borderRadius: "0px",
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top bottom",
    end: "70% bottom",
    scrub: 1,
  },
});
```

**Initial CSS State:**

```jsx
<section
  ref={sectionRef}
  className="max-w-5xl mx-auto rounded-[60px]"
>
```

#### Parameters

| Property       | From → To               | Purpose                |
| -------------- | ----------------------- | ---------------------- |
| `maxWidth`     | `5xl (80rem)` → `100vw` | Expand width           |
| `borderRadius` | `60px` → `0px`          | Flatten corners        |
| `scrub`        | `1`                     | Tie to scroll position |

#### Scroll Trigger Settings

| Property | Value        | Purpose                            |
| -------- | ------------ | ---------------------------------- |
| `start`  | `top bottom` | Begin when section enters viewport |
| `end`    | `70% bottom` | Complete at 70% scroll             |
| `scrub`  | `1`          | Smooth scroll-tied animation       |

#### Used In

- How It Works section

---

### 6. Stagger Cascade

**Sequential animation of multiple elements**

#### Visual Effect

Children elements animate one after another with a time delay between each.

#### When to Use

- Lists of items
- Feature grids
- Navigation items
- Card layouts
- Any repeated elements

#### Implementation

**Standard Stagger:**

```jsx
gsap.from(containerRef.current.children, {
  opacity: 0,
  y: 30,
  duration: 0.6,
  stagger: 0.15,
  ease: "power2.out",
  scrollTrigger: {
    trigger: containerRef.current,
    ...scrollTriggerDefaults,
  },
});
```

**With Scale:**

```jsx
gsap.from(cardsRef.current.children, {
  opacity: 0,
  y: 60,
  scale: 0.9,
  duration: 0.8,
  stagger: 0.2,
  ease: "back.out(1.2)",
  scrollTrigger: {
    trigger: cardsRef.current,
    ...scrollTriggerDefaults,
  },
});
```

**Dynamic Function Stagger:**

```jsx
gsap.from(featuresRef.current.children, {
  opacity: 0,
  x: (index) => (index % 2 === 0 ? -60 : 60),
  y: 30,
  duration: 0.8,
  stagger: 0.15,
  ease: "power2.out",
});
```

**Character Stagger:**

```jsx
gsap.from(textRef.current.querySelectorAll(".char"), {
  filter: "blur(10px)",
  opacity: 0,
  duration: 0.8,
  stagger: 0.03, // Faster for characters
  ease: "power2.out",
});
```

#### Stagger Timing Guide

| Element Type   | Stagger Value  | Use Case                   |
| -------------- | -------------- | -------------------------- |
| Characters     | `0.02 - 0.03s` | Blur reveal, text effects  |
| Words          | `0.05 - 0.08s` | Word-by-word reveals       |
| Small UI items | `0.1 - 0.15s`  | Icons, badges, chips       |
| Cards/Features | `0.15 - 0.2s`  | Feature cards, grid items  |
| Large blocks   | `0.2 - 0.3s`   | Sections, major components |

#### Used In

- How It Works cards (0.2s)
- Feature items (0.15s)
- Trust icons (0.15s)
- FAQ items (0.1s)
- Hero blur text (0.03s)
- About blur words (0.05s)

---

### 7. Scroll Scrub

**Animation progress tied directly to scroll position**

#### Visual Effect

Animation advances/reverses based on scroll position rather than time.

#### When to Use

- Reading-pace animations
- Parallax effects
- Progress indicators
- Scroll-driven reveals
- Long-form content

#### Implementation

**Basic Scroll Scrub:**

```jsx
gsap.from(textRef.current.querySelectorAll(".blur-word"), {
  filter: "blur(10px)",
  opacity: 0,
  stagger: 0.05,
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top bottom",
    end: "130% bottom",
    scrub: 1, // Smooth scrubbing
  },
});
```

**Section Transform:**

```jsx
gsap.to(sectionRef.current, {
  maxWidth: "100vw",
  borderRadius: "0px",
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top bottom",
    end: "70% bottom",
    scrub: 1,
  },
});
```

#### Scrub Values

| Value  | Effect               | Use Case                    |
| ------ | -------------------- | --------------------------- |
| `true` | Instant scrub        | Precise 1:1 scroll tracking |
| `1`    | 1 second smoothing   | Smooth, subtle lag          |
| `2`    | 2 second smoothing   | More dramatic lag effect    |
| `0.5`  | 0.5 second smoothing | Tight but smooth            |

#### Scroll Trigger Range

```jsx
scrollTrigger: {
  start: 'top bottom',      // When top of element hits bottom of viewport
  end: '130% bottom',       // Extended range for long reveals
  scrub: 1,
}
```

**Common Start/End Patterns:**

- `start: 'top bottom'` → `end: '130% bottom'` - Long reveal (About text)
- `start: 'top bottom'` → `end: '70% bottom'` - Section expansion

#### Used In

- About section word blur reveal
- How It Works section expansion

---

### 8. Scale + Rotate

**Combined scale and rotation entrance**

#### Visual Effect

Element enters with both scaling and rotation, creating dynamic playful motion.

#### When to Use

- Illustrations
- Decorative elements
- Playful brand moments
- Image reveals

#### Implementation

```jsx
gsap.from(illustrationRef.current, {
  opacity: 0,
  scale: 0.8,
  rotation: -5,
  duration: 1,
  ease: "back.out(1.2)",
  scrollTrigger: {
    trigger: sectionRef.current,
    ...scrollTriggerDefaults,
  },
});
```

#### Parameters

| Property   | Value           | Purpose          |
| ---------- | --------------- | ---------------- |
| `scale`    | `0.8 → 1`       | Start smaller    |
| `rotation` | `-5 → 0`        | Slight tilt      |
| `opacity`  | `0 → 1`         | Fade in          |
| `duration` | `1s`            | Longer for drama |
| `ease`     | `back.out(1.2)` | Bounce effect    |

**Rotation Values:**

- `-5 to -10` - Subtle tilt left
- `5 to 10` - Subtle tilt right
- `-15 to 15` - Noticeable angle

#### Used In

- Trust section illustration

---

### 9. Continuous Pulse

**Infinite looping scale animation**

#### Visual Effect

Element continuously scales up and down to draw attention.

#### When to Use

- Call-to-action elements
- Notification indicators
- Drawing attention
- "Live" status indicators

#### Implementation

```jsx
gsap.to(iconRef.current, {
  scale: 1.1,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut",
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top 80%",
  },
});
```

**Variant: Opacity Pulse**

```jsx
gsap.to(element, {
  opacity: 0.6,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});
```

#### Parameters

| Property   | Value          | Purpose           |
| ---------- | -------------- | ----------------- |
| `scale`    | `1 ↔ 1.1`     | Subtle breathing  |
| `duration` | `1.5 - 2s`     | Slow, calm rhythm |
| `repeat`   | `-1`           | Infinite loop     |
| `yoyo`     | `true`         | Reverse on repeat |
| `ease`     | `power1.inOut` | Smooth transition |

**Timing Recommendations:**

- Fast pulse: `0.8 - 1s` (urgent)
- Medium pulse: `1.5s` (attention)
- Slow pulse: `2 - 3s` (ambient)

#### Used In

- CTA section WhatsApp icon

---

### 10. Height Auto Accordion

**Smooth height expansion/collapse**

#### Visual Effect

Content smoothly expands from height 0 to full height (auto) and vice versa.

#### When to Use

- FAQ sections
- Expandable panels
- Show/hide content
- Mobile menus

#### Implementation

```jsx
const [openIndex, setOpenIndex] = useState(null);

useEffect(() => {
  itemsRef.current.forEach((item, index) => {
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    if (answer && icon) {
      if (openIndex === index) {
        // Expand
        gsap.to(answer, {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
        // Rotate icon to X
        gsap.to(icon, {
          rotation: 45,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        // Collapse
        gsap.to(answer, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        });
        // Rotate icon to +
        gsap.to(icon, {
          rotation: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  });
}, [openIndex]);
```

**HTML Structure:**

```jsx
<div ref={(el) => (itemsRef.current[index] = el)}>
  <button onClick={() => setOpenIndex(openIndex === index ? null : index)}>
    <span>{item.question}</span>
    <svg className="faq-icon">{/* Plus icon */}</svg>
  </button>
  <div className="faq-answer" style={{ height: 0, opacity: 0 }}>
    <div>{item.answer}</div>
  </div>
</div>
```

#### Parameters

| Property   | Expand       | Collapse    | Purpose        |
| ---------- | ------------ | ----------- | -------------- |
| `height`   | `0 → auto`   | `auto → 0`  | Smooth resize  |
| `opacity`  | `0 → 1`      | `1 → 0`     | Fade content   |
| `duration` | `0.4s`       | `0.4s`      | Quick response |
| `ease`     | `power2.out` | `power2.in` | Acceleration   |

**Icon Rotation:**

- `rotation: 0` → Plus icon (+)
- `rotation: 45` → X icon (×)
- Duration: `0.3s` (slightly faster than height)

#### Used In

- FAQ section

---

### 11. Smooth Scroll

**Animated scroll to anchor links**

#### Visual Effect

Page smoothly scrolls to target element instead of instant jump.

#### When to Use

- Navigation links
- "Back to top" buttons
- Internal page links
- Skip to content

#### Implementation

```jsx
import { gsap, ScrollToPlugin } from "@/utils/gsapConfig";

const handleNavClick = (e, href) => {
  if (href.startsWith("/#")) {
    e.preventDefault();
    const hash = href.replace("/#", "");
    const target = document.querySelector(`#${hash}`);

    if (target) {
      gsap.to(window, {
        duration: 0.5,
        scrollTo: { y: target, offsetY: 80 },
        ease: "power2.out",
      });
    }
  }
};

// Usage
<a href="/#features" onClick={(e) => handleNavClick(e, "/#features")}>
  Features
</a>;
```

**Scroll to Top:**

```jsx
const scrollToTop = () => {
  gsap.to(window, {
    duration: 0.8,
    scrollTo: { y: 0 },
    ease: "power2.inOut",
  });
};
```

#### Parameters

| Property           | Value             | Purpose                 |
| ------------------ | ----------------- | ----------------------- |
| `duration`         | `0.5 - 0.8s`      | Scroll speed            |
| `scrollTo.y`       | Element or number | Target position         |
| `scrollTo.offsetY` | `80` (px)         | Offset for fixed header |
| `ease`             | `power2.out`      | Deceleration            |

**offsetY Calculation:**

- Fixed navbar height + desired spacing
- Example: `64px navbar + 16px spacing = 80px`

#### Used In

- Navbar navigation links
- Mobile menu links

---

### 12. Hover Text Slide

**Character-by-character text replacement on hover**

#### Visual Effect

On hover, characters slide up and fade out while new characters slide up from below to replace them.

#### When to Use

- Interactive buttons
- Navigation links
- Call-to-action elements
- Premium interactions

#### Implementation

**Full Component** (`src/components/AnimatedText.js`):

```jsx
"use client";

import { useRef } from "react";
import { gsap } from "@/utils/gsapConfig";

export default function AnimatedText({
  text,
  className = "",
  topEnterDelay = 0,
  topLeaveDelay = 0.2,
  bottomEnterDelay = 0.2,
  bottomLeaveDelay = 0,
  stagger = 0.02,
  duration = 0.2,
}) {
  const wrapperRef = useRef(null);

  const handleHover = (isEntering) => {
    if (!wrapperRef.current) return;

    const topChars = wrapperRef.current.querySelectorAll(".char-top");
    const bottomChars = wrapperRef.current.querySelectorAll(".char-bottom");

    gsap.killTweensOf([...topChars, ...bottomChars]);

    if (isEntering) {
      // Top text slides up and fades
      gsap.to(topChars, {
        y: -20,
        opacity: 0,
        duration,
        stagger,
        ease: "power2.in",
        delay: topEnterDelay,
      });

      // Bottom text slides up into view
      gsap.fromTo(
        bottomChars,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          stagger,
          ease: "power2.out",
          delay: bottomEnterDelay,
        },
      );
    } else {
      // Reverse animation
      gsap.to(bottomChars, {
        y: 20,
        opacity: 0,
        duration,
        stagger,
        ease: "power2.in",
        delay: bottomLeaveDelay,
      });

      gsap.to(topChars, {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease: "power2.out",
        delay: topLeaveDelay,
      });
    }
  };

  return (
    <span
      ref={wrapperRef}
      className={`relative inline-block overflow-hidden ${className}`}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {/* Invisible spacer */}
      <span className="inline-flex invisible">
        {text.split("").map((char, idx) => (
          <span key={`spacer-${idx}`} className="inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      {/* Top text - visible by default */}
      <span className="absolute top-0 left-0 inline-flex">
        {text.split("").map((char, idx) => (
          <span key={`top-${idx}`} className="char-top inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      {/* Bottom text - hidden below */}
      <span className="absolute top-0 left-0 inline-flex">
        {text.split("").map((char, idx) => (
          <span
            key={`bottom-${idx}`}
            className="char-bottom inline-block"
            style={{ transform: "translateY(20px)", opacity: 0 }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
}
```

**Usage:**

```jsx
import AnimatedText from '@/components/AnimatedText';

<button className="bg-blue-600 text-white px-6 py-3 rounded-full">
  <AnimatedText text="Get Updates" />
</button>

<a href="/about">
  <AnimatedText
    text="Learn More"
    stagger={0.03}
    duration={0.25}
  />
</a>
```

#### Props

| Prop               | Type   | Default  | Purpose                             |
| ------------------ | ------ | -------- | ----------------------------------- |
| `text`             | string | Required | Text to animate                     |
| `className`        | string | `""`     | Additional CSS classes              |
| `stagger`          | number | `0.02`   | Delay between characters            |
| `duration`         | number | `0.2`    | Animation duration                  |
| `topEnterDelay`    | number | `0`      | Delay before top exits on hover     |
| `bottomEnterDelay` | number | `0.2`    | Delay before bottom enters on hover |
| `topLeaveDelay`    | number | `0.2`    | Delay before top returns on leave   |
| `bottomLeaveDelay` | number | `0`      | Delay before bottom exits on leave  |

#### Animation States

| State           | Top Text                   | Bottom Text                |
| --------------- | -------------------------- | -------------------------- |
| **Default**     | Visible (y: 0)             | Hidden below (y: 20)       |
| **Hover enter** | Slides up & fades (y: -20) | Slides up & appears (y: 0) |
| **Hover leave** | Returns to view (y: 0)     | Hides below (y: 20)        |

#### Key Techniques

- **Dual text layers** - Two copies at different positions
- **Invisible spacer** - Maintains container width
- **killTweensOf** - Prevents animation conflicts
- **Customizable delays** - Fine-tune timing overlap

#### Used In

- CTA buttons
- Navigation links
- Interactive elements

---

## Component Usage Examples

### Example 1: Animated Hero Section

```jsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, animations, gsapConfig } from "@/utils/gsapConfig";

export default function Hero() {
  const headlineRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Headline blur reveal
      gsap.from(headlineRef.current.querySelectorAll(".blur-char"), {
        filter: "blur(10px)",
        opacity: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "power2.out",
      });

      // 2. Description fade up
      gsap.from(descRef.current, {
        ...animations.fadeUp,
        duration: 0.8,
        delay: 0.4,
        ease: gsapConfig.ease,
      });

      // 3. CTA button scale bounce
      gsap.from(ctaRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        delay: 0.6,
        ease: "back.out(1.5)",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-20">
      <h1 ref={headlineRef}>{/* Character-wrapped text */}</h1>
      <p ref={descRef}>Description</p>
      <button ref={ctaRef}>Get Started</button>
    </section>
  );
}
```

### Example 2: Scroll-Triggered Feature Grid

```jsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, animations, scrollTriggerDefaults } from "@/utils/gsapConfig";

export default function Features() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title fade up
      gsap.from(titleRef.current, {
        ...animations.fadeUp,
        scrollTrigger: {
          trigger: titleRef.current,
          ...scrollTriggerDefaults,
        },
      });

      // Feature cards stagger with bounce
      gsap.from(gridRef.current.children, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: gridRef.current,
          ...scrollTriggerDefaults,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20">
      <h2 ref={titleRef}>Features</h2>
      <div ref={gridRef} className="grid md:grid-cols-3 gap-8">
        {/* Feature cards */}
      </div>
    </section>
  );
}
```

### Example 3: Interactive FAQ with Accordions

```jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { gsap, animations, scrollTriggerDefaults } from "@/utils/gsapConfig";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(itemsRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: itemsRef.current[0],
          ...scrollTriggerDefaults,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Accordion animations
  useEffect(() => {
    itemsRef.current.forEach((item, index) => {
      const answer = item?.querySelector(".faq-answer");
      const icon = item?.querySelector(".faq-icon");

      if (answer && icon) {
        if (openIndex === index) {
          gsap.to(answer, { height: "auto", opacity: 1, duration: 0.4 });
          gsap.to(icon, { rotation: 45, duration: 0.3 });
        } else {
          gsap.to(answer, { height: 0, opacity: 0, duration: 0.4 });
          gsap.to(icon, { rotation: 0, duration: 0.3 });
        }
      }
    });
  }, [openIndex]);

  return (
    <section ref={sectionRef}>
      {faqData.map((item, index) => (
        <div key={index} ref={(el) => (itemsRef.current[index] = el)}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            {item.question}
            <svg className="faq-icon">{/* Plus */}</svg>
          </button>
          <div className="faq-answer" style={{ height: 0, opacity: 0 }}>
            {item.answer}
          </div>
        </div>
      ))}
    </section>
  );
}
```

---

## Best Practices

### 1. Always Clean Up Animations

**Always use `gsap.context()` and clean up on unmount:**

```jsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // All animations here
  }, containerRef);

  return () => ctx.revert(); // Critical cleanup
}, []);
```

**Why:** Prevents memory leaks and animation conflicts on component unmount.

---

### 2. Use Configuration Presets

**Define once, reuse everywhere:**

```jsx
// gsapConfig.js
export const animations = {
  fadeUp: { opacity: 0, y: 50 },
  scale: { opacity: 0, scale: 0.8 },
};

// Component
gsap.from(element, {
  ...animations.fadeUp,
  scrollTrigger: { ... }
});
```

**Benefits:**

- Consistency across project
- Easy to update globally
- Cleaner component code

---

### 3. Optimize Performance

**GPU-Accelerated Properties** (fast):

- `opacity`
- `transform` (scale, rotate, translate)
- `filter` (use sparingly)

**Avoid Animating** (slow):

- `width` / `height` (unless using `will-change`)
- `top` / `left` / `right` / `bottom`
- `margin` / `padding`

**Performance Tip:**

```css
.animated-element {
  will-change: transform, opacity;
}
```

---

### 4. Respect User Preferences

**Check for reduced motion:**

```jsx
useEffect(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!prefersReducedMotion) {
    // Run animations
    const ctx = gsap.context(() => {
      // Animations here
    });
    return () => ctx.revert();
  }
}, []);
```

**Or disable specific effects:**

```jsx
const staggerValue = prefersReducedMotion ? 0 : 0.15;
const duration = prefersReducedMotion ? 0.2 : 0.8;
```

---

### 5. Debug with Markers

**Visualize ScrollTrigger points:**

```jsx
scrollTrigger: {
  trigger: element,
  start: "top 80%",
  end: "bottom 20%",
  markers: true,  // Shows start/end lines
  id: "my-trigger"  // Label in DevTools
}
```

**Remove before production!**

---

### 6. Text Splitting Best Practices

**Always use these patterns:**

```jsx
// Character split
text.split("").map((char, i) => (
  <span key={i} className="inline-block">
    {char === " " ? "\u00A0" : char}
  </span>
));

// Word split
text.split(" ").map((word, i) => (
  <span key={i} className="inline-block">
    {word}&nbsp;
  </span>
));
```

**Critical rules:**

- Use `className="inline-block"` on animated spans
- Use `\u00A0` or `&nbsp;` for spaces (not regular space)
- Add `whitespace-nowrap` to word containers if needed

---

### 7. Mobile Optimization

**Adjust for mobile:**

```jsx
const isMobile = window.innerWidth < 768;

gsap.from(cards, {
  opacity: 0,
  y: isMobile ? 30 : 60,
  stagger: isMobile ? 0.1 : 0.2,
  duration: isMobile ? 0.4 : 0.8,
});
```

**Or use media queries:**

```jsx
const mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {
  // Desktop animations
});

mm.add("(max-width: 767px)", () => {
  // Mobile animations
});
```

---

### 8. Kill Tweens on Interaction

**Prevent animation conflicts:**

```jsx
const handleHover = () => {
  gsap.killTweensOf(element); // Stop existing animations

  gsap.to(element, {
    scale: 1.1,
    duration: 0.3,
  });
};
```

**Used in:** AnimatedText component, hover effects

---

## Quick Reference

### Easing Functions

| Ease            | Effect              | Best For                     |
| --------------- | ------------------- | ---------------------------- |
| `power2.out`    | Smooth deceleration | Standard entrances, fade-ins |
| `power2.in`     | Smooth acceleration | Exits, hide animations       |
| `power2.inOut`  | Both                | Smooth transitions           |
| `back.out(1.2)` | Subtle overshoot    | Playful entrances            |
| `back.out(1.5)` | Medium bounce       | Attention-grabbing           |
| `back.out(2.0)` | Strong bounce       | Dramatic effects             |
| `power1.inOut`  | Linear-ish          | Infinite loops, pulses       |
| `sine.inOut`    | Very smooth         | Breathing animations         |

### Common Durations

| Duration     | Use Case                   |
| ------------ | -------------------------- |
| `0.2 - 0.3s` | Micro-interactions, hovers |
| `0.4 - 0.6s` | UI responses, accordions   |
| `0.8s`       | Standard entrances         |
| `1.0s`       | Dramatic reveals           |
| `1.5 - 2s`   | Infinite loops, pulses     |

### Stagger Values

| Element Type | Stagger        |
| ------------ | -------------- |
| Characters   | `0.02 - 0.03s` |
| Words        | `0.05 - 0.08s` |
| Small UI     | `0.1 - 0.15s`  |
| Cards        | `0.15 - 0.2s`  |
| Large blocks | `0.2 - 0.3s`   |

### ScrollTrigger Start/End

| Pattern           | Meaning                                  |
| ----------------- | ---------------------------------------- |
| `"top 80%"`       | When element top hits 80% of viewport    |
| `"bottom 20%"`    | When element bottom hits 20% of viewport |
| `"top bottom"`    | When element top hits viewport bottom    |
| `"center center"` | When element center hits viewport center |

### Toggle Actions

```
"play none none reverse"
 │    │    │    └─ onLeaveBack
 │    │    └────── onLeave
 │    └─────────── onEnterBack
 └──────────────── onEnter
```

**Common patterns:**

- `"play none none reverse"` - Play once, reverse on scroll up
- `"play pause resume reset"` - Full control
- `"play none none none"` - Play once, no reverse

---

## Additional Animation Patterns

### Blur Reveal with Stagger (Left to Right)

**Use Case:** Client logos, partner badges, icon grids that need sequential reveal

#### Animation Code

```jsx
import { gsap } from "../../../utils/gsapConfig";

const logosContainer = document.getElementById("client-logos");
const logoItems = document.querySelectorAll(".client-logo-item");

if (logoItems.length > 0 && logosContainer) {
  gsap.fromTo(
    logoItems,
    {
      opacity: 0,
      x: -50,
      filter: "blur(10px)",
    },
    {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: logosContainer,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    },
  );
}
```

#### HTML Structure

```jsx
<div id="client-logos" class="flex flex-wrap justify-center gap-5">
  {clientLogos.map((client) => (
    <div class="client-logo-item">
      <img src={client.logo} alt={client.name} />
    </div>
  ))}
</div>
```

#### CSS

```css
.client-logo-item {
  opacity: 0;
}
```

#### Animation Breakdown

| Property    | From       | To        | Purpose          |
| ----------- | ---------- | --------- | ---------------- |
| **opacity** | 0          | 1         | Fade in effect   |
| **x**       | -50px      | 0         | Slide from left  |
| **filter**  | blur(10px) | blur(0px) | Blur reveal      |
| **stagger** | -          | 0.1s      | Sequential delay |

#### Key Features

- **Sequential animation**: Each item animates one after another
- **Directional motion**: Slides from left to right
- **Blur effect**: Gradually sharpens as it reveals
- **Scroll-triggered**: All items start when container enters viewport
- **Stagger control**: Adjust timing between items

#### Customization Options

```jsx
// Faster sequence
stagger: 0.05; // Items animate more quickly

// Slower sequence
stagger: 0.15; // More delay between items

// Different direction (right to left)
x: 50; // Start from right instead of left

// No blur effect
// Remove filter properties for simple slide-in
```

#### Performance Notes

- Blur filter may impact performance on low-end devices
- Consider reducing stagger on mobile for faster completion
- Use `will-change: transform, filter` for smoother animations

---

## Animation Pattern Summary

| Pattern             | Complexity | Use Frequency | Performance |
| ------------------- | ---------- | ------------- | ----------- |
| Fade Up             | Low        | Very High     | Excellent   |
| Blur Reveal         | Medium     | Medium        | Good        |
| Blur Reveal Stagger | Medium     | Medium        | Good        |
| Scale Bounce        | Low        | High          | Excellent   |
| Stagger Cascade     | Low        | Very High     | Excellent   |
| Scroll Scrub        | Medium     | Medium        | Good        |
| Section Expansion   | Medium     | Low           | Good        |
| Height Auto         | Medium     | Medium        | Good        |
| Hover Text Slide    | High       | Low           | Good        |
| Continuous Pulse    | Low        | Low           | Excellent   |
| Smooth Scroll       | Low        | High          | Excellent   |

---

## File Structure

```
src/
├── utils/
│   └── gsapConfig.js          # Central configuration
└── components/
    ├── AnimatedText.js        # Reusable hover animation
    ├── Hero.js                # Uses: Blur Reveal, Fade Up
    ├── HowItWorks.js          # Uses: Section Expansion, Stagger, Scale Bounce
    ├── Features.js            # Uses: Fade Directional, Stagger
    ├── Trust.js               # Uses: Scale + Rotate, Fade Up, Scale Bounce
    ├── About.js               # Uses: Scroll Scrub Blur Reveal
    ├── CTASection.js          # Uses: Fade Up, Scale Bounce, Continuous Pulse
    ├── FAQ.js                 # Uses: Height Auto, Stagger, Fade Up
    └── Navbar.js              # Uses: Smooth Scroll, Fade Directional
```

---

## Installation Checklist

- [ ] `npm install gsap@^3.13.0`
- [ ] Create `src/utils/gsapConfig.js`
- [ ] Copy animation presets and defaults
- [ ] Add `"use client"` to animated components
- [ ] Import `{ gsap, animations, scrollTriggerDefaults }`
- [ ] Create refs for animated elements
- [ ] Wrap animations in `gsap.context()`
- [ ] Return cleanup: `ctx.revert()`
- [ ] Test on multiple screen sizes
- [ ] Verify `prefers-reduced-motion` support
- [ ] Remove `markers: true` before production

---

## Resources

- **GSAP Docs:** https://greensock.com/docs/
- **ScrollTrigger Docs:** https://greensock.com/docs/v3/Plugins/ScrollTrigger
- **Easing Visualizer:** https://greensock.com/ease-visualizer/
- **GSAP Forum:** https://greensock.com/forums/

---

**Last Updated:** January 2025
**GSAP Version:** 3.13.0
**Framework:** Next.js 16 + React 19
