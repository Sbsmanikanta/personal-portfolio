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

/*===== CONTACT FORM HANDLER =====*/
const contactForm = document.getElementById('contact-form')
const contactStatus = document.getElementById('contact-status')

if(contactForm){
    contactForm.addEventListener('submit', async (event) => {
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

        try{
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            })

            const responseText = await response.text()
            let result = {}

            if(responseText){
                try{
                    result = JSON.parse(responseText)
                }catch(parseError){
                    result = { error: responseText }
                }
            }

            if(!response.ok){
                throw new Error(result.error || `Request failed (${response.status})`)
            }

            if(contactStatus){
                contactStatus.textContent = result.message || 'Thanks! Your message has been sent.'
            }

            contactForm.reset()
        }catch(error){
            if(contactStatus){
                contactStatus.textContent = error.message || 'Your message could not be sent right now.'
            }
        }
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
