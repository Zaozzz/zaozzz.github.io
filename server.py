import argparse
import json
import os
import secrets
import sqlite3
import threading
import time
import uuid
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, unquote, urlparse

try:
    import geoip2.database as _geoip2_db
    _GEOIP_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'analytics', 'geoip', 'GeoLite2-City.mmdb')
    _geoip_reader = _geoip2_db.Reader(_GEOIP_PATH) if os.path.exists(_GEOIP_PATH) else None
except Exception:
    _geoip_reader = None

try:
    import geoip2.database as _geoip2_asn_db
    _ASN_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'analytics', 'geoip', 'GeoLite2-ASN.mmdb')
    _asn_reader = _geoip2_asn_db.Reader(_ASN_PATH) if os.path.exists(_ASN_PATH) else None
except Exception:
    _asn_reader = None


COUNTRY_ISO2_TO_CN = {
    'CN': '中国', 'US': '美国', 'JP': '日本', 'HK': '香港', 'TW': '台湾',
    'SG': '新加坡', 'DE': '德国', 'GB': '英国', 'KR': '韩国', 'RU': '俄罗斯',
    'FR': '法国', 'AU': '澳大利亚', 'CA': '加拿大', 'IN': '印度', 'BR': '巴西',
    'NL': '荷兰', 'IT': '意大利', 'SE': '瑞典', 'NO': '挪威', 'CH': '瑞士',
    'MY': '马来西亚', 'TH': '泰国', 'VN': '越南', 'PH': '菲律宾', 'ID': '印尼',
    'TR': '土耳其', 'SA': '沙特阿拉伯', 'AE': '阿联酋', 'IR': '伊朗', 'IL': '以色列',
    'EG': '埃及', 'ZA': '南非', 'NG': '尼日利亚', 'KE': '肯尼亚', 'MA': '摩洛哥',
    'MX': '墨西哥', 'AR': '阿根廷', 'CL': '智利', 'CO': '哥伦比亚', 'PE': '秘鲁',
    'VE': '委内瑞拉', 'ES': '西班牙', 'PT': '葡萄牙', 'GR': '希腊', 'PL': '波兰',
    'UA': '乌克兰', 'CZ': '捷克', 'HU': '匈牙利', 'RO': '罗马尼亚', 'AT': '奥地利',
    'BE': '比利时', 'DK': '丹麦', 'FI': '芬兰', 'IE': '爱尔兰', 'PT': '葡萄牙',
    'BG': '保加利亚', 'HR': '克罗地亚', 'RS': '塞尔维亚', 'SK': '斯洛伐克', 'SI': '斯洛文尼亚',
    'LT': '立陶宛', 'LV': '拉脱维亚', 'EE': '爱沙尼亚', 'IS': '冰岛', 'LU': '卢森堡',
    'MT': '马耳他', 'CY': '塞浦路斯', 'AL': '阿尔巴尼亚', 'BA': '波黑', 'MK': '北马其顿',
    'NZ': '新西兰', 'FJ': '斐济', 'PG': '巴布亚新几内亚', 'MM': '缅甸', 'KH': '柬埔寨',
    'LA': '老挝', 'BN': '文莱', 'BD': '孟加拉国', 'PK': '巴基斯坦', 'LK': '斯里兰卡',
    'NP': '尼泊尔', 'AF': '阿富汗', 'KZ': '哈萨克斯坦', 'UZ': '乌兹别克斯坦', 'KG': '吉尔吉斯斯坦',
    'TJ': '塔吉克斯坦', 'TM': '土库曼斯坦', 'MN': '蒙古', 'JO': '约旦', 'LB': '黎巴嫩',
    'IQ': '伊拉克', 'SY': '叙利亚', 'YE': '也门', 'OM': '阿曼', 'QA': '卡塔尔',
    'BH': '巴林', 'KW': '科威特', 'PS': '巴勒斯坦', 'DZ': '阿尔及利亚', 'TN': '突尼斯',
    'LY': '利比亚', 'SD': '苏丹', 'ET': '埃塞俄比亚', 'TZ': '坦桑尼亚', 'UG': '乌干达',
    'GH': '加纳', 'CI': '科特迪瓦', 'SN': '塞内加尔', 'CM': '喀麦隆', 'CD': '刚果(金)',
    'CG': '刚果(布)', 'AO': '安哥拉', 'MZ': '莫桑比克', 'ZM': '赞比亚', 'ZW': '津巴布韦',
    'BW': '博茨瓦纳', 'NA': '纳米比亚', 'RW': '卢旺达', 'BI': '布隆迪', 'MG': '马达加斯加',
    'MU': '毛里求斯', 'RE': '留尼汪', 'GM': '冈比亚', 'ML': '马里', 'BF': '布基纳法索',
    'BJ': '贝宁', 'TG': '多哥', 'NE': '尼日尔', 'TD': '乍得', 'CF': '中非',
    'SO': '索马里', 'DJ': '吉布提', 'ER': '厄立特里亚', 'SS': '南苏丹', 'LS': '莱索托',
    'SZ': '斯威士兰', 'KM': '科摩罗', 'CV': '佛得角', 'ST': '圣多美和普林西比', 'GW': '几内亚比绍',
    'GN': '几内亚', 'SL': '塞拉利昂', 'LR': '利比里亚', 'MR': '毛里塔尼亚', 'EH': '西撒哈拉',
    'DO': '多米尼加', 'CU': '古巴', 'JM': '牙买加', 'HT': '海地', 'BS': '巴哈马',
    'BB': '巴巴多斯', 'TT': '特立尼达和多巴哥', 'PA': '巴拿马', 'CR': '哥斯达黎加', 'GT': '危地马拉',
    'HN': '洪都拉斯', 'SV': '萨尔瓦多', 'NI': '尼加拉瓜', 'BZ': '伯利兹', 'EC': '厄瓜多尔',
    'BO': '玻利维亚', 'PY': '巴拉圭', 'UY': '乌拉圭', 'GY': '圭亚那', 'SR': '苏里南',
    'IS': '冰岛', 'GL': '格陵兰', 'FO': '法罗群岛', 'AX': '奥兰群岛', 'SJ': '斯瓦尔巴',
    'LI': '列支敦士登', 'MC': '摩纳哥', 'AD': '安道尔', 'SM': '圣马力诺', 'VA': '梵蒂冈',
    'BY': '白俄罗斯', 'MD': '摩尔多瓦', 'GE': '格鲁吉亚', 'AM': '亚美尼亚', 'AZ': '阿塞拜疆',
    'TW': '台湾', 'MO': '澳门', 'KP': '朝鲜', 'BT': '不丹', 'MV': '马尔代夫',
}


SITE_TITLE = "Xu Wang"


def _country_display(country_code: str, country_name: str = '') -> str:
    """返回国家中文名：优先用 country_name，否则用 ISO2 映射，再否则返回代码。"""
    code = (country_code or '').strip().upper()
    name = (country_name or '').strip()
    if name and name not in ('Unknown', 'unknown', ''):
        return name
    if code and code != 'ZZ':
        return COUNTRY_ISO2_TO_CN.get(code, code)
    return '未知'


def _utc_date_str(ts: float | None = None) -> str:
    if ts is None:
        ts = time.time()
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")


def _utc_now_iso() -> str:
    return datetime.now(tz=timezone.utc).isoformat(timespec="seconds")


def _load_json(path: str, default):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def _atomic_write_json(path: str, data) -> None:
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    tmp = f"{path}.tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp, path)


def _json_bytes(payload) -> bytes:
    return json.dumps(payload, ensure_ascii=False).encode("utf-8")


# Blog admin credentials (mirrored in frontend Auth.jsx).
ADMIN_NICKNAME = "wangxu"
ADMIN_PASSWORD = "0520"


def _geoip_lookup(ip):
    if _geoip_reader is None:
        return {}
    try:
        resp = _geoip_reader.city(ip)
        subdivisions = list(resp.subdivisions)
        subdivision_1 = ''
        subdivision_2 = ''
        subdivision_3 = ''
        if len(subdivisions) >= 1:
            subdivision_1 = subdivisions[0].names.get('zh-CN') or subdivisions[0].name or ''
        if len(subdivisions) >= 2:
            subdivision_2 = subdivisions[1].names.get('zh-CN') or subdivisions[1].name or ''
        if len(subdivisions) >= 3:
            subdivision_3 = subdivisions[2].names.get('zh-CN') or subdivisions[2].name or ''

        return {
            'country_code': resp.country.iso_code or 'Unknown',
            'country_name': resp.country.names.get('zh-CN') or resp.country.name or 'Unknown',
            'region': subdivision_1 or 'Unknown',
            'region_code': subdivisions[0].iso_code if len(subdivisions) >= 1 else '',
            'subdivision_2': subdivision_2,
            'subdivision_3': subdivision_3,
            'city': resp.city.names.get('zh-CN') or resp.city.name or 'Unknown',
            'postal_code': resp.postal.code or '',
            'latitude': resp.location.latitude,
            'longitude': resp.location.longitude,
            'timezone': resp.location.time_zone or 'Unknown',
        }
    except Exception:
        return {}


