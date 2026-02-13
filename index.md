---
layout: homepage
---

## 个人简介
山东建筑大学 2023 级本科生（人工智能专业），现任智能 231 班心理委员、学校创业团队负责人。
研究领域为自然语言处理，计算机视觉。核心方向包括文本生成控制，目标检测，图像分类等，在AAAI，ICASSP等国际顶级期刊和会议发表论文10余篇，所提出的文段生成控制模型被吴岩等著名小说家称赞，提出的甲骨文去重和缀合框架分分别获AI+甲骨文大赛第二名和第三名。近一年参与山东省大学生创新创业训练计划项目2项。获AAAI 2026人工智能创新应用奖，CNCC 2024学生资助，创青春大赛国家金奖，蓝桥杯国家一等奖，中国机器人及人工智能大赛国家级一等奖等80余项奖项。受邀担任ICME，AVSS等人工智能领域会议和TKDE等权威期刊的程序委员会委员和审稿人。担任AAAI学生会员，中国计算机学会学术会员，山东省人工智能学会学生会员。

## 教育经历
- **2023.09 - 至今**｜山东建筑大学｜人工智能（本科）
- 平均学分绩点：**85.9/100**，专业前 **20%**
- 获一等奖学金、优秀学生等荣誉
- 学科参考：软科世界一流学科排名（Artificial Intelligence）
  - https://www.shanghairanking.cn/rankings/gras/2025/AS0229

## 工作与科研经历
- **2024.06 - 2024.09**｜中铁十九局集团第五工程有限公司｜实习生  
  参与铁路故障智能诊断相关工作；负责人：杨鑫。

- **2025.03 - 2025.06**｜山东大学｜访问学生  
  参与医学图像前后景预处理等研究学习；指导教师：魏广顺。

- **2025.06 - 2025.12**｜伏羲科技｜实习生  
  参与文化领域数字资产手机工作流搭建；负责人：韩普宇、康家驹。

## 核心研究与代表成果

### 自然语言处理（NLP）
- **Octopus: Entropy-Controlled Science Fiction Literature Generation with Persistent Memory-Context**  
  AAAI 2026（CCF-A，Oral）｜第一作者｜2026.01  
  会议分类为Oral，被吴岩、三丰、骑桶人、楚惜刀、北星和骆灵左等知名科幻小说家公开表扬。  
  面向长篇科幻生成，核心解决“写长就崩”的一致性问题：用动态熵控制在创意与稳定间自适应平衡，并以分层持久记忆维护角色、剧情与科学规则，支持万字级上下文。实验显示较目前的主流模型更连贯、矛盾更少，人评也更符合硬科幻逻辑。  
  相关成果获得中国青年创青春大赛-国家级金奖

- **Hint recognition in Chinese and Russian diplomatic discourse using large language models**  
  Scientific Reports（JCR-Q1，IF=4.3，Nature Portfolio）｜第二作者｜2026.01  
  将语用学的语义–认知–语用框架与 RAG、CoT 结合：基于中俄外交记者会实录完成标注并构建向量化提示知识库，利用检索增强与链式推理引导模型识别外交话语中的暗示及其类型。实验表现稳定且召回率高，俄语数据精确率与 F1 更优；误差分析定位语义过解读、类型混淆和字面/隐含误判等偏差，并提出补充无暗示负样本、加强语境锚定与自评过滤等改进以提升准确性与稳定性。  
  Paper: https://www.nature.com/articles/s41598-026-36338-z  
  Code: https://github.com/Yingdong856/Can-LLMs-identify-hints-in-cross-lingual-diplomatic-discourse-

### 医学图像
- **Learning Class-Conditional Temperature with Entropy Alignment for Medical Image Classification**  
  ICASSP 2026（CCF-B，Poster）｜通讯作者｜2026.05  
  提出把类条件温度学习与熵对齐约束结合成一个损失函数，在多种医学图像分类数据集上以很小训练预算实现更好的分类表现与更稳的置信度校准（尤其降低 NLL）  
  Code: https://github.com/JEFfersusu/CCT-EAL

