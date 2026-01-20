import os
from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from translations import translations

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Mocking Google GenAI for Python if needed, but primarily focusing on SSR structure
# In a real environment, you'd use `google.generativeai`

@app.route('/')
def home():
    lang = session.get('lang', 'en')
    t = translations.get(lang, translations['en'])
    return render_template('home.html', t=t, lang=lang)

@app.route('/analysis')
def analysis():
    lang = session.get('lang', 'en')
    t = translations.get(lang, translations['en'])
    return render_template('analysis.html', t=t, lang=lang)

@app.route('/knowledge')
def knowledge():
    lang = session.get('lang', 'en')
    t = translations.get(lang, translations['en'])
    return render_template('knowledge.html', t=t, lang=lang)

@app.route('/market')
def market():
    lang = session.get('lang', 'en')
    t = translations.get(lang, translations['en'])
    return render_template('market.html', t=t, lang=lang)

@app.route('/chat')
def chat():
    lang = session.get('lang', 'en')
    t = translations.get(lang, translations['en'])
    return render_template('chat.html', t=t, lang=lang)

@app.route('/settings')
def settings():
    lang = session.get('lang', 'en')
    t = translations.get(lang, translations['en'])
    return render_template('settings.html', t=t, lang=lang)

@app.route('/set_lang/<lang_code>')
def set_lang(lang_code):
    if lang_code in ['en', 'kn']:
        session['lang'] = lang_code
    return redirect(request.referrer or url_for('home'))

@app.route('/api/analyze', methods=['POST'])
def analyze():
    # Placeholder for Python-side Gemini API call
    data = request.json
    # Return mock analysis result consistent with geminiService.ts
    return jsonify({
        "diseaseName": "Rice Blast",
        "confidence": 0.94,
        "symptoms": ["Spindle-shaped spots", "Neck rot"],
        "treatment": ["Spray Tricyclazole", "Resistant varieties"],
        "economicImpact": "Estimated yield loss: 30-50% per acre."
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)