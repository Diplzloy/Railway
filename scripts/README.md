# Скрипты для работы с документами

## collect_documents.py

Автоматически собирает нормативные документы по пожарной безопасности с 5 сайтов
и загружает PDF в Supabase Storage.

### Установка зависимостей

```bash
pip install requests beautifulsoup4 supabase lxml
```

### Запуск

```bash
cd scripts
python collect_documents.py
```

### Что делает скрипт:

1. **Парсит** списки документов с:
   - fireman.club/normativnye-dokumenty/
   - propb.ru/library/normativnaya-baza/
   - firesafety-vniipo.ru
   - mchs.gov.ru

2. **Дедуплицирует** — при совпадении названий оставляет более новый документ

3. **Ищет PDF** на docs.cntd.ru (официальная база)

4. **Загружает** в Supabase Storage (bucket: `documents`)

5. **Сохраняет метаданные** в таблицу `documents`

### Настройки в начале файла:

```python
MAX_DOCS = 200    # сколько документов загружать за один запуск
DELAY = 2.0       # пауза между запросами (не перегружай сайты!)
```

### Лог

Скрипт пишет лог в `collect.log` — смотри его если что-то пошло не так.

### Запуск по расписанию (cron)

```bash
# Каждую ночь в 03:00
0 3 * * * cd /path/to/scripts && python collect_documents.py >> cron.log 2>&1
```

### Требования к Supabase

Перед запуском в Supabase SQL Editor выполни:

```sql
-- Добавь поле source в таблицу documents если его нет
ALTER TABLE documents ADD COLUMN IF NOT EXISTS source text;
```
