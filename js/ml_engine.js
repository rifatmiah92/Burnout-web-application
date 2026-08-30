/**
 * ML Inference & Feature Engineering Engine for Student Burnout Prediction
 * Implements 100% exact mathematical formulas from the research paper:
 * "Explainable Machine Learning for Student Burnout Classification and Risk Stratification: A Mixed-Methods Study with Qualitative Triangulation"
 */

class StudentBurnoutMLEngine {
  constructor(modelData) {
    this.modelData = modelData || (typeof MODEL_DATA !== 'undefined' ? MODEL_DATA : null);
    this.isReady = !!this.modelData;
  }

  init(data) {
    this.modelData = data;
    this.isReady = true;
  }

  /**
   * Canonical Feature Engineering
   * Exact match with feature_engineering.py
   */
  engineerFeatures(input) {
    const raw = { ...input };

    // Numerical conversions
    const stress = Number(raw.stress_score);
    const depression = Number(raw.depression_score);
    const academicPressure = Number(raw.academic_pressure_score);
    const workload = Number(raw.workload_score);
    const motivation = Number(raw.motivation_score);
    const sleepQuality = Number(raw.sleep_quality_score);
    const sleepHours = Number(raw.sleep_hours_numeric);
    const studyHours = Number(raw.study_hours_numeric);
    const socialMediaHours = Number(raw.social_media_hours);
    const physicalHours = Number(raw.physical_activity_hours);
    const cgpa = Number(raw.cgpa_midpoint);
    const attendance = Number(raw.attendance_pct);
    const partTime = Number(raw.part_time_score);

    // 9 Domain-Engineered Composite Features
    const psychological_strain_index = stress + depression;
    const academic_pressure_index = academicPressure + workload;
    
    // Laplace stabilizing constant epsilon = 0.1
    const burnout_vulnerability_index = (psychological_strain_index * academic_pressure_index) / (motivation + sleepQuality + 0.1);
    const sleep_deprivation_index = Math.max(0.0, (8.0 - sleepHours) * (4.0 - sleepQuality));
    const screen_to_sleep_ratio = socialMediaHours / (sleepHours + 0.1);
    const study_to_rest_ratio = (studyHours + socialMediaHours) / (sleepHours + physicalHours + 0.1);
    const academic_performance_index = (cgpa / 4.0) * (attendance / 100.0);
    const motivation_deficit_score = (4.0 - motivation) * stress;
    const wellbeing_buffer = (physicalHours + sleepQuality) - stress;

    return {
      ...raw,
      // Raw numerical fields
      study_hours_numeric: studyHours,
      sleep_hours_numeric: sleepHours,
      social_media_hours: socialMediaHours,
      physical_activity_hours: physicalHours,
      attendance_pct: attendance,
      cgpa_midpoint: cgpa,
      stress_score: stress,
      depression_score: depression,
      academic_pressure_score: academicPressure,
      workload_score: workload,
      part_time_score: partTime,
      motivation_score: motivation,
      sleep_quality_score: sleepQuality,
      // 9 Engineered Composite Features
      psychological_strain_index,
      academic_pressure_index,
      burnout_vulnerability_index,
      sleep_deprivation_index,
      screen_to_sleep_ratio,
      study_to_rest_ratio,
      academic_performance_index,
      motivation_deficit_score,
      wellbeing_buffer
    };
  }

  /**
   * Transforms raw and engineered features into scaled & one-hot encoded vector
   */
  transformFeatures(featObj) {
    if (!this.modelData) throw new Error("Model data not loaded yet.");

    const { scaler, ohe_categories, num_features, cat_features } = this.modelData;

    // 1. Standardize numerical features: (x - mean) / scale
    const scaledNum = [];
    for (let i = 0; i < num_features.length; i++) {
      const featName = num_features[i];
      const val = Number(featObj[featName]);
      const mean = scaler.mean[i];
      const scale = scaler.scale[i];
      scaledNum.push((val - mean) / (scale || 1.0));
    }

    // 2. One-hot encode categorical features (drop='first')
    const encodedCat = [];
    for (let i = 0; i < cat_features.length; i++) {
      const catName = cat_features[i];
      const val = String(featObj[catName]);
      const categories = ohe_categories[catName]; // all categories in training set

      // drop='first': skip categories[0]
      for (let c = 1; c < categories.length; c++) {
        encodedCat.push(val === categories[c] ? 1.0 : 0.0);
      }
    }

    return scaledNum.concat(encodedCat);
  }

