/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== CONTACT FORM MAILTO HANDLER =====*/
const contactForm = document.getElementById('contact-form')
const contactStatus = document.getElementById('contact-status')

if(contactForm){
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const name = contactForm.querySelector('input[name="name"]').value.trim()
        const email = contactForm.querySelector('input[name="email"]').value.trim()
        const message = contactForm.querySelector('textarea[name="message"]').value.trim()

        if(!name || !email || !message){
            if(contactStatus){
                contactStatus.textContent = 'Please fill in your name, email, and message.'
            }
            return
        }

        if(contactStatus){
            contactStatus.textContent = 'Sending your message...'
        }

        const formData = new FormData(contactForm)
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`)
        const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)

        const isLocalPreview = window.location.protocol === 'file:' ||
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === '::1'

        if(isLocalPreview){
            if(contactStatus){
                contactStatus.textContent = 'Preview mode: this form works fully after deployment to Netlify. Opening your email app now.'
            }
            window.location.href = `mailto:manikantasodapaneedi27@gmail.com?subject=${subject}&body=${mailBody}`
            return
        }

        const body = new URLSearchParams(formData).toString()

        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        })
        .then((response) => {
            if(!response.ok){
                throw new Error('Submission failed')
            }

            if(contactStatus){
                contactStatus.textContent = 'Thanks! Your message has been sent.'
            }

            contactForm.reset()
        })
        .catch(() => {
            if(contactStatus){
                contactStatus.textContent = 'Preview mode or server not configured. Opening your email app instead.'
            }
            window.location.href = `mailto:manikantasodapaneedi27@gmail.com?subject=${subject}&body=${mailBody}`
        })
    })
}

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 
