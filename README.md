# Burnout Radar — Web Application

> **A Research-Backed, SHAP-Informed Student Burnout Screening & Self-Check Web Application**  
> Based on an explanatory sequential mixed-methods machine learning study of 601 university students in Bangladesh.

---

## 📌 Overview

**Burnout Radar** is an interactive, privacy-first web application designed to help university students assess their academic burnout risk early. Built directly upon empirical findings from supervised machine learning (Random Forest, $N=601$, $\text{ROC-AUC} = 0.7126$) and game-theoretic XAI (SHAP), the application provides:

- ⚡ **2-Minute Self-Check Assessment:** Instant risk stratification (Low, Moderate, High) with calibrated early-warning sensitivity ($\text{Recall} = 71.76\%$).
- 📊 **Real-time Feature Attribution:** Personalized visual waterfall charts showing exact behavioural contributors (Screen-to-sleep displacement, academic pressure, coping reserves).
- 🧭 **3-Stage Step-by-Step Wizard:** Guided self-assessment with quick-load presets (High Burnout Profile, Balanced Student, Working Student).
- 📈 **ML Model Benchmark Hub:** Transparent cross-validated metrics across 10 supervised algorithms and soft-voting ensemble.
- 🔍 **Interactive SHAP Explainability:** Global feature importance ranking and interactive beeswarm simulations.
- 🗣️ **Qualitative Student Narratives:** Triangulated themes and anonymized quotes from in-depth interviews ($N=20$).
- 🛡️ **Support & Crisis Directory:** Direct access to Bangladesh mental health helplines (*Kaan Pete Roi*, National Helpline `16122`, Emergency `999`).

---

## 🚀 Live Demo & Deployment

This application is built with standard web technologies (HTML5, Vanilla CSS3, JavaScript ES6+) with **zero external server dependencies** — all ML risk calculation and SHAP attributions run 100% client-side in the browser.

### Local Run
Simply clone this repository and open `index.html` in any modern web browser:
```bash
# Clone the repository
git clone https://github.com/rifatmiah92/Burnout-web-application.git

# Navigate to directory
cd Burnout-web-application

# Open index.html directly or serve locally via Python
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## 📂 Project Structure

```text
Burnout-web-application/
├── index.html                  # Main single-page web application container (6 tabs)
├── css/
│   └── style.css               # Editorial academic design system (Spectral + IBM Plex)
├── js/
│   ├── app.js                  # Core application logic, risk engine, SHAP calculator & UI
│   └── research_data.js        # Empirical model benchmarks, SHAP rankings & qualitative codebook
├── assets/                     # Research figures (1-6), SVG diagrams & branding assets
└── README.md                   # Project documentation
```

---

## 🔬 Research Background & Citation

This tool is derived from the research manuscript:

> **"Explainable Machine Learning for Student Burnout Classification and Risk Stratification: A Mixed-Methods Study with Qualitative Triangulation"**  
> *Authors:* Rifat Miah (Presidency University, Dhaka) & Dr. A.S.M. Shihavuddin (Green University of Bangladesh).

---

## 🛡️ Ethical Notice & Disclaimer

*Burnout Radar* is an exploratory educational screening prototype and **not a clinical diagnostic device**. All assessments are calculated locally on your device without storing or transmitting personal information.

---

## 📄 License
This project is licensed under the MIT License.
