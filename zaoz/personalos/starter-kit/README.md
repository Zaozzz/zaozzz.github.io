# PersonalOS Starter 1.0.0

由 ZAOZ 提供的简易个人工作台基础包。解压后双击 `PersonalOS.html` 即可使用，再让 AI 编辑器帮助整理自己的资料与计划。

先读 [START_HERE.md](START_HERE.md)。可直接交给 AI 的搭建提示词在 [PROMPT.md](PROMPT.md)。

## 已有功能

- 今日任务：优先级、下一步、期限、预计分钟、实际分钟与进度分开记录。
- 日程：按日期安排时段，导出带提前十分钟提醒信息的 `.ics` 文件；需自己导入日历并核对本地时区与提醒设置。
- 记录：工作、学习、身体、收支和回顾。未填写数字保持为空，不自动补零。
- 决策：并列比较方案；由本人确认，并保留已确认选择的历史。
- 导入／导出：完整 JSON 文件；覆盖工作区前保留一个浏览器副本，可在“资料”中导出。

任务的实际分钟与“记录中的实际用时”分别展示，不将两处数据相加，避免把同一次活动重复累计。状态变化不会自动填入实际用时。

## 文件

| 路径 | 用途 |
| --- | --- |
| `PersonalOS.html` | 完整离线网页，样式、图标和代码都在文件内 |
| `data/personal-os.json` | 空白资料与 AI／网页之间交换的数据文件 |
| `data/FORMAT.md` | 字段及状态说明 |
| `examples/fictional-person.json` | 虚构人物示例，可通过网页“导入”体验 |
| `notes/PERSON.md` | 已确认的个人背景与边界 |
| `notes/GOALS.md` | 目标、期限与任务拆分 |
| `notes/DAILY_REVIEW.md` | 每日回顾模板 |
| `notes/DECISION.md` | 决策比较模板 |
| `backups/` | 放导出文件和 AI 修改前的副本 |
| `tools/validate.py` | 可选的标准库校验工具，不是使用网页的依赖 |
| `MANIFEST.json` | 包内文件的大小与 SHA-256 校验值（不包含清单本身） |

## 数据如何流转

**AI 修改文件 → 网页“导入” → 网页操作 → 网页“导出” → 备份后保存到工作区 → AI 继续整理。**

首次打开网页是空白资料，不会自行读取旁边的 JSON。AI 改好的资料需要手动导入。

网页使用浏览器本地存储，不会自动改写磁盘文件，也不会把记录发到服务器。不同浏览器、不同网页路径可能使用不同的存储位置；移动文件、换设备或清理浏览器前必须导出。浏览器内的“上一次副本”不是独立的文件备份。

网页不含大模型、不读取其他文件夹、不接入真实账户，也没有自动发信、付款或后台提醒。AI 编辑器的联网与隐私策略由该产品及你选择的模型、设置决定。

## 日常给 AI 的一句话

> 先读取我最新导出的 JSON 和 `data/personal-os.json`，比较差异并备份后合并；不要把计划当实际。根据我的明确进展整理明天最多三件重要任务，给每项写清下一步和预计用时，最后告诉我需要导入哪个文件。

## 自定义与验证

优先修改 JSON 与 Markdown。新建自己的工作区时保持 `meta.fictional: false`，从空白数据开始；不要把示例历史改名后变成自己的真实记录。

如果已有 Python 3，可选执行：

```sh
python3 tools/validate.py data/personal-os.json
python3 tools/validate.py examples/fictional-person.json
```

没有 Python 也能使用所有网页功能。JSON 导入时网页会验证基本结构、日期、数值、编号和决策确认状态。校验只能检查数据格式，不能证明记录真实或建议适合本人。

## English quick start

Unzip the full folder and open `PersonalOS.html` in a modern browser. No installation, account, Python, Node.js or API key is needed to run the dashboard. Open the whole folder in an AI editor, give it `PROMPT.md`, and ask it to update your blank `data/personal-os.json` and notes. Import that JSON into the dashboard. Export browser changes back to the workspace before asking the AI to read them; files and browser storage do not sync automatically. Examples are fictional. The dashboard does not include an AI model or background reminders.
