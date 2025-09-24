;(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const revealEls = document.querySelectorAll(".reveal")
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    )
    revealEls.forEach((el) => io.observe(el))
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"))
  }

  const bars = document.querySelectorAll(".bar[data-level]")
  bars.forEach((bar, i) => {
    const level = Number.parseInt(bar.getAttribute("data-level") || "0", 10)
    const clamped = Math.max(0, Math.min(level, 100))
    bar.style.setProperty("--level", clamped + "%")
    if (!prefersReduced) {
      bar.style.animationDelay = `${i * 60}ms`
    }
  })

  const sections = Array.from(document.querySelectorAll("main section[id]"))
  const navLinks = Array.from(document.querySelectorAll(".nav-link[data-nav]"))

  function setActiveNav(id) {
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.dataset.nav === id)
    })
  }

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id")
            if (id) setActiveNav(id)
          }
        })
      },
      { threshold: 0.5, rootMargin: "-10% 0px -40% 0px" },
    )
    sections.forEach((sec) => spy.observe(sec))
  } else {

    window.addEventListener(
      "scroll",
      () => {
        const fromTop = window.scrollY + 120
        let currentId = sections[0]?.id || ""
        sections.forEach((section) => {
          if (section.offsetTop <= fromTop) currentId = section.id
        })
        setActiveNav(currentId)
      },
      { passive: true },
    )
  }

  if (!prefersReduced) {
    const cards = Array.from(document.querySelectorAll(".card"))
    const maxTilt = 10 // derajat
    cards.forEach((card) => {
      let rafId = null

      function onPointerMove(e) {
        if (e.pointerType && e.pointerType !== "mouse") return
        const rect = card.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`)
        card.style.setProperty("--my", `${e.clientY - rect.top}px`)

        const rX = (0.5 - y) * maxTilt
        const rY = (x - 0.5) * maxTilt

        if (rafId) cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-4px)`
        })
      }

      function onPointerEnter() {
        card.classList.add("is-tilting")
      }

      function onPointerLeave() {
        if (rafId) cancelAnimationFrame(rafId)
        card.classList.remove("is-tilting")
        card.style.transform = ""
      }

      card.addEventListener("pointerenter", onPointerEnter, { passive: true })
      card.addEventListener("pointermove", onPointerMove)
      card.addEventListener("pointerleave", onPointerLeave, { passive: true })
    })
  }
  
  ;(() => {
    if (prefersReduced) return
    const hero = document.querySelector(".hero")
    if (!hero) return
    const copy = hero.querySelector(".hero-copy")
    const photo = hero.querySelector(".hero-photo")

    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset
        const copyOffset = Math.max(0, 1 - scrollY / 800) * 0 
        const photoOffset = Math.max(0, 1 - scrollY / 800) * 10
        if (copy) copy.style.transform = `translateY(${copyOffset}px)`
        if (photo) photo.style.transform = `translateY(${photoOffset}px)`
        ticking = false
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
  })()

  ;(() => {
    const header = document.querySelector(".site-header")
    if (!header) return
    const onScrollHeader = () => {
      const y = window.scrollY || window.pageYOffset
      header.classList.toggle("scrolled", y > 12)
    }
    onScrollHeader()
    window.addEventListener("scroll", onScrollHeader, { passive: true })
  })()
  ;(() => {
    function removeFooterTop() {
      const footerTop = document.querySelector(".footer-top")
      if (footerTop) footerTop.remove()
    }

    function run() {
      removeFooterTop()
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run, { once: true })
    } else {
      run()
    }
  })()
})()