- **Ghost Meets KAN with Mamba: A Hybrid Local-Global Network for Low-Cost Medical Image Classification**（在投）  
  共同第一作者、通讯作者  
  提出一种仅 0.2 GFLOPs / 3.8M 参数 的轻量医学图像分类主干，把 Ghost 卷积（省算力的局部纹理）+ Mobile Mamba（线性时间的全局依赖）+ KAN（可学习非线性校准） 以及 MSFCP/PMB/SMG/DKF 四个协同模块融合起来，在数据集上取得很强的精度–效率权衡。

- **MiT Loss: Medical Image-aware Transfer-calibrated Loss for Enhanced Classification**  
  Measurement Science and Technology（JCR-Q1）｜共同作者（Weichao Pan; Xu Wang）｜2025.09  
  面向小样本医学迁移学习的校准型损失 MiT Loss：把温度缩放 + 熵正则揉进训练过程，专门抑制“医学任务常见的过度自信”，在多类 CNN/Transformer/混合骨干上整体提升 F1/AUC/Kappa（平均 F1 提升约 3.5%–6.8%），并且 Grad-CAM 显示关注区域更合理。  
  Paper: https://iopscience.iop.org/article/10.1088/1361-6501/ae08d8  
  Code: https://github.com/JEFfersusu/MiT_loss

### 信号处理与医学智能
- **ECG-Expert-QA: A Benchmark for Evaluating Medical Large Language Models in ECG**  
  BIBM 2025（CCF-B，Poster）｜第一作者｜2025.12  
  Github Stars 30+, awesome-mmps (CMU) 收录  
  用于评测心电图解读能力的多模态数据集，融合真实临床ECG与系统生成的合成病例，覆盖12类诊断任务，共47,211条专家验证问答。其亮点是支持多轮对话，更贴近医患/协作场景，用于评估模型临床推理、诊断准确性与知识整合，并已公开数据与代码。  
  相关成果获得中国机器人及人工智能大赛-人工智能创新赛国家级一等奖  
  Paper: https://ieeexplore.ieee.org/document/11356744  
  Code: https://github.com/Zaozzz/ECG-Expert-QA  
  https://github.com/willxxy/awesome-mmps

- **SM-CBNet: A Speech-Based Parkinson’s Disease Diagnosis Model with SMOTE–ENN and CNN+BiLSTM Integration**  
  ICIC 2025（CCF-C，Oral）｜第一作者｜2025.07  
  会议分类为Oral，GitHub Stars: 10+  
  面向帕金森病语音辅助诊断，针对数据不均衡引入SMOTE–ENN重采样，并设计CNN+BiLSTM混合网络以提取语音特征并建模时序依赖。实验在公开数据集上取得95%准确率，在多项指标上优于传统机器学习与其他深度模型，验证了方法有效性与临床早筛潜力，可为高精度PD筛查提供可靠技术支撑。  
  Paper: https://link.springer.com/chapter/10.1007/978-981-95-0030-7_4  
  Code: https://github.com/Zaozzz/SM-CBNet

### 目标检测与工业视觉
- **Real-time dynamic scale-aware fusion detection network: take road damage detection as an example**  
  Journal of Real-Time Image Processing（JCR-Q2）｜第二作者｜2025.02  
  单篇被引用10+  
  我参与提出了一个面向 UAV 路面病害的实时检测网络 RT-DSAFDet：针对“病害形状/尺度不规则 + 背景遮挡干扰 + 实时性”三难题，设计了自适应特征提取、动态多尺度融合、轻量下采样等模块，使模型在 UAV-PDD2023 上 mAP50 达到 54.2%，同时参数量压到 1.8M、FLOPs 4.6G，并在 COCO 上也保持了不错的精度-效率平衡。  
  Paper: https://link.springer.com/article/10.1007/s11554-025-01634-w  
  Code: https://github.com/JEFfersusu/RT-DSAFDet

