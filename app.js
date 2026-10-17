const preloader = document.querySelector("#preloader")
const header = document.querySelector(".header")
const progressBtn = document.querySelector("#progress-btn")
const progressBtnPath = progressBtn.querySelector("svg path")


window.addEventListener("load", () => {
    preloader.classList.add("active")
    animationText()
});

const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight
const pathLength = progressBtnPath.getTotalLength()
progressBtnPath.style.strokeDasharray = `${pathLength} ${pathLength}`
// progressBtnPath.style.strokeDashoffset = pathLength

window.addEventListener("scroll", () => {
    // header
    if (window.scrollY > 5) {
        header.classList.add("active")
    } else {
        header.classList.remove("active")
    }

    // header sections
    document.querySelectorAll("section").forEach(current => {
        const id = current.getAttribute("id")
        const h = document.querySelector(`#${id}`).offsetHeight
        const t = document.querySelector(`#${id}`).offsetTop - 80

        if (scrollY > t && scrollY <= t + h) {
            document.querySelector(`.header a[href="#${id}"] button`).classList.add("active")
        } else {
            document.querySelector(`.header a[href="#${id}"] button`).classList.remove("active")
        }
    })

    //progressBtn
    if (window.scrollY > 100) {
        progressBtn.classList.add("active")
    } else {
        progressBtn.classList.remove("active")
    }

    const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercentage = window.scrollY / totalScrollableHeight
    progressBtnPath.style.strokeDashoffset = pathLength - (scrollPercentage * pathLength)

})

progressBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

// ability block
const aboutAbility = document.querySelector("#about .ability")
aboutAbility.querySelectorAll(".ability-block").forEach((block) => {
    block.addEventListener("mouseover", () => {
        const blockHeight = block.clientHeight + 3
        const aboutAbilityRect = aboutAbility.getBoundingClientRect()
        const blockRect = block.getBoundingClientRect()
        const blockTop = blockRect.top - aboutAbilityRect.top

        aboutAbility.style.setProperty("--data-height", `${blockHeight}px`)
        aboutAbility.style.setProperty("--data-top", `${(blockTop)}px`)
    })
})

// animation text
function animationText() {
    const aniText = document.querySelector("#ani-txt")
    const words = [
        "WEB DEVELOPER",
        "Security Researcher",
        "DESIGNER",
        "ETHICAL HACKING",
        "CONTENT CREATION"
    ]

    let indexText = 0

    setInterval(() => {
        if (indexText == words.length) indexText = 0

        addRandomTextContent(words[indexText])
        indexText++
    }, 4000)

    function getRandomChar() {
        const glitchChars = "X六0@ƒ1{!<>-_/[]{}░▒▓—åß∂ƒ©˙∆˚æ≈ç√∫=+*^?#λ$"
        return glitchChars[Math.floor(Math.random() * glitchChars.length)]
    }

    function getRandomWord(value) {
        let finalVal = ""
        for (let i = 0; i < value.length; i++) {
            finalVal += value[i] == " " ? " " : getRandomChar()
        }
        return finalVal
    }

    function addRandomTextContent(word) {
        aniText.innerHTML = getRandomWord(word)

        const totalRounds = 2
        const interval = 50
        let count = 0
        let globalCount = 0
        let canChange = false

        let timer_ = setInterval(() => {
            let finalValue = ""

            for (let i = 0; i < word.length; i++) {
                if (i <= count && canChange) {
                    finalValue += word[i]
                } else {
                    finalValue += getRandomChar()
                }
            }

            aniText.innerHTML = finalValue

            if (canChange) count++
            if (globalCount == totalRounds) canChange = true
            if (count == word.length) {
                clearInterval(timer_)
                count = 0
                globalCount = 0
                canChange = false
            }

            globalCount++
        }, interval)
    }
}

// cursor spotlight on cards
document.addEventListener("pointermove", (e) => {
    const card = e.target.closest("#work .body a, #blog .blog-box, #contact .social-btns a, #about .ability-block")
    if (!card) return
    const r = card.getBoundingClientRect()
    card.style.setProperty("--mx", `${e.clientX - r.left}px`)
    card.style.setProperty("--my", `${e.clientY - r.top}px`)
})

// hacker portrait: matrix code rain behind the image
;(function matrixRain() {
    const canvas = document.querySelector("#matrix-rain")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>/{}[]$#@*+=".split("")
    const fontSize = 16
    let columns = 0
    let drops = []
    let running = false
    let last = 0

    function resize() {
        const dpr = window.devicePixelRatio || 1
        const { width, height } = canvas.getBoundingClientRect()
        if (!width || !height) return
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        columns = Math.floor(width / fontSize)
        drops = Array.from({ length: columns }, () => Math.random() * -40)
    }

    function draw(now) {
        if (!running) return
        requestAnimationFrame(draw)
        if (now - last < 55) return // ~18 fps keeps it light and readable
        last = now

        const { width, height } = canvas.getBoundingClientRect()

        // fade previous frame to leave trails (canvas stays transparent)
        ctx.globalCompositeOperation = "destination-out"
        ctx.fillStyle = "rgba(0, 0, 0, 0.09)"
        ctx.fillRect(0, 0, width, height)
        ctx.globalCompositeOperation = "source-over"

        ctx.font = `${fontSize}px ui-monospace, Consolas, monospace`
        for (let i = 0; i < columns; i++) {
            const y = drops[i] * fontSize
            const ch = chars[Math.floor(Math.random() * chars.length)]
            // bright head, green body
            ctx.fillStyle = Math.random() > 0.96 ? "#d6ffe9" : "#00ff9c"
            ctx.fillText(ch, i * fontSize, y)
            if (y > height && Math.random() > 0.975) drops[i] = 0
            drops[i] += 1
        }
    }

    function start() {
        if (running) return
        running = true
        requestAnimationFrame(draw)
    }
    function stop() { running = false }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("load", resize)
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas)

    // only animate while the hero is visible
    new IntersectionObserver((entries) => {
        entries[0].isIntersecting ? start() : stop()
    }).observe(canvas)
})()
