#!/usr/bin/env python3
"""Optional read-only validation. Standard library only; no installation needed."""
import datetime
import json
import math
import re
import sys
from pathlib import Path


def check(data):
    def require(condition, message):
        if not condition:
            raise ValueError(message)

    def text(value, limit=4000):
        return isinstance(value, str) and len(value) <= limit

    def number(value, maximum):
        return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value) and 0 <= value <= maximum

    def optional(value, maximum):
        return value is None or number(value, maximum)

    def day(value):
        try:
            return isinstance(value, str) and re.fullmatch(r'\d{4}-\d{2}-\d{2}', value) is not None and datetime.date.fromisoformat(value).isoformat() == value
        except ValueError:
            return False

    def timestamp(value):
        try:
            return text(value, 80) and bool(datetime.datetime.fromisoformat(value.replace('Z', '+00:00')))
        except (ValueError, AttributeError):
            return False

    require(isinstance(data, dict) and type(data.get('schemaVersion')) is int and data.get('schemaVersion') == 1, 'schemaVersion 必须为 1。')
    meta = data.get('meta', {})
    require(isinstance(meta, dict) and all(k in meta for k in ['title', 'updatedAt', 'fictional']) and text(meta.get('title'), 80) and isinstance(meta.get('fictional'), bool) and (meta.get('updatedAt') is None or timestamp(meta.get('updatedAt'))), 'meta 无效。')
    profile = data.get('profile', {})
    require(isinstance(profile, dict) and all(text(profile.get(k)) for k in ['name', 'role', 'focus', 'notes']), 'profile 无效。')
    settings = data.get('settings', {})
    require(isinstance(settings, dict) and number(settings.get('dailyMinutes'), 1440), 'dailyMinutes 无效。')
    fields = {'tasks': ['id','title','project','priority','plannedMinutes','actualMinutes','due','status','nextStep','notes'], 'schedule': ['id','title','date','start','end','notes'], 'records': ['id','title','date','kind','minutes','amount','notes'], 'decisions': ['id','title','context','options','status','selectedId','confirmedAt','reviewAt','reason','history']}
    for key in ['tasks', 'schedule', 'records', 'decisions']:
        rows = data.get(key)
        require(isinstance(rows, list) and len(rows) <= 5000, key + ' 必须为列表，且不超过 5000 条。')
        ids = set()
        for row in rows:
            require(isinstance(row, dict) and all(k in row for k in fields[key]) and text(row.get('id'), 100) and row['id'] and row['id'] not in ids and text(row.get('title'), 160) and row['title'].strip(), key + ' 的编号或标题无效。')
            ids.add(row['id'])
    for row in data['tasks']:
        require(row.get('status') in ['planned', 'active', 'partial', 'done', 'paused'] and row.get('priority') in ['high', 'normal', 'low'] and text(row.get('project'), 160) and text(row.get('nextStep')) and text(row.get('notes')) and (row.get('due') == '' or day(row.get('due'))) and optional(row.get('plannedMinutes'), 1440) and optional(row.get('actualMinutes'), 1440), '任务字段无效。')
    for row in data['schedule']:
        require(day(row.get('date')) and isinstance(row.get('start'), str) and isinstance(row.get('end'), str) and re.fullmatch(r'([01]\d|2[0-3]):[0-5]\d', row['start']) and re.fullmatch(r'([01]\d|2[0-3]):[0-5]\d', row['end']) and row['end'] > row['start'] and text(row.get('notes')), '日程时间或字段无效。')
    for row in data['records']:
        require(day(row.get('date')) and row.get('kind') in ['work', 'study', 'health', 'expense', 'income', 'review'] and text(row.get('notes')) and optional(row.get('minutes'), 1440) and optional(row.get('amount'), 1e9) and not (row['kind'] in ['expense', 'income'] and row.get('amount') is None), '记录字段无效。')
    for row in data['decisions']:
        require(text(row.get('context')) and text(row.get('reason')) and (row.get('reviewAt') == '' or day(row.get('reviewAt'))) and row.get('status') in ['open', 'confirmed'], '决策字段无效。')
        options = row.get('options')
        require(isinstance(options, list) and 2 <= len(options) <= 6, '决策需要 2–6 个选项。')
        ids = set()
        for option in options:
            require(isinstance(option, dict) and text(option.get('id'), 100) and option['id'] and option['id'] not in ids and text(option.get('label'), 160) and option['label'].strip() and text(option.get('benefit')) and text(option.get('cost')), '决策选项无效。')
            ids.add(option['id'])
        require(isinstance(row.get('history'), list) and len(row['history']) <= 1000, '决策历史无效。')
        if row['status'] == 'confirmed':
            require(row.get('selectedId') in ids and timestamp(row.get('confirmedAt')), '已确认的决定缺少有效选择或时间。')
        else:
            require(row.get('selectedId') is None and row.get('confirmedAt') is None, '待决定的事项不能含最终确认。')
        for item in row['history']:
            require(isinstance(item, dict) and text(item.get('selectedId'), 100) and timestamp(item.get('at')) and text(item.get('reason')), '确认历史无效。')
    return data


if __name__ == '__main__':
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / 'data' / 'personal-os.json'
    try:
        if path.stat().st_size > 2000000:
            raise ValueError('JSON 文件不能超过 2MB。')
        content = json.loads(path.read_text(encoding='utf-8'))
        check(content)
    except (OSError, ValueError, KeyError, TypeError) as exc:
        print('验证未通过：' + str(exc), file=sys.stderr)
        sys.exit(1)
    print('验证通过：' + path.name + '；仅检查格式，不代表事实真实性已确认。')
