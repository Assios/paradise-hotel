#!/usr/bin/env python
import sqlite3 as sql

conn = sql.connect('database.db')
conn.execute('CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT)')
conn.close()
