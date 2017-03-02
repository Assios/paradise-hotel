#!/usr/bin/env python3
from flask import Flask, render_template, request, session
import sqlite3 as sql
app = Flask(__name__)

def add(username, password):
    conn = sql.connect("./database.db")
    c = conn.cursor()
    c.execute('SELECT username FROM users')
    users = [user[0] for user in c.fetchall()]
    if username in users:
        print("Brukernavnet finnes")
        return

    c.execute("INSERT INTO users (username, password) VALUES (?,?)", (username, password))
    conn.commit()
    print("Bruker %s lagt til" % username)
    c.close()

def verify_username_password(username, password):
    conn = sql.connect("./database.db")
    c = conn.cursor()
    c.execute('SELECT * FROM users')
    rows = c.fetchall()
    print rows
    c.close()
    return (username, password) in rows

@app.route('/')
def home():
    if session.get('logged_in'):
        print session['logged_in']

    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if verify_username_password(username, password):
            print('VERIFIED')
            session['logged_in'] = username
            print session

    return render_template('login.html', error=error)


if __name__ == '__main__':
    app.secret_key = 'secret'
    app.config['SESSION_TYPE'] = 'filesystem'

    add("admin", "password")
    app.run(debug=True)
