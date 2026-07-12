document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let hasPlayed = false;

    function playAudio() {
        if (!hasPlayed) {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                hasPlayed = true;
            }).catch(err => {
                console.log("Автоматты ойнату бұғатталды:", err);
            });
        }
    }

    window.addEventListener('click', playAudio, { once: true });
    window.addEventListener('scroll', playAudio, { once: true });
    window.addEventListener('touchstart', playAudio, { once: true });

    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                hasPlayed = true;
            });
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
        }
    });

    const targetDate = new Date('2026-08-23T17:14:00').getTime();

    const daysVal = document.getElementById('days');
    const hoursVal = document.getElementById('hours');
    const minutesVal = document.getElementById('minutes');
    const secondsVal = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            daysVal.innerText = '00';
            hoursVal.innerText = '00';
            minutesVal.innerText = '00';
            secondsVal.innerText = '00';
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysVal.innerText = days < 10 ? '0' + days : days;
        hoursVal.innerText = hours < 10 ? '0' + hours : hours;
        minutesVal.innerText = minutes < 10 ? '0' + minutes : minutes;
        secondsVal.innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);

    const canvas = document.getElementById('petals-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Petal {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;
            this.size = Math.random() * 8 + 6;
            this.speedY = Math.random() * 1 + 0.8;
            this.speedX = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.4 + 0.3;
            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = Math.random() * 0.02 - 0.01;

            const colors = [
                'rgba(240, 218, 209, ',
                'rgba(226, 212, 201, ',
                'rgba(235, 222, 218, ',
                'rgba(247, 240, 235, '
            ];
            this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y / 30) * 0.4;
            this.angle += this.spinSpeed;

            if (this.y > canvas.height + 20) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
                this.speedY = Math.random() * 1 + 0.8;
                this.opacity = Math.random() * 0.4 + 0.3;
            }
            if (this.x > canvas.width + 20 || this.x < -20) {
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.fillStyle = this.colorPrefix + this.opacity + ')';
            ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(-this.size, 0);
            ctx.lineTo(this.size, 0);
            ctx.stroke();

            ctx.restore();
        }
    }

    const petals = [];
    const maxPetals = Math.min(60, Math.floor(window.innerWidth / 15));

    for (let i = 0; i < maxPetals; i++) {
        petals.push(new Petal());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();

    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxCaption = document.getElementById('lightbox-caption');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

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
        const now = new Date();
        const timestamp = now.toLocaleDateString('kk-KZ') + ' ' + now.toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' });

        if (guestName) {
            // 1. Жауапты жергілікті сақтаймыз (әкімші панелі үшін)
            let responses = JSON.parse(localStorage.getItem('rsvp_responses')) || [];
            responses.push({ name: guestName, answer: attendance, time: timestamp });
            localStorage.setItem('rsvp_responses', JSON.stringify(responses));

            // 2. Google Forms-қа жібереміз
            const formData = new FormData();
            formData.append(ENTRY_NAME, guestName);
            formData.append(ENTRY_ATTENDANCE, attendance);
            formData.append(ENTRY_ATTENDANCE_SENTINEL, '');
            fetch(GOOGLE_FORM_URL, {
                method: 'POST',
                mode: 'no-cors', // Google Forms үшін қажет
                body: formData
            }).catch(() => { }); // no-cors жауабын оқуға мүмкіндік бермейді

            // 3. Сәтті жіберілгені туралы хабарламаны көрсетеміз
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

    const viewRsvpBtn = document.getElementById('view-rsvp-btn');
    const adminModal = document.getElementById('admin-modal');
    const adminModalClose = document.querySelector('.admin-modal-close');
    const responsesList = document.getElementById('responses-list');
    const clearResponsesBtn = document.getElementById('clear-responses-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');

    viewRsvpBtn.addEventListener('click', () => {
        const pin = prompt('ПИН-кодты енгізіңіз:');
        if (pin === '2308') {
            loadResponses();
            adminModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else if (pin !== null) {
            alert('Қате ПИН-код!');
        }
    });

    function loadResponses() {
        responsesList.innerHTML = '';
        const responses = JSON.parse(localStorage.getItem('rsvp_responses')) || [];
        if (responses.length === 0) {
            responsesList.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 20px;">${i18n[currentLang]['no-answers']}</td></tr>`;
            return;
        }
        responses.forEach(resp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${escapeHTML(resp.name)}</td>
                <td>${escapeHTML(resp.answer)}</td>
                <td style="font-size: 0.8rem; color: #888;">${resp.time}</td>
            `;
            responsesList.appendChild(tr);
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    function closeAdminModal() {
        adminModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    adminModalClose.addEventListener('click', closeAdminModal);
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            closeAdminModal();
        }
    });

    clearResponsesBtn.addEventListener('click', () => {
        if (confirm('Барлық жауаптарды өшіруді растайсыз ба?')) {
            localStorage.removeItem('rsvp_responses');
            loadResponses();
        }
    });

    exportCsvBtn.addEventListener('click', () => {
        const responses = JSON.parse(localStorage.getItem('rsvp_responses')) || [];
        if (responses.length === 0) {
            alert('Экспортталатын деректер жоқ!');
            return;
        }

        let csvContent = "\uFEFF";
        csvContent += "Аты-жөні,Жауабы,Уақыты\n";

        responses.forEach(resp => {
            let name = resp.name.replace(/"/g, '""');
            let answer = resp.answer.replace(/"/g, '""');
            csvContent += `"${name}","${answer}","${resp.time}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `rsvp_responses_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('active')) {
                closeLightbox();
            }
            if (adminModal.classList.contains('active')) {
                closeAdminModal();
            }
        }
    });
});