  /**
   * Traverses a single Scikit-Learn Decision Tree
   */
  evalTree(tree, x) {
    let node = 0;
    while (tree.feature[node] !== -2 && tree.children_left[node] !== -1) {
      const featIdx = tree.feature[node];
      const thresh = tree.threshold[node];
      if (x[featIdx] <= thresh) {
        node = tree.children_left[node];
      } else {
        node = tree.children_right[node];
      }
    }
    // leaf node value: shape [1, 2] -> [count_0, count_1]
    const counts = tree.value[node][0];
    const total = counts[0] + counts[1];
    return total > 0 ? counts[1] / total : 0.0;
  }

  /**
   * Predicts probability of High Burnout (Target = 1) using Random Forest (150 trees)
   */
  predictRandomForest(xVector) {
    if (!this.modelData || !this.modelData.rf_trees) return 0.5;

    const trees = this.modelData.rf_trees;
    let sumProb = 0.0;
    for (let i = 0; i < trees.length; i++) {
      sumProb += this.evalTree(trees[i], xVector);
    }
    return sumProb / trees.length;
  }

  /**
   * Predicts probability using Logistic Regression
   */
  predictLogisticRegression(xVector) {
    if (!this.modelData || !this.modelData.lr_model) return 0.5;
    const { intercept, coef } = this.modelData.lr_model;
    let z = intercept;
    for (let i = 0; i < xVector.length; i++) {
      z += coef[i] * xVector[i];
    }
    return 1.0 / (1.0 + Math.exp(-z));
  }

  /**
   * Full end-to-end evaluation with XAI explainability and tailored recommendations
   */
  assessStudent(input, threshold = 0.38) {
    const engineered = this.engineerFeatures(input);
    const xVector = this.transformFeatures(engineered);

    const rfProbability = this.predictRandomForest(xVector);
    const lrProbability = this.predictLogisticRegression(xVector);
    const ensembleProbability = (rfProbability * 0.6 + lrProbability * 0.4);

    // Primary calibrated probability (Random Forest)
    const prob = rfProbability;
    const isHighBurnout = prob >= threshold;

    // Severity tier stratification
    let severityTier = "Low Risk";
    let tierBadgeClass = "badge-success";
    let tierColor = "#10b981"; // Emerald green
    let tierDescription = "Your academic and lifestyle indicators are well-balanced. You exhibit healthy restorative reserves and manageable psychological demands.";

    if (prob >= 0.50) {
      severityTier = "High Burnout Risk";
      tierBadgeClass = "badge-danger";
      tierColor = "#ef4444"; // Red
      tierDescription = "Critical burnout vulnerability detected. Multiple compounding demands (sleep displacement, cognitive fatigue, or high pressure) are depleting your psychological reserves.";
    } else if (prob >= 0.38) {
      severityTier = "Moderate / Sub-Clinical Risk";
      tierBadgeClass = "badge-warning";
      tierColor = "#f59e0b"; // Amber
      tierDescription = "Elevated early-warning indicators detected. While not at acute crisis levels, early intervention is recommended to prevent progression to chronic burnout.";
    }

    // Explainability: Compute feature deviations and directional impact
    const factorAttributions = this.computeFactorAttributions(engineered, prob);

    // Generate Tailored Action Plan
    const recommendations = this.generateRecommendations(engineered, prob, factorAttributions);

    return {
      input,
      engineered,
      probabilities: {
        randomForest: rfProbability,
        logisticRegression: lrProbability,
        ensemble: ensembleProbability
      },
      finalProbability: prob,
      threshold,
      isHighBurnout,
      severityTier,
      tierBadgeClass,
      tierColor,
      tierDescription,
      factorAttributions,
      recommendations
    };
  }

