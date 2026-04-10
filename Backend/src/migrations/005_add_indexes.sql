CREATE INDEX IF NOT EXISTS idx_shifts_status_date
    ON Shifts(status, date DESC);