def _asn_lookup(ip):
    if _asn_reader is not None:
        try:
            resp = _asn_reader.asn(ip)
            return resp.autonomous_system_number, (resp.autonomous_system_organization or 'Unknown')
        except Exception:
            pass
    return None, 'Unknown'


class AnalyticsStore:
    def __init__(self, path: str, keep_days: int = 120) -> None:
        self.path = path
        self.keep_days = keep_days
        self.lock = threading.Lock()
        self.data = _load_json(path, {})
        if not isinstance(self.data, dict):
            self.data = {}
        self.data.setdefault("version", 1)
        self.data.setdefault("daily", {})
        self.data.setdefault("visitors", {})

    def _prune(self, now_ts: float) -> None:
        cutoff_date = datetime.fromtimestamp(now_ts, tz=timezone.utc).date() - timedelta(days=self.keep_days)
        daily = self.data.get("daily", {})
        if isinstance(daily, dict):
            for key in list(daily.keys()):
                try:
                    day = datetime.strptime(key, "%Y-%m-%d").date()
                except Exception:
                    daily.pop(key, None)
                    continue
                if day < cutoff_date:
                    daily.pop(key, None)
        visitors = self.data.get("visitors", {})
        if isinstance(visitors, dict):
            for visitor_id, info in list(visitors.items()):
                last = ""
                if isinstance(info, dict):
                    last = str(info.get("last") or "")
                try:
                    day = datetime.strptime(last, "%Y-%m-%d").date()
                except Exception:
                    visitors.pop(visitor_id, None)
                    continue
                if day < cutoff_date:
                    visitors.pop(visitor_id, None)

    def record_pageview(self, country: str, visitor_id: str, now_ts: float | None = None) -> None:
        if now_ts is None:
            now_ts = time.time()
        country = (country or "ZZ").upper()
        if len(country) != 2:
            country = "ZZ"
        date_str = _utc_date_str(now_ts)
        with self.lock:
            self._prune(now_ts)
            daily = self.data.setdefault("daily", {})
            day = daily.setdefault(date_str, {})
            stats = day.setdefault(country, {"pv": 0, "uv": 0})
            if not isinstance(stats, dict):
                stats = {"pv": 0, "uv": 0}
                day[country] = stats
            stats["pv"] = int(stats.get("pv") or 0) + 1
            visitors = self.data.setdefault("visitors", {})
            info = visitors.get(visitor_id)
            last = str(info.get("last") or "") if isinstance(info, dict) else ""
            if last != date_str:
                stats["uv"] = int(stats.get("uv") or 0) + 1
                visitors[visitor_id] = {"last": date_str}
            _atomic_write_json(self.path, self.data)

    def summary(self, days: int | None = 30) -> dict:
        now = datetime.now(tz=timezone.utc).date()
        daily = self.data.get("daily", {})
        if not isinstance(daily, dict):
            daily = {}
        if days is None:
            start = None
        else:
            try:
                days = int(days)
            except Exception:
                days = 30
            if days <= 0:
                days = 30
            start = now - timedelta(days=days - 1)
        by_country = {}
        total_pv = 0
        total_uv = 0
        series = []
        if start is not None:
            day = start
            while day <= now:
                series.append({"date": day.strftime("%Y-%m-%d"), "pv": 0, "uv": 0})
                day += timedelta(days=1)
        else:
            for date_str in sorted(daily.keys()):
                series.append({"date": date_str, "pv": 0, "uv": 0})
        for date_str, country_map in daily.items():
            try:
                day = datetime.strptime(date_str, "%Y-%m-%d").date()
            except Exception:
                continue
            if start is not None and day < start:
                continue
            if not isinstance(country_map, dict):
                continue
            bucket = None
            if start is not None:
                idx = (day - start).days
                if 0 <= idx < len(series):
                    bucket = series[idx]
            else:
                bucket = next((item for item in series if item["date"] == date_str), None)
            for cc, stats in country_map.items():
                if not isinstance(stats, dict):
                    continue
                pv = int(stats.get("pv") or 0)
                uv = int(stats.get("uv") or 0)
                country_stats = by_country.setdefault(str(cc).upper(), {"pv": 0, "uv": 0})
                country_stats["pv"] += pv
                country_stats["uv"] += uv
                total_pv += pv
                total_uv += uv
                if bucket is not None:
                    bucket["pv"] += pv
                    bucket["uv"] += uv
        return {
            "windowDays": days,
            "updatedAt": _utc_now_iso(),
            "total": {"pv": total_pv, "uv": total_uv},
            "byCountry": by_country,
            "series": series,
        }