- **HVLO-YOLO: An Ultra-Lightweight Detection Model for High-voltage Line Obstacles**  
  BMVC 2025（CCF-C，Poster）｜第二作者  
  提出了面向高压输电线路障碍物的超轻量 YOLO，用 CP4 / PDown / PDetect 三个“部分卷积”轻量模块在极低参数量下仍保持强检测性能，适配边缘端实时巡检。  
  Paper: https://bmvc2025.bmva.org/proceedings/405/  
  Code: https://github.com/JEFfersusu/HVLO-YOLO

- **TPVG-YOLO: Twined-Path Convolution and Vision-Gated Fusion for Efficient PCB Defect Detection**  
  Signal, Image and Video Processing（JCR-Q3）｜第二作者｜2025.11  
  面向 PCB 微小缺陷的轻量检测框架 TPVG-YOLO：用 Twined-Path Convolution 抓细粒度局部结构，用基于 Group-mLSTM 的 Vision-Gated Fusion 低成本注入方向性全局上下文，在 PKU-Market-PCB / RW-PCB 上做到 mAP50 89.3%/87.2%，同时仅 2.0M 参数、5.2 GFLOPs，逼近更大 YOLO 版本的精度。  
  Paper: https://link.springer.com/article/10.1007/s11760-025-04952-5

- **TRIDENet: A Channel-Selective Framework for Boundary-Consistent Industrial Surface Defect Detection**  
  Optics and Laser Technology（JCR-Q1，TOP，IF=5.0）｜第四作者｜2026.01  
  面向工业表面缺陷检测中“噪声冗余、微小缺陷被纹理淹没、细长边界定位偏移”三大痛点，引入 SCA 通道选择净化融合 + TGDetect 任务门控解耦 + PIoU 边界感知回归损失，实现更准、更稳且仍高效的缺陷检测。

## 关键竞赛与荣誉
- 中国青年创青春大赛（共青团中央 & 商务部）：国家金奖，初创组第一名。
- AI+甲骨文大赛（腾讯 SSV）：甲骨文缀合任务全球第二名，甲骨文校重任务全球第三名。
- 蓝桥杯全国软件和信息技术专业人才大赛（白名单）：国一 1 项，国三 2 项。
- 中国机器人及人工智能大赛（白名单）：国家一等奖。
- 全球校园人工智能算法精英大赛（白名单）：国二 3 项，国三 5 项。
- 全国大学生数字媒体科技作品及创意竞赛（白名单）：国三 4 项。
- 中国国际大学生创新大赛-山东省省赛（白名单）：银奖 1 项，铜奖 1 项。
- 中国大学生计算机设计大赛（白名单）：国三。
- 全国大学生算法设计与编程挑战赛：国铜。
- “泰迪杯”数据分析技能赛：国三。

## 志愿实践与校内任职
- 志愿服务累计 200+ 小时，获“优秀志愿者”14 次。
- 参与社会实践 4 次。
- 任职：图书馆志愿者协会部长、创业园负责人、班级心理委员、教师助理。

## 学术服务与社区贡献
- 审稿与会议服务：TKDE（CCF-A）、ICME 2025/2026（CCF-B）、AVSS 2025（CORE-B）等。
- 社区贡献：华为昇腾核心开发者、Datawhale 社区贡献者。
- 学术组织会员：AAAI 学生会员、CCF 学生会员、SDAI 学生会员。
- 参会经历：
  - 2024 泰山智能产业创新发展大会
  - 2024 中国计算机大会（CNCC）
  - 2025 世界人工智能大会（WAIC）
  - 2025 国际智能计算学术会议（ICIC）
  - 2025 英国机器视觉会议（BMVC）
  - 2026 美国人工智能协会年会（AAAI）
  - 2026 国际音频信号处理会议（ICASSP）
