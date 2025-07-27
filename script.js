document.addEventListener('DOMContentLoaded', () => {

    // --- FUNGSI MENU NAVIGASI MOBILE (HAMBURGER) ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    if (menuToggle && navLinks && navOverlay) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navOverlay.classList.toggle('active');
            // Mencegah scroll body saat menu terbuka
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Fungsi untuk menutup menu
        const closeMenu = () => {
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        navOverlay.addEventListener('click', closeMenu);
        // Tutup menu saat link di-klik (untuk navigasi di halaman yang sama)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // --- FUNGSI MODE TERANG/GELAP (THEME SWITCHER) ---
    const themeSwitch = document.getElementById('checkbox');
    if (themeSwitch) {
        // Cek tema tersimpan di localStorage
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            themeSwitch.checked = true;
        }

        themeSwitch.addEventListener('change', () => {
            if (themeSwitch.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- ANIMASI KETIK (TYPING EFFECT) ---
    const dynamicText = document.getElementById('dynamic-text');
    const words = ["Mahasiswa", "Web Developer", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const currentWord = words[wordIndex];
        const currentChar = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);

        dynamicText.textContent = currentChar;
        dynamicText.classList.add('typing');

        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(type, 120);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, 80);
        } else {
            isDeleting = !isDeleting;
            dynamicText.classList.remove('typing');
            if (!isDeleting) {
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(type, 1200);
        }
    };

    if (dynamicText) {
        type();
    }

    // --- ANIMASI SAAT SCROLL (INTERSECTION OBSERVER) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // --- NAVIGASI AKTIF SAAT SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const navLi = document.querySelectorAll('nav .nav-links li a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLi.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' }); // Aktif saat section berada di 30% atas layar

    sections.forEach(section => sectionObserver.observe(section));

    // --- FUNGSI FORMULIR KONTAK (AJAX & FORMSPREE) ---
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        formStatus.textContent = 'Mengirim...';
        formStatus.style.color = 'var(--text-secondary)';
        
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                formStatus.textContent = "Terima kasih! Pesan Anda telah terkirim.";
                formStatus.style.color = 'var(--accent-blue)';
                form.reset();
            } else {
                formStatus.textContent = "Oops! Terjadi masalah saat mengirim pesan.";
                formStatus.style.color = '#f87171'; // Warna merah untuk error
            }
        } catch (error) {
            formStatus.textContent = "Oops! Terjadi masalah koneksi.";
            formStatus.style.color = '#f87171';
        }
    }
    if (form) { form.addEventListener("submit", handleSubmit) }
});