class SQLiteAnalytics:
    def __init__(self, db_path: str, schema_path: str):
        self.db_path = db_path
        self.schema_path = schema_path
        self.lock = threading.Lock()
        self._ensure_db()

    def _ensure_db(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        if not os.path.exists(self.schema_path):
            return
        with sqlite3.connect(self.db_path) as conn:
            with open(self.schema_path, 'r', encoding='utf-8') as f:
                conn.executescript(f.read())
            self._ensure_columns(conn)

    def _ensure_columns(self, conn):
        def has_column(table, col):
            rows = conn.execute(f"PRAGMA table_info({table})").fetchall()
            return any(r[1] == col for r in rows)

        access_logs_extra = [
            ('region', 'TEXT'), ('region_code', 'TEXT'), ('timezone', 'TEXT'),
            ('asn', 'INTEGER'), ('device_type', 'TEXT'), ('isp', 'TEXT'),
            ('country_name', 'TEXT'), ('latitude', 'REAL'), ('longitude', 'REAL'),
            ('postal_code', 'TEXT'), ('subdivision_2', 'TEXT'), ('subdivision_3', 'TEXT'),
        ]
        for col, col_type in access_logs_extra:
            if not has_column('access_logs', col):
                conn.execute(f"ALTER TABLE access_logs ADD COLUMN {col} {col_type}")

        ip_stats_extra = [
            ('region', 'TEXT'), ('region_code', 'TEXT'), ('timezone', 'TEXT'),
            ('asn', 'INTEGER'), ('device_type', 'TEXT'), ('isp', 'TEXT'),
            ('country_name', 'TEXT'), ('latitude', 'REAL'), ('longitude', 'REAL'),
            ('postal_code', 'TEXT'), ('subdivision_2', 'TEXT'), ('subdivision_3', 'TEXT'),
        ]
        for col, col_type in ip_stats_extra:
            if not has_column('ip_stats', col):
                conn.execute(f"ALTER TABLE ip_stats ADD COLUMN {col} {col_type}")

        if not has_column('page_stats', 'updated_at'):
            conn.execute("ALTER TABLE page_stats ADD COLUMN updated_at DATETIME")

    def _device_type_from_ua(self, user_agent):
        ua = (user_agent or '').lower()
        if any(k in ua for k in ['bot', 'spider', 'crawler', 'slurp', 'facebookexternalhit']):
            return 'bot'
        if any(k in ua for k in ['ipad', 'tablet']):
            return 'tablet'
        if any(k in ua for k in ['mobi', 'iphone', 'android', 'phone']):
            return 'mobile'
        if not ua:
            return 'unknown'
        return 'desktop'

    def record_pageview(self, ip_address: str, country: str, request_path: str, referer: str, user_agent: str, session_id: str):
        if ip_address.startswith('127.') or ip_address.startswith('::1') or ip_address.startswith('0:0:0:0:0:0:0:1'):
            return

        now = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        device_type = self._device_type_from_ua(user_agent)

        geo = _geoip_lookup(ip_address)
        country_code = geo.get('country_code', 'Unknown') if geo else 'Unknown'
        if country and len(country) == 2 and country != 'ZZ':
            country_code = country
        country_name = geo.get('country_name', 'Unknown')
        region = geo.get('region', 'Unknown')
        region_code = geo.get('region_code', '')
        subdivision_2 = geo.get('subdivision_2', '')
        subdivision_3 = geo.get('subdivision_3', '')
        city = geo.get('city', 'Unknown')
        postal_code = geo.get('postal_code', '')
        latitude = geo.get('latitude')
        longitude = geo.get('longitude')
        timezone = geo.get('timezone', 'Unknown')
        asn, isp = _asn_lookup(ip_address)

        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                self._ensure_columns(conn)
                conn.execute("""
                    INSERT INTO access_logs
                    (timestamp, ip_address, user_agent, request_method, request_path,
                     response_code, referer, country, country_name, city, session_id,
                     region, region_code, timezone, asn, device_type, isp,
                     latitude, longitude, postal_code, subdivision_2, subdivision_3)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    now, ip_address, user_agent, 'PAGEVIEW', request_path,
                    200, referer,
                    country_code, country_name, city, session_id,
                    region, region_code or '', timezone, asn, device_type, isp,
                    latitude, longitude, postal_code, subdivision_2, subdivision_3,
                ))

                conn.execute("""
                    INSERT OR REPLACE INTO ip_stats
                    (ip_address, visit_count, first_visit, last_visit,
                     country, country_name, city, region, region_code, timezone,
                     asn, device_type, isp, latitude, longitude, postal_code,
                     subdivision_2, subdivision_3)
                    VALUES (
                        ?,
                        COALESCE((SELECT visit_count FROM ip_stats WHERE ip_address = ?) + 1, 1),
                        COALESCE((SELECT first_visit FROM ip_stats WHERE ip_address = ?), ?),
                        ?,
                        ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?,
                        ?, ?
                    )
                """, (
                    ip_address, ip_address, ip_address, now, now,
                    country_code, country_name, city, region, region_code or '', timezone,
                    asn, device_type, isp, latitude, longitude, postal_code,
                    subdivision_2, subdivision_3,
                ))

                existing = conn.execute(
                    "SELECT visit_count, unique_visitors FROM page_stats WHERE page_path = ?",
                    (request_path,)
                ).fetchone()
                if existing:
                    conn.execute(
                        "UPDATE page_stats SET visit_count = visit_count + 1, updated_at = ? WHERE page_path = ?",
                        (now, request_path)
                    )
                else:
                    conn.execute(
                        "INSERT INTO page_stats (page_path, visit_count, unique_visitors, updated_at) VALUES (?, 1, 1, ?)",
                        (request_path, now)
                    )

    def get_summary_stats(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            self._ensure_columns(conn)

            total_visits = conn.execute("SELECT COUNT(*) as c FROM access_logs").fetchone()['c']
            unique_visitors = conn.execute("SELECT COUNT(DISTINCT ip_address) as c FROM access_logs").fetchone()['c']
            today_visits = conn.execute(
                "SELECT COUNT(*) as c FROM access_logs WHERE DATE(datetime(timestamp, '+8 hours')) = DATE(datetime('now', '+8 hours'))"
            ).fetchone()['c']
            days_count = conn.execute(
                "SELECT COUNT(DISTINCT DATE(datetime(timestamp, '+8 hours'))) as c FROM access_logs"
            ).fetchone()['c']
            avg_daily_visits = total_visits // max(days_count, 1)

            avg_session_duration_ms = 0
            try:
                row = conn.execute("""
                    SELECT ROUND(AVG(session_total), 0) AS avg_ms FROM (
                        SELECT session_id, SUM(COALESCE(duration_ms, 0)) AS session_total
                        FROM page_events
                        WHERE duration_ms IS NOT NULL AND duration_ms >= 0
                          AND session_id IS NOT NULL AND session_id != ''
                        GROUP BY session_id
                    )
                """).fetchone()
                avg_session_duration_ms = int(row['avg_ms'] or 0) if row else 0
            except Exception:
                pass

            return {
                'total_visits': total_visits,
                'unique_visitors': unique_visitors,
                'today_visits': today_visits,
                'avg_daily_visits': avg_daily_visits,
                'avg_session_duration_ms': avg_session_duration_ms,
            }

    def get_daily_stats(self, days=30):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            now_bj = datetime.utcnow() + timedelta(hours=8)
            end_date = now_bj.strftime('%Y-%m-%d')
            start_date = (now_bj - timedelta(days=days)).strftime('%Y-%m-%d')
            cursor = conn.execute("""
                SELECT DATE(datetime(timestamp, '+8 hours')) as date,
                       COUNT(*) as visits,
                       COUNT(DISTINCT ip_address) as unique_visitors
                FROM access_logs
                WHERE DATE(datetime(timestamp, '+8 hours')) BETWEEN ? AND ?
                GROUP BY DATE(datetime(timestamp, '+8 hours'))
                ORDER BY date
            """, (start_date, end_date))
            return [{'date': r['date'], 'visits': r['visits'], 'unique_visitors': r['unique_visitors']}
                    for r in cursor.fetchall()]

    def get_geo_stats(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            self._ensure_columns(conn)
            cursor = conn.execute("""
                SELECT country, COUNT(*) as visits, COUNT(DISTINCT ip_address) as unique_visitors
                FROM access_logs
                WHERE country NOT IN ('Unknown', 'Local', '') AND LENGTH(country) = 2
                GROUP BY country ORDER BY visits DESC LIMIT 250
            """)
            return [{'country': r['country'], 'visits': r['visits'],
                     'unique_visitors': r['unique_visitors']}
                    for r in cursor.fetchall()]

    def get_geo_display_stats(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            self._ensure_columns(conn)
            cursor = conn.execute("""
                SELECT country,
                       COALESCE(NULLIF(country_name,''), NULLIF(country,'')) as country_name,
                       COUNT(*) as visits, COUNT(DISTINCT ip_address) as unique_visitors
                FROM access_logs
                WHERE country NOT IN ('Unknown', 'Local', '')
                GROUP BY country ORDER BY visits DESC LIMIT 50
            """)
            result = []
            for r in cursor.fetchall():
                code = (r['country'] or '').strip().upper()
                cn = (r['country_name'] or '').strip()
                display = _country_display(code, cn)
                result.append({'country': r['country'], 'country_display': display,
                                'visits': r['visits'], 'unique_visitors': r['unique_visitors']})
            return result

    def get_region_stats(self, limit=60):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            self._ensure_columns(conn)
            cursor = conn.execute("""
                SELECT country, COALESCE(NULLIF(country_name,''), '') as country_name,
                       COALESCE(NULLIF(region,''), 'Unknown') as region,
                       COALESCE(NULLIF(subdivision_2,''), '') as subdivision_2,
                       COALESCE(NULLIF(subdivision_3,''), '') as subdivision_3,
                       COALESCE(NULLIF(city,''), 'Unknown') as city,
                       COUNT(*) as visits, COUNT(DISTINCT ip_address) as unique_visitors
                FROM access_logs
                WHERE country NOT IN ('Unknown', 'Local', '', 'ZZ')
                GROUP BY country, region, subdivision_2, subdivision_3, city ORDER BY visits DESC LIMIT ?
            """, (int(limit),))
            return [{'country': r['country'],
                     'country_display': _country_display(r['country'], r['country_name']),
                     'region': r['region'],
                     'subdivision_2': r['subdivision_2'], 'subdivision_3': r['subdivision_3'],
                     'city': r['city'], 'visits': r['visits'], 'unique_visitors': r['unique_visitors']}
                    for r in cursor.fetchall()]

    def get_hourly_stats(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT strftime('%H', datetime(timestamp, '+8 hours')) as hour, COUNT(*) as visits
                FROM access_logs WHERE DATE(datetime(timestamp, '+8 hours')) >= DATE(datetime('now', '+8 hours'), '-7 days')
                GROUP BY hour ORDER BY hour
            """)
            return [{'hour': int(r['hour']), 'visits': r['visits']} for r in cursor.fetchall()]

    def get_page_stats(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT request_path as path, COUNT(*) as visits,
                       COUNT(DISTINCT ip_address) as unique_visitors
                FROM access_logs
                WHERE request_path NOT LIKE '%.css' AND request_path NOT LIKE '%.js'
                  AND request_path NOT LIKE '%.png' AND request_path NOT LIKE '%.jpg'
                  AND request_path NOT LIKE '%.ico' AND request_path NOT LIKE '%.gif'
                GROUP BY request_path ORDER BY visits DESC LIMIT 20
            """)
            return [{'path': r['path'], 'visits': r['visits'],
                     'unique_visitors': r['unique_visitors'], 'bounce_rate': 0}
                    for r in cursor.fetchall()]

    def get_device_stats(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT COALESCE(NULLIF(device_type,''), 'unknown') as device_type,
                       COUNT(*) as visits, COUNT(DISTINCT ip_address) as unique_visitors
                FROM access_logs GROUP BY device_type ORDER BY visits DESC
            """)
            return [{'device_type': r['device_type'], 'visits': r['visits'],
                     'unique_visitors': r['unique_visitors']}
                    for r in cursor.fetchall()]

    def get_isp_stats(self, limit=20):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT COALESCE(NULLIF(isp,''), 'Unknown') as isp,
                       COUNT(*) as visits, COUNT(DISTINCT ip_address) as unique_visitors
                FROM access_logs GROUP BY isp ORDER BY visits DESC LIMIT ?
            """, (int(limit),))
            return [{'isp': r['isp'], 'visits': r['visits'],
                     'unique_visitors': r['unique_visitors']}
                    for r in cursor.fetchall()]

    def get_ip_stats(self):
        def mask_ip(ip_address):
            ip = (ip_address or '').strip()
            if ':' in ip:
                parts = ip.split(':')
                return ':'.join(parts[:2] + ['****']) if len(parts) >= 2 else '****'
            parts = ip.split('.')
            return '.'.join(parts[:3] + ['***']) if len(parts) == 4 else (ip or 'Unknown')

        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT ip_address, visit_count, country, country_name, city, region,
                       subdivision_2, subdivision_3,
                       isp, asn, device_type, first_visit, last_visit
                FROM ip_stats ORDER BY visit_count DESC LIMIT 50
            """)
            result = []
            for r in cursor.fetchall():
                code = (r['country'] or '').strip().upper()
                cn = (r['country_name'] or '').strip()
                display = _country_display(code, cn)
                result.append({
                    'ip_address': r['ip_address'],
                    'ip_display': mask_ip(r['ip_address']),
                    'visit_count': r['visit_count'],
                    'country': r['country'] or 'Unknown',
                    'country_display': display,
                    'city': r['city'] or 'Unknown',
                    'region': r['region'] or 'Unknown',
                    'subdivision_2': r['subdivision_2'] or '',
                    'subdivision_3': r['subdivision_3'] or '',
                    'isp': r['isp'] or 'Unknown',
                    'asn': r['asn'],
                    'device_type': r['device_type'] or 'Unknown',
                    'first_visit': r['first_visit'],
                    'last_visit': r['last_visit'],
                })
            return result

    def get_referrer_stats(self, limit=30):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT COALESCE(NULLIF(referer,''), '(direct)') as referer, COUNT(*) as visits
                FROM access_logs GROUP BY referer ORDER BY visits DESC LIMIT ?
            """, (int(limit),))
            return [{'referer': r['referer'], 'visits': r['visits']} for r in cursor.fetchall()]

    def get_recent_visits(self, limit=120):
        def mask_ip(ip_address):
            ip = (ip_address or '').strip()
            if ':' in ip:
                parts = ip.split(':')
                return ':'.join(parts[:2] + ['****']) if len(parts) >= 2 else '****'
            parts = ip.split('.')
            return '.'.join(parts[:3] + ['***']) if len(parts) == 4 else (ip or 'Unknown')

        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT timestamp, ip_address, country, country_name, region, subdivision_2, subdivision_3,
                       city, postal_code, latitude, longitude,
                       isp, asn, device_type, request_path, referer, session_id
                FROM access_logs ORDER BY timestamp DESC LIMIT ?
            """, (int(limit),))
            result = []
            for r in cursor.fetchall():
                code = (r['country'] or '').strip().upper()
                cn = (r['country_name'] or '').strip()
                display = cn if (cn and cn not in ('Unknown', '') and len(cn) != 2) else COUNTRY_ISO2_TO_CN.get(code, code)
                result.append({
                    'timestamp': r['timestamp'],
                    'ip_address': r['ip_address'],
                    'ip_display': mask_ip(r['ip_address']),
                    'country': r['country'] or 'Unknown',
                    'country_display': display,
                    'region': r['region'] or 'Unknown',
                    'subdivision_2': r['subdivision_2'] or '',
                    'subdivision_3': r['subdivision_3'] or '',
                    'city': r['city'] or 'Unknown',
                    'postal_code': r['postal_code'] or '',
                    'latitude': r['latitude'],
                    'longitude': r['longitude'],
                    'isp': r['isp'] or 'Unknown',
                    'asn': r['asn'],
                    'device_type': r['device_type'] or 'unknown',
                    'path': r['request_path'] or '/',
                    'referer': r['referer'] or '',
                    'session_id': r['session_id'] or '',
                })
            return result

    def get_live_data(self):
        def mask_ip(ip_address):
            ip = (ip_address or '').strip()
            if ':' in ip:
                parts = ip.split(':')
                return ':'.join(parts[:2] + ['****']) if len(parts) >= 2 else '****'
            parts = ip.split('.')
            return '.'.join(parts[:3] + ['***']) if len(parts) == 4 else ip

        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            _online = conn.execute("""
                SELECT COUNT(DISTINCT session_id) as cnt
                FROM access_logs
                WHERE timestamp >= datetime('now', '-5 minutes')
                  AND session_id IS NOT NULL AND session_id != ''
            """).fetchone()
            online_now = int(_online['cnt'] or 0)

            _rows = conn.execute("""
                SELECT timestamp, ip_address, country, country_name,
                       region, subdivision_2, subdivision_3, city, postal_code,
                       latitude, longitude, device_type, request_path
                FROM access_logs
                ORDER BY timestamp DESC LIMIT 25
            """).fetchall()

            result = {
                'online_now': online_now,
                'server_time_bj': (datetime.utcnow() + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S'),
                'recent': [{
                    'timestamp_bj': (datetime.strptime(r['timestamp'][:19], '%Y-%m-%d %H:%M:%S') + timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S'),
                    'timestamp_utc': r['timestamp'] or '',
                    'ip_display': mask_ip(r['ip_address']),
                    'country': r['country'] or 'Unknown',
                    'country_display': _country_display(r['country'] or '', r['country_name'] or ''),
                    'region': r['region'] or '',
                    'subdivision_2': r['subdivision_2'] or '',
                    'subdivision_3': r['subdivision_3'] or '',
                    'city': r['city'] or '',
                    'postal_code': r['postal_code'] or '',
                    'latitude': r['latitude'],
                    'longitude': r['longitude'],
                    'device_type': r['device_type'] or 'unknown',
                    'path': r['request_path'] or '/',
                } for r in _rows],
            }
            return result

    def get_all_stats(self):
        return {
            'summary': self.get_summary_stats(),
            'daily_stats': self.get_daily_stats(),
            'geo_stats': self.get_geo_stats(),
            'geo_display_stats': self.get_geo_display_stats(),
            'region_stats': self.get_region_stats(),
            'hourly_stats': self.get_hourly_stats(),
            'page_stats': self.get_page_stats(),
            'device_stats': self.get_device_stats(),
            'isp_stats': self.get_isp_stats(),
            'ip_stats': self.get_ip_stats(),
            'referrer_stats': self.get_referrer_stats(),
            'recent_visits': self.get_recent_visits(),
            'last_updated': datetime.now().isoformat(),
        }


class ProjectStore:
    def __init__(self, path: str):
        self.path = path
        self.lock = threading.Lock()
        self._cache = _load_json(self.path, [])
        if not isinstance(self._cache, list):
            self._cache = []

    def _save(self):
        _atomic_write_json(self.path, self._cache)

    def list_tasks(self):
        with self.lock:
            return list(self._cache)

    def create_task(self, title: str, desc: str, publisher: str):
        with self.lock:
            task = {
                "id": secrets.token_hex(8),
                "title": title,
                "desc": desc,
                "status": "pending",
                "report": "",
                "publisher": publisher,
                "created_at": _utc_now_iso(),
            }
            self._cache.insert(0, task)
            self._save()
            return task

    def update_task(self, task_id: str, status: str, report: str):
        with self.lock:
            for task in self._cache:
                if task.get("id") == task_id:
                    if status:
                        task["status"] = status
                    if report is not None:
                        task["report"] = report
                    task["updated_at"] = _utc_now_iso()
                    self._save()
                    return task
            raise ValueError("Task not found.")


class ConfigStore:
    """Persists site configuration (BIO + CATEGORIES) that is otherwise
    hard-coded in the frontend data.jsx. Stored values are merged over the
    DEFAULTS so missing keys always fall back to a sensible value."""

    DEFAULTS = {
        "bio": {
            "name": "Xu Wang",
            "nameCn": "王旭",
            "seal": "旭",
            "role": "Undergraduate student",
            "affiliation": "Shandong Jianzhu University",
            "greet": "Hi · 你好",
            "blurb": "I'm Xu Wang — a student at SDJZU. This is where I write about research and life. Welcome to my corner.",
            "blurbCn": "记录科研学习与日常生活 · 欢迎常来",
            "links": [
                {"label": "wangxu.life", "url": "https://wangxu.life"},
                {"label": "GitHub", "url": "#"},
                {"label": "say hi →", "url": "#"},
            ],
            "highlights": ["山东建筑大学", "科研 · 生活"],
        },
        "categories": {
            "research": {"cn": "科研学习", "en": "Research",    "glyph": "研", "color": "var(--pine)",   "wash": "var(--pine-wash)"},
            "life":     {"cn": "日常生活", "en": "Life",        "glyph": "日", "color": "var(--rust)",   "wash": "var(--rust-wash)"},
        },
    }

    def __init__(self, data_path: str) -> None:
        self.data_path = data_path
        self.lock = threading.Lock()
        self._cache = _load_json(data_path, {"bio": {}, "categories": {}})
        if not isinstance(self._cache, dict):
            self._cache = {"bio": {}, "categories": {}}
        if not isinstance(self._cache.get("bio"), dict):
            self._cache["bio"] = {}
        if not isinstance(self._cache.get("categories"), dict):
            self._cache["categories"] = {}

    def _save(self) -> None:
        _atomic_write_json(self.data_path, self._cache)

    def _merged_unlocked(self) -> dict:
        """Merge stored config over DEFAULTS. Caller must hold self.lock."""
        bio = {**self.DEFAULTS["bio"], **(self._cache.get("bio") or {})}
        cats = {}
        stored_cats = self._cache.get("categories") or {}
        for key, default_cat in self.DEFAULTS["categories"].items():
            cats[key] = {**default_cat, **(stored_cats.get(key) or {})}
        return {"bio": bio, "categories": cats}

    def get_config(self) -> dict:
        with self.lock:
            return self._merged_unlocked()

    def update_config(self, data: dict) -> dict:
        with self.lock:
            if isinstance(data.get("bio"), dict):
                self._cache["bio"] = data["bio"]
            if isinstance(data.get("categories"), dict):
                self._cache["categories"] = data["categories"]
            self._save()
            return self._merged_unlocked()


class BlogStore:
    ZERO_GIFTS = {"flower": 0, "coffee": 0, "bookmark": 0, "bulb": 0, "applause": 0}
    VALID_CATS = {"eng", "research", "life"}
    VALID_GIFTS = set(ZERO_GIFTS.keys())
    VALID_HLCOLOR = {"yellow", "pink", "mint", "blue"}

    def __init__(self, data_path: str) -> None:
        self.data_path = data_path
        self.lock = threading.Lock()
        self._cache = _load_json(data_path, {"posts": {}, "comments": {}, "highlights": {}})
        if not isinstance(self._cache, dict):
            self._cache = {"posts": {}, "comments": {}, "highlights": {}}

    def _save(self) -> None:
        _atomic_write_json(self.data_path, self._cache)

    def _next_post_id(self) -> tuple[str, str]:
        max_n = 0
        for pid in self._cache.get("posts", {}):
            if pid.startswith("p"):
                try:
                    max_n = max(max_n, int(pid[1:]))
                except ValueError:
                    pass
        n = max_n + 1
        return f"p{n:03d}", f"No. {n:03d}"

    def _format_date(self, dt=None) -> str:
        if dt is None:
            dt = datetime.now(tz=timezone.utc)
        return dt.strftime("%B %d, %Y")

    def list_posts(self, status: str = "published", cat: str | None = None, limit: int = 20) -> list:
        with self.lock:
            items = list(self._cache.get("posts", {}).values())
            def keep(p):
                if cat and p.get("cat") != cat:
                    return False
                return p.get("status") == status
            items = [p for p in items if keep(p)]
            items.sort(key=lambda p: p.get("publishedAt", ""), reverse=True)
            return items[:limit]

    def get_post(self, pid: str) -> dict | None:
        with self.lock:
            return self._cache.get("posts", {}).get(pid)

    def create_post(self, data: dict) -> dict:
        with self.lock:
            pid, no = self._next_post_id()
            if "id" in data:
                pid = data["id"]
                no = data.get("no", pid)
            body = data.get("body") or []
            now = datetime.now(tz=timezone.utc)
            post = {
                "id": pid, "no": no,
                "cat": data.get("cat"),
                "title": data.get("title"),
                "date": data.get("date") or self._format_date(now),
                "publishedAt": data.get("publishedAt") or now.isoformat(),
                "readTime": data.get("readTime") or self._read_time_of(body),
                "excerpt": data.get("excerpt") or self._excerpt_of(body),
                "cover": data.get("cover"),
                "body": body,
                "markdown": data.get("markdown"),
                "gifts": dict(self.ZERO_GIFTS),
                "status": data.get("status", "published"),
            }
            self._cache["posts"][pid] = post
            self._save()
            return post

    def update_post(self, pid: str, data: dict) -> dict | None:
        with self.lock:
            post = self._cache.get("posts", {}).get(pid)
            if not post:
                return None
            post.update(data)
            if "body" in data:
                post["readTime"] = data.get("readTime") or self._read_time_of(data["body"])
            self._save()
            return post

    def delete_post(self, pid: str) -> bool:
        with self.lock:
            if pid not in self._cache.get("posts", {}):
                return False
            self._cache["posts"].pop(pid)
            self._cache["comments"].pop(pid, None)
            self._cache["highlights"].pop(pid, None)
            self._save()
            return True

    def _read_time_of(self, body: list) -> str:
        text = " ".join(b.get("text", b.get("code", b.get("caption", ""))) for b in body)
        words = len(text.strip().split())
        cjk = len([c for c in text if "\u4e00" <= c <= "\u9fff"])
        total = words + cjk * 0.6
        return f"{max(1, round(total / 250))} min"

    def _excerpt_of(self, body: list) -> str:
        for b in body:
            if b.get("type") in ("drop", "p"):
                t = b.get("text", "").strip()
                return (t[:217] + "…") if len(t) > 220 else t
        return ""

    def list_comments(self, pid: str) -> list:
        with self.lock:
            comments = self._cache.get("comments", {}).get(pid, [])
            return [{**c, "time": self._time_ago(c.get("createdAt", ""))} for c in comments]

    def add_comment(self, pid: str, nickname: str, text: str, reply_to: str | None = None) -> dict | None:
        with self.lock:
            if pid not in self._cache.get("posts", {}):
                return None
            comment = {
                "id": str(uuid.uuid4()),
                "user": nickname,
                "text": text[:4000],
                "createdAt": datetime.now(tz=timezone.utc).isoformat(),
                "avatarColor": "indigo" if nickname.lower() == "xu wang" else "teal",
                "isAuthor": nickname.lower() == "xu wang",
            }
            if reply_to:
                comment["replyTo"] = reply_to
            self._cache["comments"].setdefault(pid, []).append(comment)
            self._save()
            return {**comment, "time": self._time_ago(comment["createdAt"])}

    def delete_comment(self, pid: str, cid: str) -> bool:
        with self.lock:
            comments = self._cache.get("comments", {}).get(pid, [])
            filtered = [c for c in comments if c["id"] != cid]
            if len(filtered) == len(comments):
                return False
            self._cache["comments"][pid] = filtered
            self._save()
            return True

    def send_gift(self, pid: str, kind: str) -> dict | None:
        with self.lock:
            post = self._cache.get("posts", {}).get(pid)
            if not post or kind not in self.VALID_GIFTS:
                return None
            post["gifts"] = {**self.ZERO_GIFTS, **(post.get("gifts") or {})}
            post["gifts"][kind] += 1
            self._save()
            return {"gifts": post["gifts"]}

    def list_highlights(self, pid: str) -> list:
        with self.lock:
            return self._cache.get("highlights", {}).get(pid, [])

    def add_highlight(self, pid: str, nickname: str, anchor: str, color: str, text: str | None = None) -> dict | None:
        with self.lock:
            if pid not in self._cache.get("posts", {}) or color not in self.VALID_HLCOLOR:
                return None
            highlight = {
                "id": str(uuid.uuid4()),
                "anchor": anchor[:800],
                "color": color,
                "text": text[:4000] if text else None,
                "user": nickname,
                "avatarColor": "indigo" if nickname.lower() == "xu wang" else "teal",
                "createdAt": datetime.now(tz=timezone.utc).isoformat(),
            }
            self._cache["highlights"].setdefault(pid, []).append(highlight)
            self._save()
            return highlight

    def delete_highlight(self, pid: str, hid: str) -> bool:
        with self.lock:
            highlights = self._cache.get("highlights", {}).get(pid, [])
            filtered = [h for h in highlights if h["id"] != hid]
            if len(filtered) == len(highlights):
                return False
            self._cache["highlights"][pid] = filtered
            self._save()
            return True

    def _time_ago(self, iso: str) -> str:
        try:
            then = datetime.fromisoformat(iso.replace("Z", "+00:00"))
            d = (datetime.now(tz=timezone.utc) - then).total_seconds()
        except Exception:
            return ""
        if d < 60:
            return "now"
        if d < 3600:
            return f"{int(d/60)}m"
        if d < 86400:
            return f"{int(d/3600)}h"
        if d < 86400 * 30:
            return f"{int(d/86400)}d"
        return f"{int(d/(86400*30))}mo"


class MapReviewStore:
    """Stores per-city star ratings + text reviews for the /map/ page.
    Data shape: {"reviews": {"<CityName>": [ {id, nickname, rating, text, isAdmin, ts}, ... ]}}."""

    MAX_NICKNAME = 32
    MAX_TEXT = 2000

    def __init__(self, data_path: str) -> None:
        self.data_path = data_path
        self.lock = threading.Lock()
        self._cache = _load_json(data_path, {"reviews": {}})
        if not isinstance(self._cache, dict) or not isinstance(self._cache.get("reviews"), dict):
            self._cache = {"reviews": {}}

    def _save(self) -> None:
        _atomic_write_json(self.data_path, self._cache)

    def list_reviews(self, city: str) -> list:
        with self.lock:
            items = list(self._cache.get("reviews", {}).get(city, []))
        items.sort(key=lambda r: r.get("ts", 0), reverse=True)
        return items

    def add_review(self, city: str, nickname: str, rating: int, text: str, is_admin: bool) -> dict:
        with self.lock:
            review = {
                "id": secrets.token_hex(8),
                "nickname": (nickname or "Guest")[:self.MAX_NICKNAME],
                "rating": int(rating),
                "text": (text or "").strip()[:self.MAX_TEXT],
                "isAdmin": bool(is_admin),
                "ts": time.time(),
            }
            self._cache.setdefault("reviews", {}).setdefault(city, []).append(review)
            self._save()
            return review

    def delete_review(self, city: str, rid: str) -> bool:
        with self.lock:
            items = self._cache.get("reviews", {}).get(city, [])
            filtered = [r for r in items if r.get("id") != rid]
            if len(filtered) == len(items):
                return False
            self._cache["reviews"][city] = filtered
            self._save()
            return True

    def summary(self) -> dict:
        out = {}
        with self.lock:
            for city, items in self._cache.get("reviews", {}).items():
                if not items:
                    continue
                total = sum(int(r.get("rating") or 0) for r in items)
                count = len(items)
                out[city] = {"avg": round(total / count, 2), "count": count}
        return out


class SessionStore:
    def __init__(self, ttl_hours: int = 24 * 7) -> None:
        self.ttl = ttl_hours * 3600
        self.lock = threading.Lock()
        self.sessions: dict[str, dict] = {}

    def create(self, data: dict | None = None) -> str:
        token = secrets.token_urlsafe(24)
        with self.lock:
            self.sessions[token] = {
                "expiresAt": time.time() + self.ttl,
                "data": dict(data or {}),
            }
        return token

    def get(self, token: str, kind: str | None = None) -> dict | None:
        if not token:
            return None
        with self.lock:
            session = self.sessions.get(token)
            if not isinstance(session, dict):
                return None
            expires = float(session.get("expiresAt") or 0)
            if expires < time.time():
                self.sessions.pop(token, None)
                return None
            data = session.get("data")
            if not isinstance(data, dict):
                data = {}
            if kind and data.get("kind") != kind:
                return None
            session["expiresAt"] = time.time() + self.ttl
            return dict(data)

    def destroy(self, token: str) -> None:
        with self.lock:
            self.sessions.pop(token, None)


class AppHandler(SimpleHTTPRequestHandler):
    server_version = "wx-app/2.0"
    _pending_cookie_headers: list[str]

    def __init__(self, *args, directory: str | None = None, **kwargs):
        self._pending_cookie_headers = []
        super().__init__(*args, directory=directory, **kwargs)

    def _parse_cookies(self) -> dict[str, str]:
        raw = self.headers.get("Cookie", "")
        out: dict[str, str] = {}
        for part in raw.split(";"):
            if "=" not in part:
                continue
            key, value = part.split("=", 1)
            key = key.strip()
            value = value.strip()
            if key:
                out[key] = value
        return out

    def _queue_cookie(self, value: str) -> None:
        self._pending_cookie_headers.append(value)

    def _read_json_body(self) -> dict:
        try:
            length = int(self.headers.get("Content-Length") or "0")
        except ValueError:
            length = 0
        raw = self.rfile.read(length) if length > 0 else b"{}"
        if not raw:
            return {}
        try:
            payload = json.loads(raw.decode("utf-8"))
            return payload if isinstance(payload, dict) else {}
        except Exception:
            return {}

    def _write_json(self, status: int, payload: dict) -> None:
        body = _json_bytes(payload)
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _write_html_page(self, status: int, html_content: str) -> None:
        body = html_content.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _redirect(self, location: str) -> None:
        self.send_response(HTTPStatus.FOUND)
        self.send_header("Location", location)
        self.end_headers()

    def _country_code(self) -> str:
        country = self.headers.get("CF-IPCountry") or self.headers.get("Cf-Ipcountry") or ""
        country = str(country).strip().upper()
        return country if len(country) == 2 else "ZZ"

    def _get_client_ip(self) -> str:
        for h in ('CF-Connecting-IP', 'X-Forwarded-For', 'X-Real-IP'):
            v = self.headers.get(h)
            if v:
                return v.split(',')[0].strip()
        return self.client_address[0] if self.client_address else 'Unknown'

    def _is_pageview(self, path: str) -> bool:
        return path in {"/", "/index.html"}

    def _get_or_set_vid(self) -> tuple[str, bool]:
        cookies = self._parse_cookies()
        visitor_id = cookies.get("wx_vid", "")
        if visitor_id and 8 <= len(visitor_id) <= 64:
            return visitor_id, False
        return secrets.token_urlsafe(16), True

    def _current_project_role(self) -> str | None:
        token = self._parse_cookies().get("wx_project_session", "")
        if not token:
            return None
        session = self.server.sessions.get(token, kind="project")
        if session:
            return session.get("role")
        return None

    def _queue_project_cookie(self, token: str) -> None:
        self._queue_cookie(f"wx_project_session={token}; Path=/; Max-Age=2592000; SameSite=Lax")

    def _clear_project_cookie(self) -> None:
        self._queue_cookie("wx_project_session=; Path=/; Max-Age=0; SameSite=Lax")

    def _blog_admin_session(self) -> dict | None:
        """Validate the Bearer token sent by the frontend API helper.
        Returns the session data dict if the token is a valid blog_admin
        session, otherwise None. Blog admin uses a Bearer header (not a
        cookie) because the React API helper already supports it."""
        auth = self.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return None
        token = auth[len("Bearer "):].strip()
        return self.server.sessions.get(token, kind="blog_admin")

    def _render_project_page(self) -> None:
        try:
            with open(os.path.join(self.server.directory, "project_ai.html"), "r", encoding="utf-8") as f:
                content = f.read()
            self._write_html_page(HTTPStatus.OK, content)
        except FileNotFoundError:
            self.send_error(HTTPStatus.NOT_FOUND, "Project page not found")

    def _render_love_page(self) -> None:
        try:
            with open(os.path.join(self.server.directory, "love.html"), "r", encoding="utf-8") as f:
                content = f.read()
            self._write_html_page(HTTPStatus.OK, content)
        except FileNotFoundError:
            self.send_error(HTTPStatus.NOT_FOUND, "Love page not found")

    def _render_map_page(self) -> None:
        try:
            with open(os.path.join(self.server.directory, "map.html"), "r", encoding="utf-8") as f:
                content = f.read()
            self._write_html_page(HTTPStatus.OK, content)
        except FileNotFoundError:
            self.send_error(HTTPStatus.NOT_FOUND, "Map page not found")

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/analytics":
            qs = parse_qs(parsed.query or "")
            days_q = qs.get("days", [None])[0]
            days = None if days_q in (None, "", "all") else days_q
            self._write_json(HTTPStatus.OK, self.server.analytics.summary(days=days))
            return

        if path == "/api/stats":
            try:
                stats = self.server.sqlite_analytics.get_all_stats()
                self._write_json(HTTPStatus.OK, stats)
            except Exception as e:
                self._write_json(HTTPStatus.OK, {
                    'error': str(e),
                    'summary': {'total_visits': 0, 'unique_visitors': 0, 'today_visits': 0, 'avg_daily_visits': 0},
                    'daily_stats': [], 'geo_stats': [], 'hourly_stats': [], 'page_stats': [], 'ip_stats': [],
                })
            return

        if path == "/api/live":
            try:
                data = self.server.sqlite_analytics.get_live_data()
                self._write_json(HTTPStatus.OK, data)
            except Exception as e:
                self._write_json(HTTPStatus.OK, {'online_now': 0, 'recent': [], 'server_time_bj': '', 'error': str(e)})
            return

        if path in {"/analytics", "/analytics/"}:
            try:
                with open(os.path.join(self.server.directory, "analytics", "analytics.html"), "r", encoding="utf-8") as f:
                    content = f.read()
                self._write_html_page(HTTPStatus.OK, content)
            except FileNotFoundError:
                self.send_error(HTTPStatus.NOT_FOUND, "Analytics page not found")
            return

        if path.startswith("/blog/api/"):
            self._handle_blog_api(path)
            return

        if path.startswith("/map/api/"):
            self._handle_map_api(path)
            return

        if path.startswith("/blog/") or path == "/blog":
            blog_dir = os.path.join(self.server.directory, "blog", "static")
            uploads_dir = os.path.join(self.server.directory, "blog", "uploads")
            if path == "/blog":
                path = "/blog/"
            rel = path[len("/blog"):].lstrip("/") or "index.html"
            file_path = os.path.join(blog_dir, rel)
            # 如果 static 里找不到，去 uploads 里找
            if not os.path.isfile(file_path) and rel.startswith("uploads/"):
                file_path = os.path.join(uploads_dir, rel[len("uploads/"):])
            if os.path.isfile(file_path):
                with open(file_path, "rb") as f:
                    content = f.read()
                self.send_response(HTTPStatus.OK)
                if file_path.endswith(".css"):
                    self.send_header("Content-Type", "text/css; charset=utf-8")
                elif file_path.endswith(".js") or file_path.endswith(".jsx"):
                    self.send_header("Content-Type", "application/javascript; charset=utf-8")
                elif file_path.endswith(".png"):
                    self.send_header("Content-Type", "image/png")
                elif file_path.endswith(".webp"):
                    self.send_header("Content-Type", "image/webp")
                elif file_path.endswith(".jpg") or file_path.endswith(".jpeg"):
                    self.send_header("Content-Type", "image/jpeg")
                elif file_path.endswith(".svg"):
                    self.send_header("Content-Type", "image/svg+xml")
                else:
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.end_headers()
                self.wfile.write(content)
                return
            else:
                with open(os.path.join(blog_dir, "index.html"), "rb") as f:
                    content = f.read()
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return

        if path == "/api/project/auth/status":
            self._write_json(HTTPStatus.OK, {"ok": True, "role": self._current_project_role()})
            return
        if path == "/api/project/tasks":
            role = self._current_project_role()
            if not role:
                self._write_json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "Not logged in"})
                return
            tasks = self.server.project_tasks.list_tasks()
            self._write_json(HTTPStatus.OK, {"ok": True, "tasks": tasks})
            return
        if path in {"/project", "/project/"}:
            self._render_project_page()
            return

        if path in {"/love", "/love/"}:
            self._render_love_page()
            return

        if path.startswith("/love/uploads/"):
            love_uploads_dir = os.path.join(self.server.directory, "love", "uploads")
            rel = path[len("/love/uploads/"):]
            file_path = os.path.join(love_uploads_dir, rel)
            if os.path.isfile(file_path):
                with open(file_path, "rb") as f:
                    content = f.read()
                self.send_response(HTTPStatus.OK)
                if file_path.endswith(".png"):
                    self.send_header("Content-Type", "image/png")
                elif file_path.endswith(".webp"):
                    self.send_header("Content-Type", "image/webp")
                elif file_path.endswith(".jpg") or file_path.endswith(".jpeg"):
                    self.send_header("Content-Type", "image/jpeg")
                elif file_path.endswith(".gif"):
                    self.send_header("Content-Type", "image/gif")
                else:
                    self.send_header("Content-Type", "image/jpeg")
                self.send_header("Content-Length", str(len(content)))
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return

        if path in {"/map", "/map/"}:
            self._render_map_page()
            return

        if path == "/api/love/entries":
            love_data_path = os.path.join(self.server.directory, "data", "love_data.json")
            try:
                with open(love_data_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                self._write_json(HTTPStatus.OK, {"entries": data})
            except Exception as e:
                self._write_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"error": str(e)})
            return

        visitor_id, need_cookie = self._get_or_set_vid()
        if self._is_pageview(path):
            self.server.analytics.record_pageview(country=self._country_code(), visitor_id=visitor_id)
            self.server.sqlite_analytics.record_pageview(
                ip_address=self._get_client_ip(),
                country=self._country_code(),
                request_path=path,
                referer=self.headers.get('Referer', ''),
                user_agent=self.headers.get('User-Agent', ''),
                session_id=visitor_id,
            )
        if need_cookie:
            self._queue_cookie(f"wx_vid={visitor_id}; Path=/; Max-Age=31536000; SameSite=Lax")
        return super().do_GET()

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path.startswith("/blog/api/"):
            self._handle_blog_api(path)
            return
        if path.startswith("/map/api/"):
            self._handle_map_api(path)
            return
        if path == "/api/project/login":
            payload = self._read_json_body()
            role = str(payload.get("role") or "")
            if role not in ["publisher", "executor"]:
                self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Invalid role"})
                return
            token = self.server.sessions.create({"kind": "project", "role": role})
            self._queue_project_cookie(token)
            self._write_json(HTTPStatus.OK, {"ok": True, "role": role})
            return
        if path == "/api/project/logout":
            token = self._parse_cookies().get("wx_project_session", "")
            if token:
                self.server.sessions.destroy(token)
            self._clear_project_cookie()
            self._write_json(HTTPStatus.OK, {"ok": True})
            return
        if path == "/api/project/task/create":
            role = self._current_project_role()
            if role != "publisher":
                self._write_json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "Only publisher can create tasks"})
                return
            payload = self._read_json_body()
            task = self.server.project_tasks.create_task(
                str(payload.get("title") or ""),
                str(payload.get("desc") or ""),
                publisher="AI-Publisher-Node",
            )
            self._write_json(HTTPStatus.OK, {"ok": True, "task": task})
            return
        if path == "/api/project/task/update":
            role = self._current_project_role()
            if not role:
                self._write_json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "Not logged in"})
                return
            payload = self._read_json_body()
            try:
                task = self.server.project_tasks.update_task(
                    str(payload.get("id") or ""),
                    str(payload.get("status") or ""),
                    payload.get("report"),
                )
            except ValueError as exc:
                self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(exc)})
                return
            self._write_json(HTTPStatus.OK, {"ok": True, "task": task})
            return

        if path == "/api/love/upload":
            import uuid
            try:
                content_type = self.headers.get("Content-Type", "")
                if not content_type.startswith("multipart/form-data"):
                    self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Content-Type must be multipart/form-data"})
                    return

                boundary = content_type.split("boundary=")[1]
                data = self.rfile.read(int(self.headers.get("Content-Length", 0)))

                boundary_bytes = b"--" + boundary.encode("utf-8")
                parts = data.split(boundary_bytes)

                for part in parts:
                    if b"filename=" in part:
                        filename_start = part.find(b'filename="') + 10
                        filename_end = part.find(b'"', filename_start)
                        filename = part[filename_start:filename_end].decode("utf-8")

                        content_start = part.find(b"\r\n\r\n") + 4
                        content_end = part.rfind(b"\r\n--")
                        file_data = part[content_start:content_end]

                        ext = filename.split(".")[-1].lower() if "." in filename else "jpg"
                        valid_exts = {"jpg", "jpeg", "png", "gif", "webp"}
                        if ext not in valid_exts:
                            self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Invalid file type"})
                            return

                        new_filename = str(uuid.uuid4())[:8] + "." + ext
                        upload_dir = os.path.join(self.server.directory, "love", "uploads")
                        os.makedirs(upload_dir, exist_ok=True)
                        file_path = os.path.join(upload_dir, new_filename)

                        with open(file_path, "wb") as f:
                            f.write(file_data)

                        self._write_json(HTTPStatus.OK, {"ok": True, "url": "/love/uploads/" + new_filename})
                        return

                self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "No file found"})
            except Exception as e:
                self._write_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"ok": False, "error": str(e)})
            return

        if path == "/api/love/save":
            love_data_path = os.path.join(self.server.directory, "data", "love_data.json")
            try:
                payload = self._read_json_body()
                entries = payload.get("entries", [])
                with open(love_data_path, "w", encoding="utf-8") as f:
                    json.dump(entries, f, ensure_ascii=False, indent=2)
                self._write_json(HTTPStatus.OK, {"ok": True})
            except Exception as e:
                self._write_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"ok": False, "error": str(e)})
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Not found")

    def do_PUT(self) -> None:
        path = urlparse(self.path).path
        if path.startswith("/blog/api/"):
            self._handle_blog_api(path)
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Not found")

    def do_DELETE(self) -> None:
        path = urlparse(self.path).path
        if path.startswith("/blog/api/"):
            self._handle_blog_api(path)
            return
        if path.startswith("/map/api/"):
            self._handle_map_api(path)
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Not found")

    def _handle_blog_api(self, path: str) -> None:
        api_path = path[len("/blog/api"):]
        parsed = urlparse(api_path)
        path_only = parsed.path
        qs = parse_qs(parsed.query or "")

        # --- Admin auth: login / logout -------------------------------------
        if path_only == "/admin/login" and self.command == "POST":
            payload = self._read_json_body()
            if (payload.get("nickname") == ADMIN_NICKNAME
                    and payload.get("password") == ADMIN_PASSWORD):
                token = self.server.sessions.create({
                    "kind": "blog_admin",
                    "nickname": "Xu Wang",
                    "role": "admin",
                })
                self._write_json(HTTPStatus.OK, {"ok": True, "token": token, "nickname": "Xu Wang"})
            else:
                self._write_json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "Invalid credentials"})
            return

        if path_only == "/admin/logout" and self.command == "POST":
            auth = self.headers.get("Authorization", "")
            if auth.startswith("Bearer "):
                self.server.sessions.destroy(auth[len("Bearer "):].strip())
            self._write_json(HTTPStatus.OK, {"ok": True})
            return

        # --- Site config (BIO + CATEGORIES) ---------------------------------
        if path_only == "/config":
            if self.command == "GET":
                self._write_json(HTTPStatus.OK, self.server.config.get_config())
                return
            if self.command == "PUT":
                if not self._blog_admin_session():
                    self._write_json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "Admin required"})
                    return
                payload = self._read_json_body()
                updated = self.server.config.update_config(payload)
                self._write_json(HTTPStatus.OK, updated)
                return

        if path_only == "/posts":
            if self.command == "GET":
                status = qs.get("status", ["published"])[0]
                cat = qs.get("cat", [None])[0]
                limit = int(qs.get("limit", [20])[0])
                posts = self.server.blog.list_posts(status=status, cat=cat, limit=limit)
                self._write_json(HTTPStatus.OK, {"items": posts})
                return
            elif self.command == "POST":
                if not self._blog_admin_session():
                    self._write_json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "Admin required"})
                    return
                payload = self._read_json_body()
                post = self.server.blog.create_post(payload)
                self._write_json(HTTPStatus.OK, post)
                return

        if path_only.startswith("/posts/"):
            pid = path_only[len("/posts/"):]
            if self.command == "GET":
                post = self.server.blog.get_post(pid)
                if post:
                    self._write_json(HTTPStatus.OK, post)
                else:
                    self._write_json(HTTPStatus.NOT_FOUND, {"error": "Post not found"})
                return
            elif self.command == "PUT":
                if not self._blog_admin_session():
                    self._write_json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "Admin required"})
                    return
                payload = self._read_json_body()
                post = self.server.blog.update_post(pid, payload)
                if post:
                    self._write_json(HTTPStatus.OK, post)
                else:
                    self._write_json(HTTPStatus.NOT_FOUND, {"error": "Post not found"})
                return
            elif self.command == "DELETE":
                if not self._blog_admin_session():
                    self._write_json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "Admin required"})
                    return
                ok = self.server.blog.delete_post(pid)
                self._write_json(HTTPStatus.OK, {"ok": ok})
                return

        if path_only.startswith("/comments/"):
            pid = path_only[len("/comments/"):]
            if self.command == "GET":
                comments = self.server.blog.list_comments(pid)
                self._write_json(HTTPStatus.OK, {"items": comments})
                return
            elif self.command == "POST":
                payload = self._read_json_body()
                nickname = str(payload.get("user") or "")[:32]
                text = str(payload.get("text") or "")[:4000]
                reply_to = payload.get("replyTo")
                comment = self.server.blog.add_comment(pid, nickname, text, reply_to)
                if comment:
                    self._write_json(HTTPStatus.OK, comment)
                else:
                    self._write_json(HTTPStatus.NOT_FOUND, {"error": "Post not found"})
                return
            elif self.command == "DELETE":
                if not self._blog_admin_session():
                    self._write_json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "Admin required"})
                    return
                cid = qs.get("id", [None])[0]
                ok = self.server.blog.delete_comment(pid, cid)
                self._write_json(HTTPStatus.OK, {"ok": ok})
                return

        if path_only.startswith("/gifts/"):
            pid = path_only[len("/gifts/"):]
            if self.command == "POST":
                payload = self._read_json_body()
                kind = str(payload.get("kind") or "")
                result = self.server.blog.send_gift(pid, kind)
                if result:
                    self._write_json(HTTPStatus.OK, result)
                else:
                    self._write_json(HTTPStatus.BAD_REQUEST, {"error": "Invalid gift"})
                return

        if path_only.startswith("/highlights/"):
            pid = path_only[len("/highlights/"):]
            if self.command == "GET":
                highlights = self.server.blog.list_highlights(pid)
                self._write_json(HTTPStatus.OK, {"items": highlights})
                return
            elif self.command == "POST":
                payload = self._read_json_body()
                nickname = str(payload.get("user") or "")[:32]
                anchor = str(payload.get("anchor") or "")[:800]
                color = str(payload.get("color") or "")
                text = payload.get("text")
                highlight = self.server.blog.add_highlight(pid, nickname, anchor, color, text)
                if highlight:
                    self._write_json(HTTPStatus.OK, highlight)
                else:
                    self._write_json(HTTPStatus.BAD_REQUEST, {"error": "Invalid highlight"})
                return
            elif self.command == "DELETE":
                hid = qs.get("id", [None])[0]
                ok = self.server.blog.delete_highlight(pid, hid)
                self._write_json(HTTPStatus.OK, {"ok": ok})
                return

        self._write_json(HTTPStatus.NOT_FOUND, {"error": "Not found"})

    def _handle_map_api(self, path: str) -> None:
        # do_GET/POST/DELETE pass a query-stripped path, so recover the query
        # string from self.path (needed by DELETE /reviews/<city>?id=).
        path_only = path[len("/map/api"):]
        qs = parse_qs(urlparse(self.path).query or "")

        # --- Admin auth: login / logout / session ---------------------------
        if path_only == "/admin/login" and self.command == "POST":
            payload = self._read_json_body()
            if (payload.get("nickname") == ADMIN_NICKNAME
                    and payload.get("password") == ADMIN_PASSWORD):
                token = self.server.sessions.create({
                    "kind": "blog_admin",
                    "nickname": "Xu Wang",
                    "role": "admin",
                })
                self._write_json(HTTPStatus.OK, {"ok": True, "token": token, "nickname": "Xu Wang"})
            else:
                self._write_json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "Invalid credentials"})
            return

        if path_only == "/admin/logout" and self.command == "POST":
            auth = self.headers.get("Authorization", "")
            if auth.startswith("Bearer "):
                self.server.sessions.destroy(auth[len("Bearer "):].strip())
            self._write_json(HTTPStatus.OK, {"ok": True})
            return

        if path_only == "/admin/session" and self.command == "GET":
            sess = self._blog_admin_session()
            self._write_json(HTTPStatus.OK, {
                "ok": bool(sess),
                "role": (sess or {}).get("role"),
                "nickname": (sess or {}).get("nickname"),
            })
            return

        # --- Aggregate summary (avg + count per city) -----------------------
        if path_only == "/summary" and self.command == "GET":
            self._write_json(HTTPStatus.OK, self.server.map_reviews.summary())
            return

        # --- Reviews per city ----------------------------------------------
        if path_only.startswith("/reviews/"):
            city = unquote(path_only[len("/reviews/"):]).strip()
            if not city:
                self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "City required"})
                return
            if self.command == "GET":
                self._write_json(HTTPStatus.OK, {"items": self.server.map_reviews.list_reviews(city)})
                return
            if self.command == "POST":
                payload = self._read_json_body()
                admin_sess = self._blog_admin_session()
                is_admin = bool(admin_sess)
                nickname = ("Xu Wang" if is_admin else str(payload.get("nickname") or "").strip())[:32]
                if not nickname:
                    self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Nickname required"})
                    return
                try:
                    rating = int(payload.get("rating") or 0)
                except (ValueError, TypeError):
                    rating = 0
                if rating < 1 or rating > 5:
                    self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Rating must be 1-5"})
                    return
                text = str(payload.get("text") or "")[:2000].strip()
                review = self.server.map_reviews.add_review(city, nickname, rating, text, is_admin)
                self._write_json(HTTPStatus.OK, review)
                return
            if self.command == "DELETE":
                if not self._blog_admin_session():
                    self._write_json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "Admin required"})
                    return
                rid = qs.get("id", [None])[0]
                ok = self.server.map_reviews.delete_review(city, rid)
                self._write_json(HTTPStatus.OK, {"ok": ok})
                return

        self._write_json(HTTPStatus.NOT_FOUND, {"error": "Not found"})

    def end_headers(self) -> None:
        for cookie in self._pending_cookie_headers:
            self.send_header("Set-Cookie", cookie)
        self._pending_cookie_headers = []
        super().end_headers()


