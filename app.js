document.addEventListener('DOMContentLoaded', () => {
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');

    // Google Forms entry IDs
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd4tY3u1y2Tq80U3fNlV9z4mC22PgiGHMx7_40tF8QU5Jsxug/formResponse';
    const ENTRY_NAME = 'entry.388558972';
    const ENTRY_ATTENDANCE = 'entry.305679524';
    const ENTRY_ATTENDANCE_SENTINEL = 'entry.305679524_sentinel';

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const guestName = document.getElementById('guest-name').value.trim();
        const attendance = document.querySelector('input[name="attendance"]:checked').value;

        if (guestName) {
            // Google Forms-қа жібереміз
            const formData = new FormData();
            formData.append(ENTRY_NAME, guestName);
            formData.append(ENTRY_ATTENDANCE, attendance);
            formData.append(ENTRY_ATTENDANCE_SENTINEL, '');
            fetch(GOOGLE_FORM_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            }).catch(() => {});

            // Сәтті жіберілгені туралы хабарламаны көрсетеміз
            rsvpForm.style.transition = 'opacity 0.3s ease';
            rsvpForm.style.opacity = '0';
            setTimeout(() => {
                rsvpForm.style.display = 'none';
                rsvpSuccess.style.display = 'block';
                rsvpSuccess.style.opacity = '0';
                rsvpSuccess.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    rsvpSuccess.style.opacity = '1';
                }, 50);
            }, 300);
        }
    });
});
