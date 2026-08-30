// Research Benchmark Data, Qualitative Quotes, and Codebook
// Derived directly from "Explainable Machine Learning for Student Burnout Classification and Risk Stratification: A Mixed-Methods Study with Qualitative Triangulation"

const RESEARCH_DATA = {
  paperInfo: {
    title: "Explainable Machine Learning for Student Burnout Classification and Risk Stratification: A Mixed-Methods Study with Qualitative Triangulation",
    authors: "Rifat Miah (Presidency University, Dhaka) & Dr. A.S.M. Shihavuddin (Green University of Bangladesh)",
    cohortSize: 601,
    institutions: "11 Higher Education Institutions across Bangladesh",
    interviewsCount: 20,
    interRaterReliability: "Cohen's κ = 0.82 (Substantial agreement)",
    targetMetric: "Burnout Severity (High = 42.43%, Moderate = 38.10%, Low = 19.47%)",
    championModel: "Random Forest Classifier (65.89% Acc, 0.7126 ROC-AUC, 71.76% Recall @ th=0.38)"
  },

  modelBenchmarks: [
    { model: "Random Forest", accuracy: 65.89, precision: 64.53, recall: 43.53, f1: 51.99, roc_auc: 0.7126, ci: "[0.6665, 0.7625]", type: "Tree Ensemble" },
    { model: "Soft Voting Ensemble", accuracy: 65.89, precision: 62.38, recall: 49.41, f1: 55.14, roc_auc: 0.7069, ci: "[0.6493, 0.7600]", type: "Ensemble" },
    { model: "CatBoost Classifier", accuracy: 65.06, precision: 60.87, recall: 49.41, f1: 54.55, roc_auc: 0.6983, ci: "[0.6470, 0.7508]", type: "Gradient Boosting" },
    { model: "Logistic Regression", accuracy: 64.39, precision: 60.00, recall: 48.24, f1: 53.48, roc_auc: 0.6819, ci: "[0.6370, 0.7240]", type: "Linear" },
    { model: "Gradient Boosting", accuracy: 64.39, precision: 59.62, recall: 49.80, f1: 54.27, roc_auc: 0.6922, ci: "[0.6294, 0.7552]", type: "Gradient Boosting" },
    { model: "Extra Trees", accuracy: 63.56, precision: 61.39, recall: 38.04, f1: 46.97, roc_auc: 0.6997, ci: "[0.6506, 0.7465]", type: "Tree Ensemble" },
    { model: "Support Vector Machine", accuracy: 63.56, precision: 61.54, recall: 37.65, f1: 46.72, roc_auc: 0.6708, ci: "[0.6266, 0.7165]", type: "Kernel" },
    { model: "LightGBM", accuracy: 63.39, precision: 57.85, recall: 50.59, f1: 53.97, roc_auc: 0.6898, ci: "[0.6390, 0.7361]", type: "Gradient Boosting" },
    { model: "XGBoost Classifier", accuracy: 62.40, precision: 56.44, recall: 49.80, f1: 52.92, roc_auc: 0.6832, ci: "[0.6504, 0.7224]", type: "Gradient Boosting" },
    { model: "Decision Tree", accuracy: 61.40, precision: 56.28, recall: 40.39, f1: 47.03, roc_auc: 0.6403, ci: "[0.5989, 0.6793]", type: "Single Tree" },
    { model: "Multilayer Perceptron (MLP)", accuracy: 60.40, precision: 53.59, recall: 49.80, f1: 51.63, roc_auc: 0.6474, ci: "[0.6041, 0.6930]", type: "Neural Network" },
    { model: "Majority Baseline (All-0)", accuracy: 57.57, precision: 0.00, recall: 0.00, f1: 0.00, roc_auc: 0.5000, ci: "N/A", type: "Baseline" }
  ],

  thresholdData: [
    { threshold: 0.50, mode: "Standard / Fatigue Protection", accuracy: 65.89, sensitivity: 43.53, specificity: 82.37, precision: 64.53, f1: 0.5199, tp: 111, fp: 61, fn: 144, tn: 285, description: "Minimizes false-alarm alerts for busy campus counseling staff." },
    { threshold: 0.42, mode: "Balanced Screening", accuracy: 64.39, sensitivity: 62.75, specificity: 65.61, precision: 57.35, f1: 0.5993, tp: 160, fp: 119, fn: 95, tn: 227, description: "Balanced risk capture identifying 160 of 255 at-risk students." },
    { threshold: 0.38, mode: "High-Coverage Early Warning (Recommended)", accuracy: 62.73, sensitivity: 71.76, specificity: 56.07, precision: 54.63, f1: 0.6211, tp: 183, fp: 152, fn: 72, tn: 194, description: "Catches 71.76% (183/255) of high-burnout students for early voluntary outreach." }
  ],

  globalShapImportance: [
    { feature: "academic_performance_index", name: "Academic Performance Index", shap: 0.038788, category: "Academic" },
    { feature: "cgpa_midpoint", name: "CGPA Bracket Midpoint", shap: 0.036190, category: "Academic" },
    { feature: "screen_to_sleep_ratio", name: "Screen-to-Sleep Ratio", shap: 0.029786, category: "Digital / Sleep" },
    { feature: "burnout_vulnerability_index", name: "Burnout Vulnerability Index", shap: 0.023787, category: "Psychological" },
    { feature: "social_media_hours", name: "Daily Social Media Hours", shap: 0.020227, category: "Digital / Sleep" },
    { feature: "study_to_rest_ratio", name: "Study-to-Rest Ratio", shap: 0.020061, category: "Lifestyle" },
    { feature: "psychological_strain_index", name: "Psychological Strain Index", shap: 0.016576, category: "Psychological" },
    { feature: "motivation_deficit_score", name: "Motivation Deficit Score", shap: 0.016251, category: "Psychological" },
    { feature: "depression_score", name: "Depression Affect Score", shap: 0.015420, category: "Psychological" },
    { feature: "stress_score", name: "Perceived Stress Score", shap: 0.015156, category: "Psychological" },
    { feature: "sleep_deprivation_index", name: "Sleep Deprivation Index", shap: 0.012916, category: "Digital / Sleep" },
    { feature: "attendance_pct", name: "Classroom Attendance (%)", shap: 0.012882, category: "Academic" },
    { feature: "part_time_score", name: "Part-Time Job Obligations", shap: 0.009416, category: "Lifestyle" },
    { feature: "motivation_score", name: "Intrinsic Academic Motivation", shap: 0.009272, category: "Psychological" },
    { feature: "study_hours_numeric", name: "Daily Dedicated Study Hours", shap: 0.009084, category: "Academic" },
    { feature: "academic_pressure_index", name: "Academic Pressure Index", shap: 0.009041, category: "Academic" },
    { feature: "sleep_hours_numeric", name: "Total Daily Sleep Hours", shap: 0.007845, category: "Digital / Sleep" },
    { feature: "sleep_quality_score", name: "Subjective Sleep Quality", shap: 0.006906, category: "Digital / Sleep" },
    { feature: "physical_activity_hours", name: "Physical Exercise Hours", shap: 0.006854, category: "Lifestyle" },
    { feature: "wellbeing_buffer", name: "Wellbeing Buffer Reserve", shap: 0.006660, category: "Lifestyle" }
  ],

  qualitativeThemes: [
    {
      themeId: "career_anxiety",
      themeTitle: "Theme 1: Career Despair & Institutional Identity Strain",
      themeDescription: "Students in affiliated colleges and private universities reported deep feelings of future employment uncertainty, comparing themselves with top public institutions and questioning their degrees.",
      quotes: [
        {
          id: "P7",
          student: "Participant 7 (High Burnout, Master's, Age 24)",
          text: "I study 10 hours a day, but the fear of not getting a respectable job after graduation keeps me awake all night. It feels like no matter what CGPA I maintain, our institution doesn't give us equal opportunities.",
          category: "Career Despair"
        },
        {
          id: "P12",
          student: "Participant 12 (High Burnout, Bachelor's 4th Year, Age 23)",
          text: "My parents spent their lifetime savings on my private university tuition. Every exam feels like life or death. The pressure isn't just about grades; it's about paying back a debt of expectations.",
          category: "Financial & Parental Pressure"
        },
        {
          id: "P18",
          student: "Participant 18 (High Burnout, National University Affiliate, Age 22)",
          text: "Session jams and delayed exams leave us floating. Even when we don't have heavy coursework, the psychological waiting and uncertainty destroy our motivation completely.",
          category: "Session Jam & Institutional Strain"
        }
      ]
    },
    {
      themeId: "digital_escapism",
      themeTitle: "Theme 2: Digital Escapism & Screen-to-Sleep Displacement",
      themeDescription: "Late-night smartphone and social media scrolling was widely described as a maladaptive psychological refuge from study anxiety, directly displacing restorative sleep.",
      quotes: [
        {
          id: "P3",
          student: "Participant 3 (High Burnout, Bachelor's 2nd Year, Age 20)",
          text: "When I sit down with books and feel overwhelmed by assignments, I pick up my phone to relax for 5 minutes. Before I know it, 3 hours have passed on Reels and Facebook, and it's 3:30 AM.",
          category: "Digital Displacement"
        },
        {
          id: "P15",
          student: "Participant 15 (High Burnout, Bachelor's 3rd Year, Age 22)",
          text: "My brain is completely exhausted by midnight, but I cannot sleep because my mind keeps racing. Scrolling TikTok is the only thing that numbs my anxiety, even though I wake up like a zombie.",
          category: "Anxious Nighttime Scrolling"
        }
      ]
    },
    {
      themeId: "biological_exhaustion",
      themeTitle: "Theme 3: Biological Sleep Exhaustion & Cognitive Paralysis",
      themeDescription: "Chronic short sleep duration (<5-6 hours) coupled with fragmented sleep quality caused cognitive fog, inability to concentrate in lectures, and diminished academic self-efficacy.",
      quotes: [
        {
          id: "P9",
          student: "Participant 9 (High Burnout, Bachelor's 3rd Year, Age 21)",
          text: "I go to classes physically, but mentally I cannot process a single slide. I stare at the board with zero focus. I drink 3 cups of tea a day just to keep my eyes open.",
          category: "Cognitive Fog"
        },
        {
          id: "P1",
          student: "Participant 1 (Low Burnout, Bachelor's 1st Year, Age 19)",
          text: "I try to sleep at least 7.5 hours every day and play badminton in the afternoon. Even during midterms, having a consistent bedtime keeps my mind fresh and calm.",
          category: "Protective Restorative Buffer"
        }
      ]
    },
    {
      themeId: "coping_resources",
      themeTitle: "Theme 4: Protective Peer Networks & Physical Activity Buffers",
      themeDescription: "Students who sustained lower burnout scores relied on close peer study groups, daily active exercise, and clear cognitive detachment boundaries after study hours.",
      quotes: [
        {
          id: "P5",
          student: "Participant 5 (Low Burnout, Bachelor's 4th Year, Age 23)",
          text: "Whenever pressure builds up, our study group sits together in the cafeteria. Sharing the struggle with friends makes the burden feel half as heavy.",
          category: "Social Peer Support"
        },
        {
          id: "P11",
          student: "Participant 11 (Medium Burnout, Master's, Age 25)",
          text: "Going to the gym for 45 minutes everyday acts like a mental reset button. On days I skip workout, my stress levels double.",
          category: "Physical Activity Reserve"
        }
      ]
    }
  ],

  codebook: [
    { name: "gender", domain: "Demographic", scale: "Male, Female", range: "Male (57.2%), Female (42.8%)", description: "Self-reported student binary gender identity." },
    { name: "age_group", domain: "Demographic", scale: "5 Brackets", range: "17-18 to 25+ years", description: "Age category at survey completion." },
    { name: "degree", domain: "Academic Profile", scale: "4 Tiers", range: "Bachelor's, Master's, PhD, Diploma", description: "Enrolled higher education degree program." },
    { name: "academic_year", domain: "Academic Profile", scale: "4 Stages", range: "1st Year to Final Year", description: "Current stage in degree curriculum." },
    { name: "study_hours_numeric", domain: "Behavioural", scale: "Hours/day", range: "0.50 - 7.00 hrs", description: "Dedicated independent daily study time." },
    { name: "sleep_hours_numeric", domain: "Behavioural", scale: "Hours/day", range: "4.00 - 9.00 hrs", description: "Average daily total sleep duration." },
    { name: "social_media_hours", domain: "Behavioural", scale: "Hours/day", range: "0.50 - 7.00 hrs", description: "Daily recreational screen time and social media use." },
    { name: "physical_activity_hours", domain: "Lifestyle Reserve", scale: "Hours/day", range: "1.00 - 6.00 hrs", description: "Active exercise, sports, or gym duration." },
    { name: "attendance_pct", domain: "Engagement", scale: "Percentage (%)", range: "20.00% - 95.00%", description: "Official institutional class attendance." },
    { name: "cgpa_midpoint", domain: "Academic Performance", scale: "4.00 Grade Scale", range: "2.25 - 3.875 CGPA", description: "Cumulative Grade Point Average midpoint bracket." },
    { name: "stress_score", domain: "Psychological Demand", scale: "1 to 4 Likert", range: "1 (Low) to 4 (Severe)", description: "Perceived academic stress and mental pressure." },
    { name: "depression_score", domain: "Psychological Demand", scale: "1 to 4 Likert", range: "1 (None) to 4 (Severe)", description: "Self-reported depressive affect and career despair." },
    { name: "academic_pressure_score", domain: "Academic Load", scale: "1 to 4 Likert", range: "1 (Manageable) to 4 (Overwhelming)", description: "Perceived curriculum load, exam difficulty, deadlines." },
    { name: "workload_score", domain: "Academic Load", scale: "1 to 4 Likert", range: "1 (Light) to 4 (Extreme)", description: "Assignment volume and coursework density." },
    { name: "part_time_score", domain: "Employment Demand", scale: "0 to 2 Ordinal", range: "0 (None), 1 (Part-time), 2 (Full)", description: "Employment obligations outside university." },
    { name: "motivation_score", domain: "Motivational Resource", scale: "1 to 3 Ordinal", range: "1 (Low) to 3 (High)", description: "Intrinsic academic drive and course engagement." },
    { name: "sleep_quality_score", domain: "Restorative Resource", scale: "1 to 3 Ordinal", range: "1 (Poor) to 3 (Good)", description: "Subjective restorative sleep restfulness." },
    { name: "burnout_score", domain: "Target Variable", scale: "1 to 3 Ordinal", range: "1 (Low), 2 (Med), 3 (High)", description: "Primary burnout severity (Binarized: High=1, Low/Med=0)." },
    { name: "burnout_vulnerability_index", domain: "Engineered Index", scale: "Continuous Ratio", range: "Formula in Paper", description: "Total demand exposure relative to restorative reserves." },
    { name: "screen_to_sleep_ratio", domain: "Engineered Index", scale: "Continuous Ratio", range: "Formula in Paper", description: "Digital displacement of restorative sleep hours." },
    { name: "academic_performance_index", domain: "Engineered Index", scale: "Continuous Ratio", range: "Formula in Paper", description: "Controls academic achievement by classroom attendance." },
    { name: "wellbeing_buffer", domain: "Engineered Index", scale: "Continuous Score", range: "Formula in Paper", description: "Net coping capacity against psychological demands." }
  ],

  supportHelplines: [
    { name: "Kaan Pete Roi (Emotional Support & Suicide Helpline)", phone: "+880 1779 554391 / +880 1779 554392", hours: "3:00 PM – 3:00 AM Daily", url: "http://shuni.org" },
    { name: "National Mental Health Institute Helpline (Govt of Bangladesh)", phone: "16122 (Toll Free)", hours: "24/7 Available", url: "https://nimh.gov.bd" },
    { name: "Emergency Services Bangladesh (Police / Medical / Ambulance)", phone: "999", hours: "24/7 Toll Free", url: "https://999.gov.bd" },
    { name: "University Student Counseling Center", phone: "Contact your institutional student affairs / guidance office", hours: "Campus Working Hours", url: "#" }
  ]
};

window.RESEARCH_DATA = RESEARCH_DATA;
