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
            color: #f0f0f0;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.08) 0%, transparent 50%);
            pointer-events: none;
            z-index: -1;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            padding: 60px 0;
            color: #f8f9fa;
            position: relative;
        }

        .avatar {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 3px solid #ffd700;
            margin: 0 auto 20px;
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
            color: #1a1a1a;
            box-shadow: 
                0 0 30px rgba(255, 215, 0, 0.5),
                0 10px 40px rgba(0, 0, 0, 0.8),
                inset 0 2px 10px rgba(255, 255, 255, 0.2);
            transition: all 0.4s ease;
            position: relative;
        }

        .avatar::before {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ffd700, #ff6b35, #ffd700);
            z-index: -1;
            opacity: 0;
            transition: opacity 0.4s ease;
        }

        .avatar:hover::before {
            opacity: 1;
        }

        .avatar:hover {
            transform: scale(1.05);
            box-shadow: 
                0 0 50px rgba(255, 215, 0, 0.8),
                0 15px 50px rgba(0, 0, 0, 0.9);
        }

        .header h1 {
            font-size: 3.5rem;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #ffd700, #ffed4e, #ffc107);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
            font-weight: 700;
            letter-spacing: 2px;
        }

        .header .subtitle {
            font-size: 1.3rem;
            opacity: 0.9;
            margin-bottom: 20px;
            color: #e0e0e0;
        }

        .seeking-badge {
            display: inline-block;
            background: linear-gradient(135deg, #ffd700, #ffb300);
            color: #1a1a1a;
            padding: 15px 30px;
            border-radius: 30px;
            font-weight: bold;
            margin-top: 10px;
            box-shadow: 
                0 8px 25px rgba(255, 215, 0, 0.4),
                inset 0 2px 10px rgba(255, 255, 255, 0.2);
            animation: luxuryPulse 3s infinite;
            transition: all 0.3s ease;
        }

        .seeking-badge:hover {
            transform: translateY(-2px);
            box-shadow: 
                0 12px 35px rgba(255, 215, 0, 0.6),
                inset 0 2px 10px rgba(255, 255, 255, 0.3);
        }

        @keyframes luxuryPulse {
            0%, 100% { 
                transform: scale(1);
                box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
            }
            50% { 
                transform: scale(1.02);
                box-shadow: 0 12px 35px rgba(255, 215, 0, 0.6);
            }
        }

        .main-content {
            background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(42, 42, 42, 0.95));
            border-radius: 25px;
            box-shadow: 
                0 25px 80px rgba(0, 0, 0, 0.8),
                inset 0 1px 2px rgba(255, 215, 0, 0.1),
                0 0 0 1px rgba(255, 215, 0, 0.2);
            overflow: hidden;
            margin-top: -30px;
            position: relative;
            z-index: 1;
            backdrop-filter: blur(10px);
        }

        .main-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #ffd700, transparent);
            z-index: 1;
        }

        .section {
            padding: 50px;
            border-bottom: 1px solid rgba(255, 215, 0, 0.1);
            position: relative;
        }

        .section:last-child {
            border-bottom: none;
        }

        .section h2 {
            font-size: 2.2rem;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: flex;
            align-items: center;
            gap: 15px;
            font-weight: 600;
        }

        .section h2 i {
            color: #ffd700;
            font-size: 1.8rem;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .about-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: center;
        }

        .about-text {
            font-size: 1.15rem;
            line-height: 1.8;
            text-align: center;
            color: #e0e0e0;
        }

        .about-text strong {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 600;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }

        .stat-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 193, 7, 0.05));
            border: 1px solid rgba(255, 215, 0, 0.3);
            color: #f8f9fa;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 
                0 15px 35px rgba(0, 0, 0, 0.5),
                inset 0 1px 2px rgba(255, 215, 0, 0.1);
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
            transition: left 0.6s ease;
        }

        .stat-card:hover::before {
            left: 100%;
        }

        .stat-card:hover {
            transform: translateY(-8px);
            border-color: rgba(255, 215, 0, 0.6);
            box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.7),
                0 0 30px rgba(255, 215, 0, 0.3);
        }

        .stat-number {
            font-size: 2.8rem;
            font-weight: bold;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .publications-grid {
            display: grid;
            gap: 25px;
        }

        .publication-item {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(26, 26, 26, 0.8));
            border: 1px solid rgba(255, 215, 0, 0.2);
            padding: 30px;
            border-radius: 18px;
            transition: all 0.4s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .publication-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 0;
            background: linear-gradient(180deg, #ffd700, #ffb300);
            transition: height 0.4s ease;
        }

        .publication-item:hover::before {
            height: 100%;
        }

        .publication-item:hover {
            transform: translateX(8px);
            border-color: rgba(255, 215, 0, 0.5);
            box-shadow: 
                0 15px 40px rgba(0, 0, 0, 0.6),
                0 0 25px rgba(255, 215, 0, 0.2);
        }

        .publication-title {
            font-size: 1.15rem;
            font-weight: 600;
            color: #f8f9fa;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .publication-venue {
            color: #ffd700;
            font-weight: 500;
            font-size: 0.95rem;
        }

        .publication-venue a {
            color: #ffd700;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .publication-venue a:hover {
            color: #ffed4e;
            text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
        }

        .awards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
        }

        .award-item {
            display: flex;
            align-items: center;
            gap: 18px;
            padding: 20px;
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(26, 26, 26, 0.6));
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 15px;
            transition: all 0.4s ease;
            color: #e0e0e0;
        }

        .award-item:hover {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(26, 26, 26, 0.8));
            transform: scale(1.02);
            border-color: rgba(255, 215, 0, 0.4);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
        }

        .award-icon {
            font-size: 1.8rem;
            width: 50px;
            text-align: center;
            filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.3));
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
        }

        .skill-category {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(26, 26, 26, 0.8));
            border: 1px solid rgba(255, 215, 0, 0.3);
            color: #f8f9fa;
            padding: 30px;
            border-radius: 18px;
            box-shadow: 
                0 12px 30px rgba(0, 0, 0, 0.5),
                inset 0 1px 2px rgba(255, 215, 0, 0.1);
            transition: all 0.4s ease;
        }

        .skill-category:hover {
            transform: translateY(-5px);
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.7),
                0 0 30px rgba(255, 215, 0, 0.2);
        }

        .skill-category h3 {
            margin-bottom: 20px;
            font-size: 1.3rem;
            color: #ffd700;
            font-weight: 600;
        }

        .skill-list {
            list-style: none;
        }

        .skill-list li {
            padding: 8px 0;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #e0e0e0;
        }

        .skill-list li i {
            color: #ffd700;
        }

        .experience-timeline {
            position: relative;
            padding-left: 35px;
        }

        .experience-timeline::before {
            content: '';
            position: absolute;
            left: 18px;
            top: 0;
            height: 100%;
            width: 2px;
            background: linear-gradient(180deg, #ffd700, rgba(255, 215, 0, 0.3));
        }

        .timeline-item {
            position: relative;
            margin-bottom: 35px;
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(26, 26, 26, 0.6));
            border: 1px solid rgba(255, 215, 0, 0.2);
            padding: 25px;
            border-radius: 15px;
            margin-left: 25px;
            color: #e0e0e0;
        }

        .timeline-item::before {
            content: '';
            position: absolute;
            left: -40px;
            top: 30px;
            width: 14px;
            height: 14px;
            background: #ffd700;
            border-radius: 50%;
            border: 3px solid #1a1a1a;
            box-shadow: 
                0 0 0 3px #ffd700,
                0 0 15px rgba(255, 215, 0, 0.5);
        }

        .timeline-item h4 {
            color: #ffd700;
            margin-bottom: 15px;
            font-size: 1.1rem;
        }

        .timeline-item ul {
            list-style: none;
            padding-left: 0;
        }

        .timeline-item li {
            padding: 5px 0;
            color: #d0d0d0;
        }

        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            text-align: center;
        }

        .contact-card {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(26, 26, 26, 0.8));
            border: 1px solid rgba(255, 215, 0, 0.3);
            color: #f8f9fa;
            padding: 35px;
            border-radius: 18px;
            transition: all 0.4s ease;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
        }

        .contact-card:hover {
            transform: translateY(-8px);
            box-shadow: 
                0 20px 45px rgba(0, 0, 0, 0.7),
                0 0 30px rgba(255, 215, 0, 0.3);
        }

        .contact-card i {
            font-size: 2.5rem;
            margin-bottom: 18px;
            display: block;
            color: #ffd700;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }

        .hobbies-section {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(26, 26, 26, 0.9));
            border: 1px solid rgba(255, 215, 0, 0.2);
            color: #f0f0f0;
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
            opacity: 0.15;
            animation: luxuryFloat 8s ease-in-out infinite;
            color: #ffd700;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        @keyframes luxuryFloat {
            0%, 100% { 
                transform: translateY(0px) rotate(0deg);
                opacity: 0.15;
            }
            25% { 
                transform: translateY(-15px) rotate(5deg);
                opacity: 0.25;
            }
            50% { 
                transform: translateY(-25px) rotate(-5deg);
                opacity: 0.2;
            }
            75% { 
                transform: translateY(-10px) rotate(3deg);
                opacity: 0.3;
            }
        }

        .scroll-indicator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(26, 26, 26, 0.8);
            z-index: 1000;
        }

        .scroll-progress {
            height: 100%;
            background: linear-gradient(90deg, #ffd700, #ffb300, #ffd700);
            width: 0;
            transition: width 0.3s ease;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .two-column-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            align-items: start;
        }

        .two-column-grid h3 {
            color: #ffd700;
            margin-bottom: 25px;
            font-size: 1.4rem;
            font-weight: 600;
        }

        @media (max-width: 768px) {
            .about-grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2.5rem;
            }
            
            .section {
                padding: 30px 25px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr 1fr;
            }

            .two-column-grid {
                grid-template-columns: 1fr;
                gap: 30px;
            }

            .awards-grid {
                grid-template-columns: 1fr;
            }
        }

        .fade-in {
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.8s ease;
        }

        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .head-img {
            width: 170px;
            height: 145px;
            border-radius: 50%;
            border: 3px solid #ffd700;
            box-shadow: 
                0 0 0 3px rgba(255, 215, 0, 0.3),
                0 0 30px rgba(255, 215, 0, 0.4);
        }

        /* Luxury shimmer effect */
        @keyframes luxuryShimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        .shimmer {
            background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
            background-size: 200% 100%;
            animation: luxuryShimmer 3s infinite;
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
        <i class="fas fa-star floating-element" style="top: 40%; right: 5%; font-size: 1.5rem; animation-delay: 4s;"></i>
        <i class="fas fa-gem floating-element" style="bottom: 40%; left: 8%; font-size: 2rem; animation-delay: 5s;"></i>
    </div>

    <div class="container">
        <header class="header fade-in">
            <div class="avatar">
                <img class="head-img" src="11.jpg"> 
            </div>
            <h1>Xu Wang</h1>
            <p class="subtitle">AI Major · Multimodal Large Model · Shandong Jianzhu University</p>
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
                        <div>Mental Health Committee Member & Teacher Assistant</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">👨‍💻</div>
                        <div>CCF and SDAAI Student Member</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🤖</div>
                        <div>Chairman of Teddy Intelligent Studio</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🔥</div>
                        <div>Chairman of Deep Studio AI Department</div>
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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Neural Network Model</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .model-section {
            padding: 40px;
            background: #f8fafc;
        }

        .section-title {
            font-size: 1.8em;
            color: #2d3748;
            margin-bottom: 30px;
            text-align: center;
            font-weight: 600;
        }

        .model-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
            margin: 40px 0;
            position: relative;
        }

        .input-section, .cnn-section, .bilstm-section, .output-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            transition: all 0.3s ease;
        }

        .layer-box {
            padding: 15px 25px;
            border-radius: 12px;
            font-weight: 600;
            text-align: center;
            min-width: 100px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }

        .layer-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .conv-layer { background: #fed7d7; color: #c53030; }
        .batchnorm-layer { background: #c6f6d5; color: #2f855a; }
        .maxpool-layer { background: #bee3f8; color: #2b6cb0; }
        .lstm-layer { background: #fbb6ce; color: #b83280; }
        .dense-layer { background: #faf089; color: #744210; }
        .sigmoid-layer { background: #c3dafe; color: #3182ce; }

        .input-signal {
            width: 100px;
            height: 60px;
            background: linear-gradient(45deg, #ffd89b 0%, #19547b 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .input-signal:hover {
            transform: scale(1.1);
        }

        .feature-maps {
            display: flex;
            gap: 10px;
        }

        .feature-map {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            background-size: cover;
            background-position: center;
        }

        .feature-map:hover {
            transform: scale(1.1);
        }

        .map1 { background: linear-gradient(45deg, #00c6ff, #0072ff); }
        .map2 { background: linear-gradient(45deg, #a8edea, #fed6e3); }
        .map3 { background: linear-gradient(45deg, #ff9a9e, #fecfef); }

        .arrow {
            font-size: 24px;
            color: #4a5568;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
        }

        .bilstm-complex {
            border: 2px dashed #b83280;
            padding: 20px;
            border-radius: 15px;
            background: rgba(251, 182, 206, 0.1);
            position: relative;
        }

        .bilstm-title {
            position: absolute;
            top: -12px;
            left: 20px;
            background: white;
            padding: 0 10px;
            font-weight: bold;
            color: #b83280;
        }

        .lstm-flow {
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
        }

        .lstm-outputs {
            display: flex;
            gap: 8px;
        }

        .lstm-output {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .lstm-output:hover {
            transform: scale(1.2);
        }

        .control-panel {
            text-align: center;
            margin: 30px 0;
        }

        .play-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 0 10px;
        }

        .play-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .publications-section {
            padding: 40px;
            background: white;
        }

        .publication-item {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 20px;
            margin: 15px 0;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }

        .publication-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .publication-title {
            font-size: 1.1em;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .publication-venue {
            font-size: 0.9em;
            opacity: 0.9;
        }

        .publication-venue a {
            color: #ffd700;
            text-decoration: none;
        }

        .publication-venue a:hover {
            text-decoration: underline;
        }

        .active-flow {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4) !important;
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.6);
        }

        .info-tooltip {
            position: absolute;
            background: #2d3748;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            white-space: nowrap;
        }

        .layer-box:hover .info-tooltip {
            opacity: 1;
        }

        @media (max-width: 768px) {
            .model-container {
                flex-direction: column;
                gap: 20px;
            }
            
            .arrow {
                transform: rotate(90deg);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 SM-CBNet: A Speech-Based Parkinson's Disease Diagnosis Model with SMOTE–ENN and CNN+BiLSTM</h1>
            <p>ICIC 2025, CCF-C Oral</p>
        </div>

        <div class="model-section">
            <h2 class="section-title">Model Architecture Visualization</h2>
            
            <div class="control-panel">
                <button class="play-button" onclick="animateDataFlow()">▶️ Animate Data Flow</button>
                <button class="play-button" onclick="resetAnimation()">🔄 Reset</button>
            </div>

            <div class="model-container">
                <!-- Input Section -->
                <div class="input-section">
                    <div class="input-signal" onclick="highlightComponent(this)">
                        <span>Input Signal</span>
                    </div>
                </div>

                <div class="arrow">➡️</div>

                <!-- CNN Section -->
                <div class="cnn-section">
                    <div class="layer-box conv-layer" onclick="highlightComponent(this)">
                        Conv1D
                        <div class="info-tooltip">Convolutional layer for feature extraction</div>
                    </div>
                    <div class="layer-box batchnorm-layer" onclick="highlightComponent(this)">
                        BatchNorm
                        <div class="info-tooltip">Batch normalization for stable training</div>
                    </div>
                    <div class="layer-box maxpool-layer" onclick="highlightComponent(this)">
                        MaxPool
                        <div class="info-tooltip">Max pooling for dimensionality reduction</div>
                    </div>
                    <div class="feature-maps">
                        <div class="feature-map map1"></div>
                        <div class="feature-map map2"></div>
                        <div class="feature-map map3"></div>
                    </div>
                </div>

                <div class="arrow">➡️</div>

                <!-- BiLSTM Section -->
                <div class="bilstm-section">
                    <div class="bilstm-complex">
                        <div class="bilstm-title">BiLSTM</div>
                        <div class="lstm-flow">
                            <div class="layer-box lstm-layer" onclick="highlightComponent(this)">
                                LSTM Forward
                                <div class="info-tooltip">Forward LSTM for sequence processing</div>
                            </div>
                            <div class="layer-box lstm-layer" onclick="highlightComponent(this)">
                                LSTM Backward
                                <div class="info-tooltip">Backward LSTM for sequence processing</div>
                            </div>
                            <div class="lstm-outputs">
                                <div class="lstm-output"></div>
                                <div class="lstm-output"></div>
                                <div class="lstm-output"></div>
                                <div class="lstm-output"></div>
                                <div class="lstm-output"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="arrow">➡️</div>

                <!-- Output Section -->
                <div class="output-section">
                    <div class="layer-box dense-layer" onclick="highlightComponent(this)">
                        Dense
                        <div class="info-tooltip">Fully connected layer</div>
                    </div>
                    <div class="layer-box sigmoid-layer" onclick="highlightComponent(this)">
                        Sigmoid
                        <div class="info-tooltip">Sigmoid activation for binary classification</div>
                    </div>
                    <div class="input-signal" style="background: linear-gradient(45deg, #11998e, #38ef7d);">
                        <span>Output</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let animationTimeout;
        
        function highlightComponent(element) {
            // Remove previous highlights
            document.querySelectorAll('.layer-box, .input-signal').forEach(el => {
                el.classList.remove('active-flow');
            });
            
            // Add highlight to clicked element
            element.classList.add('active-flow');
            
            // Remove highlight after 2 seconds
            setTimeout(() => {
                element.classList.remove('active-flow');
            }, 2000);
        }
        
        function animateDataFlow() {
            resetAnimation();
            
            const components = [
                document.querySelector('.input-signal'),
                document.querySelector('.conv-layer'),
                document.querySelector('.batchnorm-layer'),
                document.querySelector('.maxpool-layer'),
                document.querySelectorAll('.lstm-layer')[0],
                document.querySelectorAll('.lstm-layer')[1],
                document.querySelector('.dense-layer'),
                document.querySelector('.sigmoid-layer'),
                document.querySelector('.output-section .input-signal')
            ];
            
            let delay = 0;
            components.forEach((component, index) => {
                animationTimeout = setTimeout(() => {
                    if (component) {
                        component.classList.add('active-flow');
                        
                        // Remove highlight after showing for 800ms
                        setTimeout(() => {
                            component.classList.remove('active-flow');
                        }, 800);
                    }
                }, delay);
                delay += 600;
            });
            
            // Animate feature maps
            setTimeout(() => {
                document.querySelectorAll('.feature-map').forEach((map, index) => {
                    setTimeout(() => {
                        map.style.transform = 'scale(1.2)';
                        map.style.boxShadow = '0 0 20px rgba(0, 200, 255, 0.6)';
                        setTimeout(() => {
                            map.style.transform = 'scale(1)';
                            map.style.boxShadow = 'none';
                        }, 400);
                    }, index * 200);
                });
            }, 2400);
            
            // Animate LSTM outputs
            setTimeout(() => {
                document.querySelectorAll('.lstm-output').forEach((output, index) => {
                    setTimeout(() => {
                        output.style.transform = 'scale(1.5)';
                        output.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
                        setTimeout(() => {
                            output.style.transform = 'scale(1)';
                            output.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
                        }, 300);
                    }, index * 100);
                });
            }, 3600);
        }
        
        function resetAnimation() {
            clearTimeout(animationTimeout);
            document.querySelectorAll('.layer-box, .input-signal').forEach(el => {
                el.classList.remove('active-flow');
            });
            
            document.querySelectorAll('.feature-map').forEach(map => {
                map.style.transform = 'scale(1)';
                map.style.boxShadow = 'none';
            });
            
            document.querySelectorAll('.lstm-output').forEach(output => {
                output.style.transform = 'scale(1)';
                output.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
            });
        }
        
        // Add some interactive effects
        document.querySelectorAll('.feature-map').forEach(map => {
            map.addEventListener('click', function() {
                this.style.transform = 'scale(1.3) rotate(360deg)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 500);
            });
        });
        
        document.querySelectorAll('.lstm-output').forEach(output => {
            output.addEventListener('click', function() {
                this.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
                this.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    this.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
                    this.style.transform = 'scale(1)';
                }, 1000);
            });
        });
    </script>
</body>
</html>
                    <div class="publication-item">
                        <div class="publication-title">
                            🫀 ECG-Expert-QA: A Benchmark for Evaluating Medical Large Language Models in Heart Disease Diagnosis
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
                            📊 Digital Talent Demand Model via Big Data & ML
                        </div>
                        <div class="publication-venue">Software Guide 2025, CCF-T3</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            🛣️ Real-time Dynamic Scale-aware Fusion for Road Damage Detection
                        </div>
                        <div class="publication-venue">JRTIP 2025, JCR-Q2</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            🚗 DAPONet: Real-Time Road Damage Detection
                        </div>
                        <div class="publication-venue">Applied Sciences 2025, JCR-Q1</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            🚗 YOLO-FireAD: Efficient Fire Detection 
                        </div>
                        <div class="publication-venue">ICIC 2025, CCF-C</div>
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
                        <div><strong>Top 1</strong> - Major 2023-2024 Academic Year</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🏆</div>
                        <div><strong>Top 1</strong> - Shandong Jianzhu University Transportation Technology Competition</div>
                    </div>
                    <div class="award-item">
                    <div class="award-icon">🥇</div>
                    <div><strong>First Prize</strong> - Blue Bridge Cup</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥇</div>
                        <div><strong>First Prize</strong> - Shandong Province Software Design Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥇</div>
                        <div><strong>First Prize</strong> - China University Student Computer Design Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥇</div>
                        <div><strong>First Class</strong> - Shandong Jianzhu University Scholarship</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥈</div>
                        <div><strong>Second Prize</strong> - Global Campus AI Algorithm Elite Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥈</div>
                        <div><strong>Second Prize</strong> - CUMCM Mathematical Modeling</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥈</div>
                        <div><strong>Second Prize</strong> - National College Student Olympiad Mathematics Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥈</div>
                        <div><strong>Second Prize</strong> - Blue Bridge Cup</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥈</div>
                        <div><strong>Second Prize</strong> - China University Student Computer Design Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥈</div>
                        <div><strong>Second Prize</strong> - National Digital Media Creativity Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥈</div>
                        <div><strong>Second Prize</strong> - Shandong Province Software Design Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥉</div>
                        <div><strong>Third Prize</strong> - Career Planning Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥉</div>
                        <div><strong>Third Prize</strong> - China University Student Computer Design Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥉</div>
                        <div><strong>Third Prize</strong> - Raicom Robot Developer Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥉</div>
                        <div><strong>Third Prize</strong> - National Digital Media Creativity Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥉</div>
                        <div><strong>Third Prize</strong> - Global Campus AI Algorithm Elite Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥉</div>
                        <div><strong>Third Prize</strong> - Teddy Cup Data Analysis Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥉</div>
                        <div><strong>Third Prize</strong> - Shandong Province Software Design Competition</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🔥</div>
                        <div><strong>Top 112</strong> - Astar Baidu Programming Competition</div>
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
    <div class="two-column-grid">
        <div>
            <h3><i class="fas fa-code"></i> Software Copyrights</h3>
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
            </div>
        </div>

        <div>
            <h3><i class="fas fa-hands-helping"></i> Social Practice & Volunteer Service</h3>
            <div class="experience-timeline">
                <div class="timeline-item">
                    <h4>🔧 Social Practice</h4>
                    <ul>
                        <li>🛠️ December 2023 - Jicheng Electronics</li>
                        <li>📊 June 2024 - Linyi Sports Bureau Data Analysis</li>
                        <li>🧪 January 2025 - Shandong University Data Research and Analysis Practice</li>
                    </ul>
                </div>
                <div class="timeline-item">
                    <h4>❤️ Volunteer Service</h4>
                    <li>Total Volunteer Hours: 196 hours and Outstanding Volunteer Awards: 14 times</li>
                </div>
            </div>
        </div>
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

        // Publication item click interaction with luxury effect
        document.querySelectorAll('.publication-item').forEach(item => {
            item.addEventListener('click', () => {
                item.style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(26, 26, 26, 0.9))';
                item.style.borderColor = 'rgba(255, 215, 0, 0.8)';
                item.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.4)';
                
                setTimeout(() => {
                    item.style.background = '';
                    item.style.borderColor = '';
                    item.style.boxShadow = '';
                }, 2500);
            });
        });

        // Dynamic number animation
        function animateNumbers() {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent.replace('+', ''));
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = stat.textContent.includes('+') ? target + '+' : target;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                    }
                }, 40);
            });
        }

        // Add luxury shimmer effect to cards on scroll
        function addShimmerEffect() {
            const cards = document.querySelectorAll('.stat-card, .skill-category, .contact-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('shimmer');
                    setTimeout(() => {
                        card.classList.remove('shimmer');
                    }, 3000);
                }, index * 200);
            });
        }

        // Start animations after page load
        window.addEventListener('load', () => {
            setTimeout(animateNumbers, 1000);
            setTimeout(addShimmerEffect, 2000);
        });

        // Add luxury glow effect on hover for award items
        document.querySelectorAll('.award-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.boxShadow = '';
            });
        });

        // Enhanced floating elements animation
        document.querySelectorAll('.floating-element').forEach((element, index) => {
            element.addEventListener('animationiteration', () => {
                const randomDelay = Math.random() * 2;
                element.style.animationDelay = randomDelay + 's';
            });
        });
    </script>
</body>
</html>
