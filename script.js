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

// ============================================== //
// ============ LOGIKA AI CHATBOT =============== //
// ============================================== //

document.addEventListener('DOMContentLoaded', () => {
    // Ambil semua elemen yang kita butuhkan
    const chatButton = document.getElementById('ai-chat-button');
    const chatContainer = document.getElementById('ai-chat-container');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Tampilkan/sembunyikan jendela chat
    chatButton.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
    });

    closeChatBtn.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });

    // Kirim pesan saat form disubmit
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userInput = chatInput.value.trim();
        if (!userInput) return;

        // Tampilkan pesan pengguna di chat
        addMessage(userInput, 'user');
        chatInput.value = '';

        // Tampilkan indikator loading
        const loadingIndicator = addMessage('Mengetik...', 'ai', true);
        
        try {
            // =================================================================
            // PENTING: Panggilan ke API Backend Anda, bukan langsung ke Google
            // =================================================================
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userInput }),
            });

            if (!response.ok) {
                throw new Error('Gagal mendapatkan respons dari server.');
            }

            const data = await response.json();
            
            // Hapus indikator loading
            loadingIndicator.remove();

            // Tampilkan respons dari AI
            // Kita gunakan Marked.js untuk mengubah Markdown menjadi HTML jika ada
            // (Ini opsional tapi sangat direkomendasikan)
            addMessage(data.text, 'ai');

        } catch (error) {
            console.error('Error:', error);
            // Hapus indikator loading dan tampilkan pesan error
            loadingIndicator.remove();
            addMessage('Maaf, terjadi kesalahan. Coba lagi nanti.', 'ai');
        }
    });

    // Fungsi untuk menambahkan pesan ke jendela chat
    function addMessage(text, sender, isLoading = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        if (isLoading) {
             messageElement.classList.add('loading');
        }

        // Untuk keamanan, ubah teks menjadi lebih aman sebelum dimasukkan ke HTML
        const p = document.createElement('p');
        p.textContent = text;
        messageElement.appendChild(p);
        
        chatMessages.appendChild(messageElement);
        // Otomatis scroll ke pesan terbaru
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageElement;
    }
});
