window.onload = () => {
    const lang = document.getElementById("lang");
    const languagesSelect = document.getElementById('languagesSelect')
    const contactForm = document.getElementById('contactForm')
    const emailStatusSuccess = document.getElementById('emailStatusSuccess')
    const emailStatusWarning = document.getElementById('emailStatusWarning')
    const emailStatusError = document.getElementById('emailStatusError')
    const recaptchaWrapper = document.getElementById('recaptcha')

    let recaptcha = ''

    languagesSelect.addEventListener('change', (e) => {
        window.location.href = e.target.value
    })

    if (window.innerWidth < 600) {
        recaptchaWrapper.setAttribute('data-size', 'compact')
    } else {
        recaptchaWrapper.setAttribute('data-size', 'normal')
    }

    grecaptcha.render('recaptcha', {
        'sitekey' : '6LfywsIpAAAAANfUmfg6vw4F0MCH-5HXzf2BvFdN',
        'hl': lang.value,
        'callback': (response) => {
            recaptcha = response
        },
        'expired-callback': () => {
            recaptcha = ''
        }
    });

    const showNotification = (element, type) => {
        element.classList.remove('message--hidden');
        element.classList.add(type)

        setTimeout(() => {
            element.classList.remove(type);
            element.classList.add('message--hidden')
        }, 20000)
    }

    contactForm.addEventListener('submit',  (e) => {
        e.preventDefault()

        if (recaptcha !== '') {
            let objectMessage = {}

            const formData = new FormData(contactForm)

            for (let [key, value] of formData.entries()) {
                objectMessage[key] = value;
            }

            emailjs.send('service_m6oi186', 'template_3cbx0lj', {
                ...objectMessage,
                'g-recaptcha-response': recaptcha
            }).then(
                (response) => {
                    showNotification(emailStatusSuccess, 'message--success')
                },
                (error) => {
                    showNotification(emailStatusError, 'message--error')
                },
            )

            contactForm.reset()
        } else {
            showNotification(emailStatusWarning, 'message--warning')
        }
    })
}