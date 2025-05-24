<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xu Wang - Personal Homepage</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            padding: 60px 0;
            color: white;
        }

        .avatar {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 5px solid rgba(255,255,255,0.2);
            margin: 0 auto 20px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
            color: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
        }

        .avatar:hover {
            transform: scale(1.05);
        }

        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
        }

        .header .subtitle {
            font-size: 1.3rem;
            opacity: 0.9;
            margin-bottom: 20px;
        }

        .seeking-badge {
            display: inline-block;
            background: rgba(255,102,102,0.9);
            color: white;
            padding: 12px 25px;
            border-radius: 25px;
            font-weight: bold;
            margin-top: 10px;
            box-shadow: 0 5px 15px rgba(255,102,102,0.4);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .main-content {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            overflow: hidden;
            margin-top: -30px;
            position: relative;
            z-index: 1;
        }

        .section {
            padding: 40px;
            border-bottom: 1px solid #f0f0f0;
        }

        .section:last-child {
            border-bottom: none;
        }

        .section h2 {
            font-size: 2rem;
            margin-bottom: 25px;
            color: #2c3e50;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .section h2 i {
            color: #667eea;
            font-size: 1.5rem;
        }

        .about-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: center;
        }

        .about-text {
            font-size: 1.1rem;
            line-height: 1.8;
            text-align: center;
        }

        .about-text strong {
            color: #667eea;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }

        .stat-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
            transition: transform 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .publications-grid {
            display: grid;
            gap: 20px;
        }

        .publication-item {
            background: linear-gradient(135deg, #f8f9ff, #e8f4fd);
            padding: 25px;
            border-radius: 15px;
            border-left: 5px solid #667eea;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .publication-item:hover {
            transform: translateX(5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .publication-title {
            font-size: 1.1rem;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .publication-venue {
            color: #667eea;
            font-weight: bold;
            font-size: 0.9rem;
        }

        .publication-venue a {
            color: #667eea;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .publication-venue a:hover {
            color: #4a59c7;
            text-decoration: underline;
        }

        .awards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
        }

        .award-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .award-item:hover {
            background: #e9ecef;
            transform: scale(1.02);
        }

        .award-icon {
            font-size: 1.5rem;
            width: 40px;
            text-align: center;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .skill-category {
            background: linear-gradient(135deg, #ff6b6b, #ffa500);
            color: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
        }

        .skill-category h3 {
            margin-bottom: 15px;
            font-size: 1.2rem;
        }

        .skill-list {
            list-style: none;
        }

        .skill-list li {
            padding: 5px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .experience-timeline {
            position: relative;
            padding-left: 30px;
        }

        .experience-timeline::before {
            content: '';
            position: absolute;
            left: 15px;
            top: 0;
            height: 100%;
            width: 2px;
            background: #667eea;
        }

        .timeline-item {
            position: relative;
            margin-bottom: 30px;
            background: #f8f9ff;
            padding: 20px;
            border-radius: 10px;
            margin-left: 20px;
        }

        .timeline-item::before {
            content: '';
            position: absolute;
            left: -35px;
            top: 25px;
            width: 12px;
            height: 12px;
            background: #667eea;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 0 3px #667eea;
        }

        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            text-align: center;
        }

        .contact-card {
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            color: white;
            padding: 30px;
            border-radius: 15px;
            transition: transform 0.3s ease;
        }

        .contact-card:hover {
            transform: translateY(-5px);
        }

        .contact-card i {
            font-size: 2rem;
            margin-bottom: 15px;
            display: block;
        }

        .hobbies-section {
            background: linear-gradient(135deg, #ff9a9e, #fecfef);
            color: #2c3e50;
            text-align: center;
        }

        .floating-elements {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }

        .floating-element {
            position: absolute;
            opacity: 0.1;
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .scroll-indicator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(102, 126, 234, 0.2);
            z-index: 1000;
        }

        .scroll-progress {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 0;
            transition: width 0.3s ease;
        }

        .two-column-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: start;
        }

        @media (max-width: 768px) {
            .about-grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .section {
                padding: 20px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr 1fr;
            }

            .two-column-grid {
                grid-template-columns: 1fr;
            }
        }

        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }

        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .head-img{
            width: 170px;
            height: 145px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 0 3px #667eea;
        }
    </style>
</head>
<body>
    <div class="scroll-indicator">
        <div class="scroll-progress" id="scrollProgress"></div>
    </div>

    <div class="floating-elements">
        <i class="fas fa-brain floating-element" style="top: 10%; left: 10%; font-size: 3rem; animation-delay: 0s;"></i>
        <i class="fas fa-robot floating-element" style="top: 20%; right: 15%; font-size: 2.5rem; animation-delay: 1s;"></i>
        <i class="fas fa-code floating-element" style="top: 60%; left: 5%; font-size: 2rem; animation-delay: 2s;"></i>
        <i class="fas fa-graduation-cap floating-element" style="bottom: 20%; right: 10%; font-size: 2.5rem; animation-delay: 3s;"></i>
    </div>

    <div class="container">
        <header class="header fade-in">
            <div class="avatar">
                <img class="head-img" src="11.jpg"> 
            </div>
            <h1>Xu Wang</h1>
            <p class="subtitle">Artificial Intelligence Major · Multimodal Large Model Research · Shandong Jianzhu University</p>
            <div class="seeking-badge">
                <i class="fas fa-search"></i> Seeking Master's/PhD Opportunities for Fall 2027
            </div>
        </header>

        <main class="main-content">
            <section class="section fade-in">
                <h2><i class="fas fa-user"></i>About Me</h2>
                <div class="about-grid">
                    <div class="about-text">
                        <p>I am a passionate undergraduate student (Class of 2023) majoring in <strong>Artificial Intelligence</strong> at the <strong>School of Computer Science and Technology, Shandong Jianzhu University</strong>.</p>
                        <p>My research interests primarily focus on <strong>Multimodal Large Models</strong> and their applications in intelligent systems. I am committed to exploring cutting-edge developments in AI technology and combining theoretical research with practical applications.</p>
                    </div>
                </div>
            </section>

            <section class="section fade-in">
                <h2><i class="fas fa-briefcase"></i>Services & Positions</h2>
                <div class="awards-grid">
                    <div class="award-item">
                        <div class="award-icon">🧠</div>
                        <div>Mental Health Committee Member & Teaching Assistant</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">👨‍💻</div>
                        <div>CCF and SDAAI Student Member</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🤖</div>
                        <div>Chairman of Teddy Intelligent Studio & Head of Deep Studio AI Department</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">📝</div>
                        <div>Reviewer for ICME, EMNLP, AVSS, BMVC Conferences</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">✅</div>
                        <div>Huawei Ascend Community Core Developer</div>
                    </div>
                </div>
            </section>

            <section class="section fade-in">
                <h2><i class="fas fa-file-alt"></i>Academic Publications</h2>
                <div class="publications-grid">
                    <div class="publication-item">
                        <div class="publication-title">
                            🧠 SM-CBNet: Speech-based Parkinson's Disease Diagnosis Model
                        </div>
                        <div class="publication-venue">ICIC 2025, CCF-C, Oral Presentation</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            🫀 ECG-Expert-QA: Cardiovascular Disease Diagnosis Medical Large Language Model Evaluation Benchmark
                        </div>
                        <div class="publication-venue">2025 (<a href="https://arxiv.org/abs/2502.17475" target="_blank">arXiv:2502.17475</a>)</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            📡 RIE-SenseNet: Riemannian Manifold Embedding for Industrial Sensor Signals
                        </div>
                        <div class="publication-venue">2025 (<a href="https://arxiv.org/abs/2502.02428" target="_blank">arXiv:2502.02428</a>)</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            🛣️ Real-time Dynamic Scale-aware Fusion for Road Damage Detection
                        </div>
                        <div class="publication-venue">JRTIP 2025, JCR-Q2</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            🚗 DAPONet: Real-time Road Damage Detection
                        </div>
                        <div class="publication-venue">Applied Sciences 2025, JCR-Q1</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            🔥 EFA-YOLO: Feature Attention Mechanism for Fire Detection
                        </div>
                        <div class="publication-venue">2024 (<a href="https://arxiv.org/abs/2409.12635" target="_blank">arXiv:2409.12635</a>)</div>
                    </div>
                </div>
            </section>

            <section class="section fade-in">
                <h2><i class="fas fa-trophy"></i>Competition Awards</h2>
                <div class="awards-grid">
                    <div class="award-item">
                        <div class="award-icon">🏆</div>
                        <div><strong>First Place in Major</strong> - Academic Year 2023-2024</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🏆</div>
                        <div><strong>First Place</strong> - Shandong Jianzhu University Transportation Technology Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥇</div>
                        <div><strong>First Prize</strong> - Blue Bridge Cup Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥇</div>
                        <div><strong>First Prize</strong> - Shandong Province Software Design Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥇</div>
                        <div><strong>First Prize</strong> - China Collegiate Computing Contest</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥈</div>
                        <div><strong>Second Prize</strong> - Global Campus AI Algorithm Elite Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥈</div>
                        <div><strong>Second Prize</strong> - National College Student Mathematical Contest in Modeling</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥉</div>
                        <div><strong>Third Prize</strong> - Multiple National-level Competitions</div>
                    </div>
                </div>
            </section>

            <section class="section fade-in">
                <h2><i class="fas fa-certificate"></i>Certifications & Skills</h2>
                <div class="skills-grid">
                    <div class="skill-category">
                        <h3>Industrial Certifications</h3>
                        <ul class="skill-list">
                            <li><i class="fas fa-check"></i>Industrial Internet Platform Development Engineer</li>
                            <li><i class="fas fa-check"></i>Mathematical Modeling Ability Certification</li>
                        </ul>
                    </div>
                    <div class="skill-category">
                        <h3>Huawei Ascend Certifications</h3>
                        <ul class="skill-list">
                            <li><i class="fas fa-check"></i>Ascend C Programming Intermediate Developer</li>
                            <li><i class="fas fa-check"></i>CANN Application Development Engineer</li>
                            <li><i class="fas fa-check"></i>Atlas 200I DK A2 Developer</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="section fade-in">
                <h2><i class="fas fa-code"></i>Software Copyrights & Social Practice</h2>
                <div class="two-column-grid">
                    <div>
                        <h3 style="color: #667eea; margin-bottom: 20px;"><i class="fas fa-code"></i> Software Copyrights</h3>
                        <div class="experience-timeline">
                            <div class="timeline-item">
                                <h4>✅ Authorized Projects</h4>
                                <ul>
                                    <li>🌾 Deep Learning-based Agricultural Pest Detection System</li>
                                    <li>🏙️ Urban Hazard Real-time Monitoring and Warning System</li>
                                    <li>🧠 U-Net-based Brain Tumor Segmentation Platform</li>
                                    <li>🖼️ Intelligent Image Recognition Processing Software</li>
                                    <li>👁️‍🗨️ CityEye Smart City Monitoring System</li>
                                    <li>🫁 Deep Learning Pneumonia Detection System</li>
                                    <li>😬 Deep Learning-based Dental Image Segmentation System</li>
                                </ul>
                            </div>
                            <div class="timeline-item">
                                <h4>⏳ Pending Approval</h4>
                                <ul>
                                    <li>🏥 Hospital CT Image Data Management System</li>
                                    <li>👁️ Fundus Image-based Disease Classification System</li>
                                    <li>❤️ Intelligent Cardiac Diagnosis Segmentation System</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 style="color: #667eea; margin-bottom: 20px;"><i class="fas fa-hands-helping"></i> Social Practice & Volunteer Service</h3>
                        <div class="experience-timeline">
                            <div class="timeline-item">
                                <h4>🔧 Social Practice</h4>
                                <ul>
                                    <li>📌 October 2023 - Huawei HAG Project Practice</li>
                                    <li>🛠️ December 2023 - Jicheng Electronics Dynamometer Card Diagnosis Practice</li>
                                    <li>📊 June 2024 - Linyi Sports Bureau Data Analysis Internship</li>
                                    <li>🧪 January 2025 - Shandong University Data Research and Analysis Practice</li>
                                </ul>
                            </div>
                            <div class="timeline-item">
                                <h4>❤️ Volunteer Service</h4>
                                <p><strong>Total Volunteer Hours: 196 hours</strong></p>
                                <p><strong>Outstanding Volunteer Awards: 14 times</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section hobbies-section fade-in">
                <h2><i class="fas fa-heart"></i>Hobbies & Interests</h2>
                <div style="text-align: center; padding: 20px;">
                    <p style="font-size: 1.1rem; margin-bottom: 20px;">
                        🎶 Music enthusiast! Particularly enjoy songs by Huang Xiaoyun
                    </p>
                    <p style="font-size: 1.1rem;">
                        🎬 Film and TV drama fan, especially works starring Ju Jingyi
                    </p>
                </div>
            </section>
        </main>
    </div>

    <script>
        // Scroll progress bar
        window.addEventListener('scroll', () => {
            const scrollProgress = document.getElementById('scrollProgress');
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });

        // Element fade-in animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Publication item click interaction
        document.querySelectorAll('.publication-item').forEach(item => {
            item.addEventListener('click', () => {
                item.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                item.style.color = 'white';
                setTimeout(() => {
                    item.style.background = 'linear-gradient(135deg, #f8f9ff, #e8f4fd)';
                    item.style.color = '';
                }, 2000);
            });
        });

        // Dynamic number animation
        function animateNumbers() {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent.replace('+', ''));
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = stat.textContent.includes('+') ? target + '+' : target;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                    }
                }, 50);
            });
        }

        // Start number animation after page load
        window.addEventListener('load', () => {
            setTimeout(animateNumbers, 1000);
        });
    </script>
</body>
</html>