class AppServer(ThreadingHTTPServer):
    def __init__(
        self,
        server_address,
        handler_cls,
        analytics: AnalyticsStore,
        sqlite_analytics: SQLiteAnalytics,
        project_tasks: ProjectStore,
        sessions: SessionStore,
        blog: BlogStore,
        config: "ConfigStore",
        map_reviews: "MapReviewStore",
        directory: str,
    ):
        super().__init__(server_address, handler_cls)
        self.analytics = analytics
        self.sqlite_analytics = sqlite_analytics
        self.project_tasks = project_tasks
        self.sessions = sessions
        self.blog = blog
        self.config = config
        self.map_reviews = map_reviews
        self.directory = directory


def make_handler(directory: str):
    def handler(*args, **kwargs):
        return AppHandler(*args, directory=directory, **kwargs)

    return handler


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8080)
    parser.add_argument("--data", default="analytics.json")
    parser.add_argument("--project-data", default=os.path.join("data", "project_tasks.json"))
    parser.add_argument("--blog-data", default=os.path.join("blog", "data", "blog.json"))
    parser.add_argument("--blog-config", default=os.path.join("blog", "data", "config.json"))
    parser.add_argument("--map-data", default=os.path.join("data", "map_reviews.json"))
    parser.add_argument("--directory", default=os.getcwd())
    args = parser.parse_args()

    analytics = AnalyticsStore(path=args.data)
    db_path = os.path.join(args.directory, "analytics", "access_stats.db")
    schema_path = os.path.join(args.directory, "analytics", "database_schema.sql")
    sqlite_analytics = SQLiteAnalytics(db_path=db_path, schema_path=schema_path)
    project_tasks = ProjectStore(path=args.project_data)
    sessions = SessionStore()
    blog = BlogStore(data_path=args.blog_data)
    config = ConfigStore(data_path=args.blog_config)
    map_reviews = MapReviewStore(data_path=args.map_data)
    handler = make_handler(args.directory)
    httpd = AppServer(
        (args.host, args.port),
        handler,
        analytics=analytics,
        sqlite_analytics=sqlite_analytics,
        project_tasks=project_tasks,
        sessions=sessions,
        blog=blog,
        config=config,
        map_reviews=map_reviews,
        directory=args.directory,
    )
    httpd.serve_forever()


if __name__ == "__main__":
    main()