  /**
   * Computes personalized feature contributions relative to population baseline norms
   */
  computeFactorAttributions(featObj, predictedProb) {
    if (!this.modelData || !this.modelData.population_norms) return [];

    const norms = this.modelData.population_norms;
    const importances = this.modelData.rf_feature_importances;

    const factors = [
      {
        key: 'screen_to_sleep_ratio',
        label: 'Screen-to-Sleep Ratio',
        category: 'Digital / Sleep',
        higherIsBad: true,
        userVal: featObj.screen_to_sleep_ratio,
        format: v => v.toFixed(2) + 'x'
      },
      {
        key: 'academic_performance_index',
        label: 'Academic Performance Index',
        category: 'Academic Engagement',
        higherIsBad: false,
        userVal: featObj.academic_performance_index,
        format: v => v.toFixed(2)
      },
      {
        key: 'burnout_vulnerability_index',
        label: 'Burnout Vulnerability Index',
        category: 'Systemic Risk',
        higherIsBad: true,
        userVal: featObj.burnout_vulnerability_index,
        format: v => v.toFixed(2)
      },
      {
        key: 'sleep_deprivation_index',
        label: 'Sleep Deprivation Deficit',
        category: 'Circadian Reserve',
        higherIsBad: true,
        userVal: featObj.sleep_deprivation_index,
        format: v => v.toFixed(1)
      },
      {
        key: 'psychological_strain_index',
        label: 'Psychological Distress (Stress + Depression)',
        category: 'Affective Strain',
        higherIsBad: true,
        userVal: featObj.psychological_strain_index,
        format: v => v.toFixed(1) + ' / 8.0'
      },
      {
        key: 'cgpa_midpoint',
        label: 'CGPA Bracket Standing',
        category: 'Academic Achievement',
        higherIsBad: false,
        userVal: featObj.cgpa_midpoint,
        format: v => v.toFixed(2)
      },
      {
        key: 'wellbeing_buffer',
        label: 'Wellbeing Buffer (Exercise + Sleep Quality - Stress)',
        category: 'Protective Reserve',
        higherIsBad: false,
        userVal: featObj.wellbeing_buffer,
        format: v => (v > 0 ? '+' : '') + v.toFixed(1)
      },
      {
        key: 'social_media_hours',
        label: 'Daily Social Media Scrolling',
        category: 'Digital Habit',
        higherIsBad: true,
        userVal: featObj.social_media_hours,
        format: v => v.toFixed(1) + ' hrs/day'
      },
      {
        key: 'sleep_hours_numeric',
        label: 'Total Daily Sleep Duration',
        category: 'Circadian Reserve',
        higherIsBad: false,
        userVal: featObj.sleep_hours_numeric,
        format: v => v.toFixed(1) + ' hrs/day'
      },
      {
        key: 'motivation_score',
        label: 'Intrinsic Academic Motivation',
        category: 'Motivational Reserve',
        higherIsBad: false,
        userVal: featObj.motivation_score,
        format: v => ['Low (1)', 'Moderate (2)', 'High (3)'][Math.round(v) - 1] || v
      }
    ];

    const results = factors.map(f => {
      const norm = norms[f.key] || { mean: 0, std: 1 };
      const z = (f.userVal - norm.mean) / (norm.std || 1.0);
      const globalWeight = importances[f.key] || 0.01;

      // Positive score = increases burnout risk; Negative score = protective buffer
      const rawImpact = (f.higherIsBad ? z : -z) * globalWeight * 100.0;
      const isRiskDriver = rawImpact > 0.05;
      const isProtective = rawImpact < -0.05;

      return {
        ...f,
        mean: norm.mean,
        zScore: z,
        rawImpact,
        absImpact: Math.abs(rawImpact),
        isRiskDriver,
        isProtective,
        statusText: isRiskDriver ? "Elevating Risk" : (isProtective ? "Protective Factor" : "Neutral / Baseline")
      };
    });

    // Sort by absolute attribution impact
    results.sort((a, b) => b.absImpact - a.absImpact);
    return results;
  }

