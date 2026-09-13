document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // 1. CUSTOM CURSOR (Desktop only)
    // ===================================================
    const cursor = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursor-trail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    if (cursor && cursorTrail && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        const animateTrail = () => {
            trailX += (mouseX - trailX) * 0.12;
            trailY += (mouseY - trailY) * 0.12;
            cursorTrail.style.left = trailX + 'px';
            cursorTrail.style.top = trailY + 'px';
            requestAnimationFrame(animateTrail);
        };
        animateTrail();

        const interactives = document.querySelectorAll('a, button, input, textarea, .exp-tab, .skill-tag, .project-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorTrail.style.borderColor = 'var(--accent-2)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '10px';
                cursor.style.height = '10px';
                cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorTrail.style.borderColor = 'var(--accent)';
            });
        });
    } else {
        // Sembunyikan cursor custom di mobile/touch
        if (cursor) cursor.style.display = 'none';
        if (cursorTrail) cursorTrail.style.display = 'none';
    }

    // ===================================================
    // 2. HEADER SCROLL EFFECT
    // ===================================================
    const header = document.getElementById('main-header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ===================================================
    // 3. HAMBURGER MENU (tombol burger dengan animasi)
    // ===================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    if (menuToggle && navLinks && navOverlay) {

        const openMenu = () => {
            navLinks.classList.add('active');
            navOverlay.classList.add('active');
            menuToggle.classList.add('is-open');
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.setAttribute('aria-label', 'Tutup menu navigasi');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            menuToggle.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Buka menu navigasi');
            document.body.style.overflow = '';
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('active');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navOverlay.addEventListener('click', closeMenu);

        // Tutup menu saat link navigasi diklik
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Tutup menu saat tombol Escape ditekan
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // ===================================================
    // 4. THEME SWITCHER (DARK / LIGHT)
    // ===================================================
    const themeSwitch = document.getElementById('checkbox');
    if (themeSwitch) {
        // Terapkan tema tersimpan
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
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

    // ===================================================
    // 5. TYPING EFFECT (DYNAMIC TEXT) – sesuai profil Ergus
    // ===================================================
    const dynamicText = document.getElementById('dynamic-text');
    const words = [
        "Web Developer",
        "Alumni Politeknik Negeri Sambas",
        "Laravel & PHP Developer",
        "Problem Solver",
        "Ketua Umum ILC"
    ];
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    const type = () => {
        if (!dynamicText) return;
        const currentWord = words[wordIndex];
        const currentChar = isDeleting
            ? currentWord.substring(0, charIndex - 1)
            : currentWord.substring(0, charIndex + 1);

        dynamicText.textContent = currentChar;
        dynamicText.classList.add('typing');

        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(type, 90);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, 55);
        } else {
            isDeleting = !isDeleting;
            dynamicText.classList.remove('typing');
            if (!isDeleting) {
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(type, 1600);
        }
    };

    if (dynamicText) setTimeout(type, 600);

    // ===================================================
    // 6. SCROLL FADE-IN ANIMATION
    // ===================================================
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.07 });

    document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

    // ===================================================
    // 7. ACTIVE NAV LINK ON SCROLL
    // ===================================================
    const sections = document.querySelectorAll('section[id]');
    const navLi = document.querySelectorAll('nav .nav-links li a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLi.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-35% 0px -65% 0px' });

    sections.forEach(section => sectionObserver.observe(section));

    // ===================================================
    // 8. EXPERIENCE TABS
    // ===================================================
    const expTabs = document.querySelectorAll('.exp-tab');
    const expContents = document.querySelectorAll('.exp-tab-content');

    expTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = 'tab-' + tab.dataset.tab;
            expTabs.forEach(t => t.classList.remove('active'));
            expContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const target = document.getElementById(targetId);
            if (target) target.classList.add('active');
        });
    });

    // ===================================================
    // 9. COUNTER ANIMASI HERO STATS
    // ===================================================
    const statNums = document.querySelectorAll('.stat-num[data-target]');

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const endValue = parseInt(el.dataset.target);
                const suffix = el.textContent.replace(/[0-9]/g, '').trim() || '+';
                let current = 0;
                const duration = 1200;
                const stepTime = Math.max(Math.floor(duration / endValue), 20);

                const counter = setInterval(() => {
                    current++;
                    el.textContent = current + '+';
                    if (current >= endValue) {
                        el.textContent = endValue + '+';
                        clearInterval(counter);
                    }
                }, stepTime);

                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNums.forEach(el => countObserver.observe(el));

    // ===================================================
    // 10. CONTACT FORM (AJAX + FORMSPREE)
    // ===================================================
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (form && formStatus && submitBtn) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Mengirim...';
            submitBtn.disabled = true;
            formStatus.textContent = '';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.textContent = '✅ Terima kasih! Pesan Anda telah terkirim. Saya akan segera merespons.';
                    formStatus.style.color = '#34d399';
                    form.reset();
                } else {
                    throw new Error('Server error');
                }
            } catch {
                formStatus.textContent = '❌ Maaf, terjadi masalah. Silakan hubungi via WhatsApp atau Email langsung.';
                formStatus.style.color = '#f87171';
            } finally {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }
        });
    }

    // ===================================================
    // 11. SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerH = document.getElementById('main-header')?.offsetHeight || 70;
                const top = target.getBoundingClientRect().top + window.scrollY - headerH - 10;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});

