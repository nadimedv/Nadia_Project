CREATE TABLE IF NOT EXISTS Shifts (
                                      id INTEGER PRIMARY KEY,
                                      date TEXT NOT NULL,
                                      timeSlot TEXT NOT NULL,
                                      userName TEXT NOT NULL,
                                      comment TEXT,
                                      status TEXT NOT NULL CHECK (status IN ('planned', 'done', 'canceled'))
    );