  /**
   * Generates actionable, theoretically grounded recommendations (JD-R & COR)
   */
  generateRecommendations(featObj, prob, attributions) {
    const recs = [];

    // 1. Screen-to-Sleep & Digital Detachment
    if (featObj.screen_to_sleep_ratio > 0.6 || featObj.social_media_hours >= 4.0) {
      recs.push({
        domain: "Digital Detachment & Circadian Recovery",
        icon: "moon",
        priority: "High Priority",
        badgeColor: "danger",
        title: "Mitigate Screen-to-Sleep Displacement",
        guidance: `Your daily social media use (${featObj.social_media_hours} hrs) is disproportionately high compared to your sleep (${featObj.sleep_hours_numeric} hrs). Implement a strict "no-screen buffer" 45 minutes before bedtime to prevent blue-light melatonin suppression and nocturnal anxiety escalation.`
      });
    }

    // 2. Sleep Deprivation
    if (featObj.sleep_hours_numeric < 6.0 || featObj.sleep_quality_score <= 1.5) {
      recs.push({
        domain: "Biological Sleep Hygiene",
        icon: "bed",
        priority: "High Priority",
        badgeColor: "danger",
        title: "Rebuild Restorative Sleep Reserves",
        guidance: `Your current sleep duration (${featObj.sleep_hours_numeric} hrs) falls below the 7–8 hour cognitive restoration threshold. Prioritize consistent sleep-wake cycles even during exam weeks; research shows sleep recovery directly enhances memory consolidation and academic self-efficacy.`
      });
    }

    // 3. Psychological Distress & Career Anxiety
    if (featObj.psychological_strain_index >= 5.0 || featObj.depression_score >= 3.0) {
      recs.push({
        domain: "Psychological Support & Stress Management",
        icon: "heart-pulse",
        priority: "Urgent",
        badgeColor: "danger",
        title: "Access Institutional Counseling & Peer Support",
        guidance: `You reported elevated stress and depressive affect (${featObj.psychological_strain_index} / 8.0). Consider scheduling a confidential session with your university's student counseling center or calling the free national helpline (16122 / Kaan Pete Roi). Discussing academic anxiety with mentors significantly reduces cognitive rumination.`
      });
    }

    // 4. Physical Activity & Wellbeing Buffer
    if (featObj.physical_activity_hours <= 1.0 || featObj.wellbeing_buffer < 0) {
      recs.push({
        domain: "Physical Activity & Active Coping",
        icon: "activity",
        priority: "Medium Priority",
        badgeColor: "warning",
        title: "Activate Daily Physical Reset Breaks",
        guidance: `Incorporating 30–45 minutes of brisk walking, cycling, or sports increases cortisol regulation and acts as an immediate psychological buffer against academic burnout.`
      });
    }

    // 5. Academic Workload Pacing
    if (featObj.academic_pressure_index >= 6.0 || featObj.workload_score >= 3.0) {
      recs.push({
        domain: "Academic Workload Pacing",
        icon: "book-open",
        priority: "Medium Priority",
        badgeColor: "info",
        title: "Implement Pomodoro & Structured Task Chunking",
        guidance: `Break heavy assignment loads into 25-minute focused blocks followed by 5-minute cognitive breaks. Avoid continuous multi-hour cramming sessions which trigger cognitive fatigue and study aversion.`
      });
    }

    // Fallback if low risk
    if (recs.length === 0) {
      recs.push({
        domain: "Maintenance & Sustainability",
        icon: "shield-check",
        priority: "Optimal Habit",
        badgeColor: "success",
        title: "Maintain Your Healthy Equilibrium",
        guidance: "Your current lifestyle balance, study habits, and sleep reserves are protecting you from academic exhaustion. Continue monitoring your stress levels during midterms and finals."
      });
    }

    return recs;
  }
}

// Instantiate and expose globally
window.StudentBurnoutMLEngine = StudentBurnoutMLEngine;
window.mlEngine = new StudentBurnoutMLEngine(typeof MODEL_DATA !== 'undefined' ? MODEL_DATA : null);
