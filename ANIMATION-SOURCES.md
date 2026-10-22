# Animation sources

These are existing third-party animation implementations, bundled locally. No custom cursor engine, scrolling engine or text-splitting engine is implemented in this project.

| Dependency | Version | Use | Source / license |
| --- | --- | --- | --- |
| GSAP | 3.15.0 | Timelines, navigation indicator, ScrollTrigger and SplitText | https://gsap.com/ / https://gsap.com/standard-license/ |
| Lenis | 1.3.27 | Inertial scrolling and anchor navigation | https://github.com/darkroomengineering/lenis / MIT |
| Cuberto Mouse Follower | 1.2.1 | Following dot, expanding hover and text cursor | https://github.com/Cuberto/mouse-follower / MIT |
| React Bits SplitText | Source retrieved 2026-10-22 | Rise and blur text presets, stagger and reveal lifecycle, adapted to the existing HTML | https://github.com/DavidHDev/react-bits/blob/main/src/content/TextAnimations/SplitText/SplitText.jsx / MIT + Commons Clause |

Onseis (https://onseis.com/) uses Lenis and Mouse Follower through its site builder. Its public configuration specifies a 1.8-second scroll duration and a cursor follow speed of 0.55 with expo.out easing. This portfolio uses those libraries and settings directly, with sage cursor colors to suit the existing theme. No Onseis site-builder code or brand assets were copied.

The React Bits adaptation is in `reactbits-splittext.js`. It retains the GSAP SplitText component's presets, GSAP stagger distribution, onSplit lifecycle and ScrollTrigger entry animation. React lifecycle hooks and unused modes are omitted. Its complete license is included in `reactbits-LICENSE.md`; the component is distributed only as part of this portfolio.

Package distributions were obtained from the official npm registry at pinned versions. Upstream license notices remain in the distributed scripts. MIT licenses are included in ``.

## Behaviour

- Mouse/trackpad scrolling uses Lenis's 1.8-second duration. Touch scrolling remains native.
- Fine-pointer devices use the Cuberto cursor. Keyboard navigation and modal dialogs restore the native cursor.
- The header Motion switch immediately disables all animation timelines, smooth scrolling, custom cursor, ticker and backdrop blur. Its choice is saved in localStorage. When saved off, subsequent visits skip downloading the animation JavaScript entirely.
- Reduced-motion preferences disable the animated intro, text reveals, inertia and custom cursor. Navigation updates instantly.
- Dialogs pause Lenis and resume it when closed; their content scrolls natively.
- The intro is a progressive reveal, without a blocking loading screen or artificial progress percentage.
- If a library fails to load, content remains usable; the intro visibility fallback runs after 3.5 seconds.

Tune timings and interactions in `animations.js`, text presets in `reactbits-splittext.js`, and appearance in `animations.css`.
