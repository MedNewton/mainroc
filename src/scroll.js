// A tiny module-level store shared between GSAP's ScrollTrigger (which writes it)
// and the R3F render loop (which reads it inside useFrame). Keeping scroll
// progress out of React state avoids re-rendering the whole tree on every
// scroll event — the 3D scene just reads the latest value each frame.
export const scrollStore = {
  // 0 at the top of the page, 1 at the bottom.
  progress: 0,
}
