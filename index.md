<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>王旭 - 个人主页</title>
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
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: center;
        }

        .about-text {
            font-size: 1.1rem;
            line-height: 1.8;
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
              
                <img   class=".head-img" src="11.jpg"> 
            </div>
            <h1>王旭</h1>
            <p class="subtitle">人工智能专业 · 多模态大模型研究 · 山东建筑大学</p>
            <div class="seeking-badge">
                <i class="fas fa-search"></i> 寻求2027年秋季硕士/博士机会
            </div>
        </header>

        <main class="main-content">
            <section class="section fade-in">
                <h2><i class="fas fa-user"></i>关于我</h2>
                <div class="about-grid">
                    <div class="about-text">
                        <p>我是一名热情的本科生（2023级），主修<strong>人工智能</strong>专业，就读于<strong>山东建筑大学计算机科学与技术学院</strong>。</p>
                        <p>我的研究兴趣主要集中在<strong>多模态大模型</strong>及其在智能系统中的应用。致力于探索AI技术的前沿发展，并将理论研究与实际应用相结合。</p>
                    </div>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">8</div>
                            <div>发表论文</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">20+</div>
                            <div>获奖项目</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">10</div>
                            <div>软件著作权</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">196</div>
                            <div>志愿服务小时</div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section fade-in">
                <h2><i class="fas fa-briefcase"></i>服务与职务</h2>
                <div class="awards-grid">
                    <div class="award-item">
                        <div class="award-icon">🧠</div>
                        <div>心理委员 & 助教</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">👨‍💻</div>
                        <div>CCF和SDAAI学生会员</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🤖</div>
                        <div>泰迪智能工作室主席 & Deep Studio AI部门负责人</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">📝</div>
                        <div>ICME, EMNLP, AVSS, BMVC会议审稿人</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">✅</div>
                        <div>华为昇腾社区核心开发者</div>
                    </div>
                </div>
            </section>

            <section class="section fade-in">
                <h2><i class="fas fa-file-alt"></i>学术发表</h2>
                <div class="publications-grid">
                    <div class="publication-item">
                        <div class="publication-title">
                            🧠 SM-CBNet: 基于语音的帕金森病诊断模型
                        </div>
                        <div class="publication-venue">ICIC 2025, CCF-C, 口头报告</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            🫀 ECG-Expert-QA: 心脏病诊断医疗大语言模型评估基准
                        </div>
                        <div class="publication-venue">2025 (arXiv:2502.17475)</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            📡 RIE-SenseNet: 工业传感器信号的黎曼流形嵌入
                        </div>
                        <div class="publication-venue">2025 (arXiv:2502.02428)</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            🛣️ 道路损伤检测的实时动态尺度感知融合
                        </div>
                        <div class="publication-venue">JRTIP 2025, JCR-Q2</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            🚗 DAPONet: 实时道路损伤检测
                        </div>
                        <div class="publication-venue">Applied Sciences 2025, JCR-Q1</div>
                    </div>
                    <div class="publication-item">
                        <div class="publication-title">
                            🔥 EFA-YOLO: 火灾检测的特征注意力机制
                        </div>
                        <div class="publication-venue">2024 (arXiv:2409.12635)</div>
                    </div>
                </div>
            </section>

            <section class="section fade-in">
                <h2><i class="fas fa-trophy"></i>竞赛获奖</h2>
                <div class="awards-grid">
                    <div class="award-item">
                        <div class="award-icon">🏆</div>
                        <div><strong>专业第一名</strong> - 2023-2024学年</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🏆</div>
                        <div><strong>第一名</strong> - 山东建筑大学交通科技大赛</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥇</div>
                        <div><strong>一等奖</strong> - 蓝桥杯大赛</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥇</div>
                        <div><strong>一等奖</strong> - 山东省软件设计大赛</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥇</div>
                        <div><strong>一等奖</strong> - 中国大学生计算机设计大赛</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥈</div>
                        <div><strong>二等奖</strong> - 全球校园AI算法精英大赛</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥈</div>
                        <div><strong>二等奖</strong> - 全国大学生数学建模竞赛</div>
                    </div>
                    <div class="award-item">
                        <div class="award-icon">🥉</div>
                        <div><strong>三等奖</strong> - 多项国家级竞赛</div>
                    </div>
                </div>
            </section>

            <section class="section fade-in">
                <h2><i class="fas fa-certificate"></i>认证与技能</h2>
                <div class="skills-grid">
                    <div class="skill-category">
                        <h3>工业认证</h3>
                        <ul class="skill-list">
                            <li><i class="fas fa-check"></i>工业互联网平台开发工程师</li>
                            <li><i class="fas fa-check"></i>数学建模能力认证</li>
                        </ul>
                    </div>
                    <div class="skill-category">
                        <h3>华为昇腾认证</h3>
                        <ul class="skill-list">
                            <li><i class="fas fa-check"></i>昇腾C编程中级开发者</li>
                            <li><i class="fas fa-check"></i>CANN应用开发工程师</li>
                            <li><i class="fas fa-check"></i>Atlas 200I DK A2开发者</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="section fade-in">
                <h2><i class="fas fa-code"></i>软件著作权</h2>
                <div class="experience-timeline">
                    <div class="timeline-item">
                        <h3>✅ 已授权项目</h3>
                        <ul>
                            <li>🌾 基于深度学习的农业病虫害检测系统</li>
                            <li>🏙️ 城市危险实时监测预警系统</li>
                            <li>🧠 基于U-Net的脑肿瘤分割平台</li>
                            <li>🖼️ 智能图像识别处理软件</li>
                            <li>👁️‍🗨️ CityEye智慧城市监控系统</li>
                            <li>🫁 深度学习肺炎检测系统</li>
                            <li>😬 基于深度学习的牙齿图像分割系统</li>
                        </ul>
                    </div>
                    <div class="timeline-item">
                        <h3>⏳ 待审批项目</h3>
                        <ul>
                            <li>🏥 医院CT图像数据管理系统</li>
                            <li>👁️ 基于眼底图像的疾病分类系统</li>
                            <li>❤️ 智能心脏诊断分割系统</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="section fade-in">
                <h2><i class="fas fa-hands-helping"></i>社会实践与志愿服务</h2>
                <div class="experience-timeline">
                    <div class="timeline-item">
                        <h3>🔧 社会实践</h3>
                        <ul>
                            <li>📌 2023年10月 - 华为HAG项目实践</li>
                            <li>🛠️ 2023年12月 - 济成电子功图诊断实践</li>
                            <li>📊 2024年6月 - 临沂体育局数据分析实习</li>
                            <li>🧪 2025年1月 - 山东大学数据研究分析实践</li>
                        </ul>
                    </div>
                    <div class="timeline-item">
                        <h3>❤️ 志愿服务</h3>
                        <p><strong>总志愿时长：196小时</strong></p>
                        <p><strong>优秀志愿者奖：14次</strong></p>
                    </div>
                </div>
            </section>

            <section class="section hobbies-section fade-in">
                <h2><i class="fas fa-heart"></i>兴趣爱好</h2>
                <div style="text-align: center; padding: 20px;">
                    <p style="font-size: 1.1rem; margin-bottom: 20px;">
                        🎶 音乐爱好者！特别喜欢黄小云的歌曲
                    </p>
                    <p style="font-size: 1.1rem;">
                        🎬 影视剧迷，尤其喜欢鞠婧祎主演的作品
                    </p>
                </div>
            </section>
        </main>
    </div>

    <script>
        // 滚动进度条
        window.addEventListener('scroll', () => {
            const scrollProgress = document.getElementById('scrollProgress');
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });

        // 元素淡入动画
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

        // 点击发表论文项目的交互
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

        // 动态统计数字动画
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

        // 页面加载完成后启动数字动画
        window.addEventListener('load', () => {
            setTimeout(animateNumbers, 1000);
        });
    </script>
</body>
</html>
