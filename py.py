from flask import Flask, render_template, request, redirect, url_for
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.secret_key = "123789456"

# Database config
db_config = {
    'user': 'root',
    'password': 'NHA@2004',
    'host': 'localhost',
    'database': 'nha'
}

# Root -> redirect to form
@app.route('/')
def home():
    return redirect(url_for('card_screen'))

# FORM PAGE
@app.route('/form', methods=['GET', 'POST'])
def form():
    error = None
    success = None

    # Fetch existing records
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM form")
        records = cursor.fetchall()
    except Exception as e:
        print("Error fetching records:", e)
        records = []
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

    # Insert new data
    if request.method == 'POST':
        totaldays = request.form.get("totaldays")
        totalpresent = request.form.get("totalpresent")
        total_leave = request.form.get("total_leave")
        late_in = request.form.get("late_in")
        early_out = request.form.get("early_out")
        late_out = request.form.get("late_out")
        early_in = request.form.get("early_in")
        el_on_hands = request.form.get("el_on_hands")
        avy_counting_time = request.form.get("avy_counting_time")
        avy_out_time = request.form.get("avy_out_time")
        cl_on_hands = request.form.get("cl_on_hands")

        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO form (
                    total_days, 
                    total_presents, 
                    total_leaves, 
                    late_in, 
                    early_out, 
                    late_out, 
                    early_in, 
                    el_on_hands, 
                    avg_counting_time, 
                    avg_out_time, 
                    cl_on_hands
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                totaldays, 
                totalpresent, 
                total_leave, 
                late_in, 
                early_out, 
                late_out, 
                early_in, 
                el_on_hands, 
                avy_counting_time, 
                avy_out_time, 
                cl_on_hands,
            ))
            conn.commit()
            success = "✅ Data submitted successfully!"
        except Exception as e:
            error = f"❌ Failed to insert data: {e}"
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    return render_template('form.html', records=records, error=error, success=success)

# CARD PAGE (Show Records)
@app.route('/card', methods=['GET'])
def card_screen():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM form")
        records = cursor.fetchall()
    except Exception as e:
        print("Error fetching records:", e)
        records = []
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

    return render_template("card.html", records=records)

if __name__ == '__main__':
    app.run(debug=True)