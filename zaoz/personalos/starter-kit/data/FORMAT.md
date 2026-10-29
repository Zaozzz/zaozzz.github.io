# 数据格式

文件是 UTF-8 JSON，`schemaVersion` 固定为 `1`。所有列表中的 `id` 必须非空且在本列表内唯一。新增时生成新编号，修改时保留原编号。网页导入的大小限制为 2MB，每个列表最多 5000 条。

- `meta`：`title`、`updatedAt`（ISO 时间或 `null`）、`fictional`（布尔值）。虚构示例设为 `true`，正式空白工作区为 `false`。
- `profile`：`name`、`role`、`focus`、`notes` 均为文字。没有提供的信息使用空字符串。
- `settings.dailyMinutes`：0–1440 的计划时间容量。默认 240 只是可修改的初始设置，不是已发生的工作时长。
- `tasks`：`id`、`title`、`project`、`priority`、`plannedMinutes`、`actualMinutes`、`due`、`status`、`nextStep`、`notes`。
  - `priority`：`high`、`normal`、`low`。
  - `status`：`planned`（计划）、`active`（进行中）、`partial`（部分完成）、`done`（已完成）、`paused`（暂缓）。`planned` 不代表已经报告“尚未开始”。
  - `due` 为 `YYYY-MM-DD` 或空字符串。预计／实际分钟均为 0–1440 的数值或 `null`；实际分钟只来自本人报告。
- `schedule`：`id`、`title`、`date`、`start`、`end`、`notes`。日期是有效的 `YYYY-MM-DD`，时间是 `HH:MM`；同一天内结束晚于开始。日程全部表示计划。
- `records`：`id`、`title`、`date`、`kind`、`minutes`、`amount`、`notes`。
  - `kind`：`work`、`study`、`health`、`expense`、`income`、`review`。
  - `minutes` 为实际报告的分钟（0–1440）或 `null`。`amount` 为金额（0–1000000000）或 `null`，收支类型必须有有效金额。应用不会计算没有期初依据的账户余额。
- `decisions`：`id`、`title`、`context`、`options`、`status`、`selectedId`、`confirmedAt`、`reviewAt`、`reason`、`history`。
  - `options` 有 2–6 项，每项含 `id`、`label`、`benefit`、`cost`，选项编号在该决策中唯一。
  - AI 新建或整理的决策保持 `status: "open"`、`selectedId: null`、`confirmedAt: null`。
  - 本人在网页确认后，`status` 为 `confirmed`，`selectedId` 指向一个现有选项，`confirmedAt` 为真实 ISO 时间，并追加一条历史。
  - `reviewAt` 为日期或空字符串。`history` 每条含 `selectedId`、`at`、`reason`；重新比较也保留历史。

示例是字段结构的参考，不是任何用户的事实来源。标题不超过 160 字符，普通长文字不超过 4000 字符。新增字段前同时检查网页和校验工具的兼容性。