// ====================================================
// AI CHATBOT – Knowledge Base tentang Ergus
// ====================================================
document.addEventListener('DOMContentLoaded', () => {
    const chatButton    = document.getElementById('ai-chat-button');
    const chatContainer = document.getElementById('ai-chat-container');
    const closeChatBtn  = document.getElementById('close-chat-btn');
    const chatForm      = document.getElementById('chat-form');
    const chatInput     = document.getElementById('chat-input');
    const chatMessages  = document.getElementById('chat-messages');
    const chatBtnIcon   = document.getElementById('chat-btn-icon');

    if (!chatButton || !chatContainer) return;

    // ---------- Knowledge Base Ergus (offline) ----------
    const KB = {
        nama:        'Ergus',
        gelar:       'A.Md.Kom',
        email:       'ergus87@gmail.com',
        telepon:     '0831-4006-3145',
        whatsapp:    'https://wa.me/6283140063145',
        github:      'https://github.com/ERGUS457',
        instagram:   'https://www.instagram.com/ergus136',
        facebook:    'https://www.facebook.com/profile.php?id=100077115692940',
        portfolio:   'https://ergusportfolio.vercel.app/',
        pendidikan:  'Alumni D3 Manajemen Informatika, Politeknik Negeri Sambas (2023–2026)',
        ta:          'Rancang Bangun Aplikasi Sistem Penerbitan SKHP Alat UTTP pada UPT Metrologi Legal Kota Singkawang Berbasis Website',
        ta_link:     'https://sipskhp.vercel.app/',
        keahlian:    ['PHP', 'Laravel', 'CodeIgniter', 'HTML5', 'CSS3', 'JavaScript', 'MySQL', 'Git', 'GitHub'],
        sertifikasi: 'Junior Web Developer – Digital Talent Scholarship 2025',
        prestasi:    ['Juara I Syarhil Qur\'an MAN I Sambas 2023', 'Juara I Tilawah Dusun Sembua\' Segantong 2017', 'Peserta INNOVILLEAGUE 2025'],
        proyek:      ['Sistem Informasi Panti Asuhan', 'Manajemen Inventaris UKMI Fastabiqul Khairat', 'Website Berbasis PBO', 'Sistem Penerbitan SKHP Alat UTTP (Tugas Akhir)'],
        organisasi:  ['Ketua Umum ILC 2025–2026', 'Ketua Bidang Mitra & Kerjasama HMJMI 2024–2025', 'Ketua Panitia UKMI Berbagi 2025', 'Ketua Panitia Musyawarah Besar ILC 2024', 'CO Humas Milad & SuperCamp GMSPP 2026', 'CO Humas Pesantren Kilat GMSPP 2026', 'CO Humas Upgrading HMJMI 2025', 'CO Acara MILAD IMTEK 2025', 'CO PDD Pekan UKMI 2024', 'CO Perlengkapan Meet and Greet ILC 2025', 'PIC One Night Get Together HMJMI 2024', 'Panitia 17 Agustus Dusun Sembua\' Segantong 2021–2023'],
        tujuan:      'Menjadi seseorang yang bermanfaat untuk orang lain dan diri sendiri.',
        lokasi:      'Sambas, Kalimantan Barat',
    };

    // ---------- Simple rule-based responder ----------
    const getResponse = (input) => {
        const q = input.toLowerCase().trim();

        // Sapaan
        if (/^(halo|hai|hi|hello|hey|hy|salam)\b/.test(q)) {
            return `Halo! 😊 Saya asisten AI Ergus. Saya siap menjawab pertanyaan tentang Ergus — mulai dari keahlian, proyek, pendidikan, pengalaman organisasi, hingga cara menghubunginya. Ada yang ingin kamu tanyakan?`;
        }

        // Nama / siapa
        if (/siapa|nama|profil|tentang/.test(q)) {
            return `**Ergus** adalah seorang Alumni D3 Manajemen Informatika Politeknik Negeri Sambas (A.Md.Kom). Ia memiliki minat besar dalam pengembangan web, khususnya menggunakan PHP, Laravel, dan CodeIgniter. Selain itu, Ergus juga aktif dalam berbagai organisasi kampus dan merupakan Ketua Umum ILC periode 2025–2026. Tujuan hidupnya: *"${KB.tujuan}"*`;
        }

        // Kontak / hubungi
        if (/kontak|hubungi|email|whatsapp|wa|telepon|hp|nomor/.test(q)) {
            return `Kamu bisa menghubungi Ergus melalui:\n📧 Email: ${KB.email}\n📱 WhatsApp: ${KB.telepon}\n🌐 Portfolio: ${KB.portfolio}\n\nAtau langsung klik tombol "Hubungi Saya" di halaman ini!`;
        }

        // Keahlian / skill
        if (/keahlian|skill|bisa|mampu|teknologi|bahasa|framework|keterampilan/.test(q)) {
            return `Keahlian teknis Ergus meliputi:\n⚡ **Backend:** ${KB.keahlian.slice(0,4).join(', ')}\n🎨 **Frontend:** HTML5, CSS3, JavaScript\n🗄️ **Database:** MySQL\n🔧 **Tools:** Git, GitHub, XAMPP, VS Code\n\nErgus juga mahir mengoperasikan kamera Canon 600D dan memiliki kemampuan manajemen tim yang kuat.`;
        }

        // Pendidikan
        if (/pendidikan|kuliah|sekolah|politeknik|jurusan|gelar|almamater/.test(q)) {
            return `Riwayat pendidikan Ergus:\n🎓 **Politeknik Negeri Sambas** – D3 Manajemen Informatika (2023–2026), A.Md.Kom\n🏫 **MAN 1 Sambas** – Jurusan MIPA (2020–2023)\n🏫 **SMPN 5 Teluk Keramat** (2017–2020)\n🏫 **SDN 36 Sembua' Segantong** (2010–2017)`;
        }

        // Tugas Akhir
        if (/tugas akhir|ta|skripsi|thesis|skhp|metrologi|singkawang/.test(q)) {
            return `Tugas Akhir Ergus berjudul:\n📝 *"${KB.ta}"*\n\nProyek ini merupakan sistem berbasis website yang dikembangkan untuk UPT Metrologi Legal Kota Singkawang menggunakan teknologi Laravel dan PHP.\n🔗 Lihat live: ${url}`;
        }

        // Proyek
        if (/proyek|project|karya|portfolio|buat|membuat|aplikasi/.test(q)) {
            return `Proyek-proyek yang telah dibuat Ergus:\n${KB.proyek.map((p, i) => `${i+1}. ${p}`).join('\n')}\n\nKamu bisa lihat detail dan demo proyeknya di bagian **Proyek** halaman ini!`;
        }

        // Organisasi
        if (/organisasi|org|kepanitiaan|panitia|kegiatan|pengalaman|ketua|koordinator/.test(q)) {
            return `Ergus aktif di 12+ kegiatan organisasi! Beberapa yang menonjol:\n⭐ Ketua Umum ILC (2025–2026)\n⭐ Ketua Bidang Mitra & Kerjasama HMJMI (2024–2025)\n⭐ Ketua Panitia UKMI Berbagi (2025)\n⭐ Ketua Panitia Mubes ILC (2024)\n⭐ CO Humas Milad & SuperCamp GMSPP (2026)\n\nDan masih banyak lagi! Lihat detail di bagian **Pengalaman**.`;
        }

        // Prestasi / sertifikasi
        if (/prestasi|juara|sertifikat|sertifikasi|penghargaan|lomba/.test(q)) {
            return `Prestasi dan sertifikasi Ergus:\n🏆 Juara I Syarhil Qur'an MAN I Sambas (2023)\n🏆 Juara I Lomba Tilawah Dusun Sembua' Segantong (2017)\n🎖️ Sertifikasi Junior Web Developer – Digital Talent Scholarship (2025)\n🥈 Peserta INNOVILLEAGUE 2025`;
        }

        // Hobi & Minat
        if (/hobi|hobby|kesukaan|senang|gemar|kamera|foto|fotografi|canon|game|gaming|psikologi/.test(q)) {
            return `Selain coding, Ergus punya beberapa hobi menarik:
📸 **Fotografi:** Mahir mengoperasikan kamera DSLR **Canon 600D**, sering jadi andalan dokumentasi di berbagai organisasi.
🧠 **Psikologi:** Senang mengeksplorasi perilaku manusia dan berbagi perspektif (salah satu favoritnya adalah membedah makna kehidupan dari film seperti *My Name Is Khan*).
🎮 **Gaming:** Suka bermain dan mengoleksi game berbasis web (HTML) maupun Python.

Ergus percaya bahwa kombinasi teknologi, seni, dan pemahaman terhadap manusia adalah kunci membangun solusi digital yang berdampak!`;
        }

        // GitHub / sosmed
        if (/github|instagram|facebook|sosmed|social|media/.test(q)) {
            return `Akun sosial media Ergus:\n🐱 GitHub: github.com/ERGUS457\n📸 Instagram: @ergus136\n👤 Facebook: Profil Ergus\n🌐 Portfolio: ergusportfolio.vercel.app`;
        }

        // Lokasi / asal
        if (/lokasi|asal|tinggal|domisili|sambas|kalimantan/.test(q)) {
            return `Ergus berasal dari ${KB.lokasi}. Ia menyelesaikan pendidikannya dari SD hingga kuliah di wilayah Sambas, Kalimantan Barat.`;
        }

        // Terima kasih
        if (/terima kasih|makasih|thanks|thank/.test(q)) {
            return `Sama-sama! 😊 Jika masih ada yang ingin kamu tanyakan tentang Ergus, jangan ragu untuk bertanya ya!`;
        }

        // Pertanyaan tidak dikenali
        return `Hmm, saya belum punya informasi spesifik tentang itu. 🤔 Tapi saya tahu banyak hal lain tentang Ergus, seperti:
• **Keahlian:** Tech stack Laravel, PHP, dll.
• **Proyek:** Aplikasi TA, E-Commerce, Inventaris.
• **Organisasi:** Pengalaman di ILC, HMJMI, GMSPP.
• **Hobi:** Fotografi (Canon 600D), Psikologi, & Gaming.
• **Kontak:** Email, WA, & Media Sosial.

Apa ada salah satu dari topik di atas yang ingin kamu tanyakan?`;
    };

    // ---------- Toggle Chat ----------
    let chatIsOpen = false;

    const openChat = () => {
        chatContainer.classList.add('active');
        chatButton.setAttribute('aria-expanded', 'true');
        if (chatBtnIcon) {
            chatBtnIcon.className = 'bx bx-x';
        }
        chatIsOpen = true;
        setTimeout(() => chatInput?.focus(), 350);
    };

    const closeChat = () => {
        chatContainer.classList.remove('active');
        chatButton.setAttribute('aria-expanded', 'false');
        if (chatBtnIcon) {
            chatBtnIcon.className = 'bx bxs-bot';
        }
        chatIsOpen = false;
    };

    chatButton.addEventListener('click', () => {
        chatIsOpen ? closeChat() : openChat();
    });

    closeChatBtn.addEventListener('click', closeChat);

    // Tutup dengan tombol Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatIsOpen) closeChat();
    });

    // ---------- Kirim Pesan ----------
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userInput = chatInput.value.trim();
        if (!userInput) return;

        // Tampilkan pesan user
        addMessage(userInput, 'user');
        chatInput.value = '';

        // Loading indicator
        const loadingEl = addMessage('Sedang mengetik...', 'ai', true);

        // Simulasi delay alami (200–600ms)
        const delay = 200 + Math.random() * 400;
        await new Promise(r => setTimeout(r, delay));

        loadingEl.remove();

        // Dapatkan respons dari knowledge base
        const responseText = getResponse(userInput);
        addMessage(responseText, 'ai');
    });

    // ---------- Fungsi Tambah Pesan ----------
    const addMessage = (text, sender, isLoading = false) => {
        const el = document.createElement('div');
        el.classList.add('message', `${sender}-message`);
        if (isLoading) el.classList.add('loading');

        const p = document.createElement('p');
        // Render teks dengan format sederhana (bold & newlines)
        if (sender === 'ai' && !isLoading) {
            const formatted = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
            p.innerHTML = formatted;
        } else {
            p.textContent = text;
        }

        el.appendChild(p);
        chatMessages.appendChild(el);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return el;
    };
});
