// מרכיב ניהול סיכונים בבוט
class RiskManagementTable {
  constructor() {
    // מבנה טבלת הסיכונים המוגדרת מראש
    this.riskCategories = [
      { id: 1, name: "תוכן, תכנים", description: "היווצרות גדולה יותר של תכנים מבוססי ב\"מ", impacts: "הצורך למנגנוני בקרה לאיכות, השטחה של התוצר" },
      { id: 2, name: "כשירות צוות בב\"מ", description: "עלייה בדרישה לכשירות", impacts: "הכשרה של צוותים, צורך למודעות להשלכות אתיות" },
      { id: 3, name: "מקצוענות", description: "אובדן ידע ומקצוענות", impacts: "ירידה באמון באנשי מקצוע, בריחת אנשי מקצוע לתחומים אחרים" },
      { id: 4, name: "ארגון ותכנון", description: "שיבוש של תיאורי תפקידים", impacts: "החלשות מקום הדיאלוג הבין צוותי, ״אדם מול מכונה״ במקום ״אדם מול אדם״" },
      { id: 5, name: "תשתיות", description: "תלות בתשתיות תקשוב חזקות", impacts: "צורך לתקצוב רכישה ותחזוקה, תלות יתר בטכנולוגיה" },
      { id: 6, name: "פרקטיקות הוראה", description: "שיבושים בדרכי הוראה", impacts: "היווצרות גדולה יותר של פרקטיקות, צורך במנגנוני בקרה לאיכות, צורך מיידי להכשרה מקצועית" },
      { id: 7, name: "הערכה של עבודת הצוות", description: "עדכון תהליך הערכה צוותי", impacts: "שינוי בדרישות הערכה ומדידה" },
      { id: 8, name: "חיבוריות", description: "פיצול בין הנלמד במחקר לבין עקרונות יישום", impacts: "קושי ביישום ממצאי מחקר בשדה" }
    ];
    
    // ערכי ברירת מחדל לניקוד סיכונים כפי שהופיעו בטבלה
    this.defaultRiskScores = [
      { categoryId: 1, probability: 6, impact: 4, severity: 24 },
      { categoryId: 2, probability: 7, impact: 3, severity: 21 },
      { categoryId: 3, probability: 3, impact: 6, severity: 18 },
      { categoryId: 4, probability: 2, impact: 4, severity: 8 },
      { categoryId: 5, probability: 3, impact: 2, severity: 6 },
      { categoryId: 6, probability: 2, impact: 3, severity: 6 },
      { categoryId: 7, probability: 2, impact: 3, severity: 6 },
      { categoryId: 8, probability: 1, impact: 2, severity: 2 }
    ];
    
    this.projectRisks = [];
  }
  
  // ניתוח סיכונים עבור פרויקט ספציפי
  analyzeProjectRisks(projectDescription) {
    // מכאן הבוט ינתח את הפרויקט ויערוך התאמה של דירוגי הסיכון
    this.projectRisks = this.riskCategories.map((category, index) => {
      // בשלב זה נשתמש בערכי ברירת מחדל, בהמשך יוחלף באלגוריתם חכם יותר
      const defaultScore = this.defaultRiskScores.find(score => score.categoryId === category.id);
      
      // כאן יוטמע אלגוריתם שמתאים את הדירוג לפרויקט הספציפי
      const projectRelevance = this.calculateProjectRelevance(category, projectDescription);
      
      // התאמת דירוג הסיכון לפי רלוונטיות לפרויקט
      const probability = this.adjustScore(defaultScore.probability, projectRelevance);
      const impact = this.adjustScore(defaultScore.impact, projectRelevance);
      const severity = probability * impact;
      
      return {
        id: category.id,
        category: category.name,
        description: category.description,
        impacts: category.impacts,
        probability: probability,
        impact: impact,
        severity: severity,
        mitigationStrategies: this.generateMitigationStrategies(category, severity)
      };
    });
    
    // מיון הסיכונים לפי חומרה יורדת
    this.projectRisks.sort((a, b) => b.severity - a.severity);
    
    return this.projectRisks;
  }
  
  // חישוב רלוונטיות הסיכון לפרויקט ספציפי
  calculateProjectRelevance(riskCategory, projectDescription) {
    // כאן יוטמע אלגוריתם שמחפש מילות מפתח וקשרים בין תיאור הפרויקט לקטגוריית הסיכון
    // לדוגמה בלבד:
    const relevanceKeywords = {
      "תוכן, תכנים": ["תוכן", "תכנים", "למידה", "מידע", "ידע", "ב\"מ"],
      "כשירות צוות בב\"מ": ["צוות", "הכשרה", "מורים", "כשירות", "מיומנות", "ב\"מ"],
      "מקצוענות": ["מקצועיות", "מומחיות", "ידע", "ניסיון", "מיומנות"],
      "ארגון ותכנון": ["ארגון", "תכנון", "מבנה", "תפקידים", "ניהול"],
      "תשתיות": ["תשתית", "טכנולוגיה", "ציוד", "מחשבים", "רשת", "תקשוב"],
      "פרקטיקות הוראה": ["הוראה", "פדגוגיה", "למידה", "שיטות", "דרכים"],
      "הערכה של עבודת הצוות": ["הערכה", "מדידה", "ביצועים", "צוות"],
      "חיבוריות": ["חיבור", "קשר", "שיתוף פעולה", "אינטגרציה", "מחקר", "יישום"]
    };
    
    const categoryKeywords = relevanceKeywords[riskCategory.name] || [];
    let relevanceScore = 0;
    
    // חיפוש מילות מפתח בתיאור הפרויקט
    categoryKeywords.forEach(keyword => {
      if (projectDescription.includes(keyword)) {
        relevanceScore += 0.2; // תוספת לציון הרלוונטיות עבור כל מילת מפתח שנמצאה
      }
    });
    
    // ערך בין 0.5 ל-1.5, כאשר 1 מייצג רלוונטיות ניטרלית
    return Math.max(0.5, Math.min(1.5, 1 + relevanceScore));
  }
  
  // התאמת דירוג בהתאם לרלוונטיות לפרויקט
  adjustScore(defaultScore, relevanceFactor) {
    // התאמת הציון בהתבסס על רלוונטיות, עם שמירה על טווח 1-10
    const adjustedScore = Math.round(defaultScore * relevanceFactor);
    return Math.max(1, Math.min(10, adjustedScore));
  }
  
  // יצירת אסטרטגיות להתמודדות עם הסיכון
  generateMitigationStrategies(riskCategory, severity) {
    // מאגר אסטרטגיות מיטיגציה לפי קטגוריה וחומרה
    const strategies = {
      "תוכן, תכנים": [
        { minSeverity: 20, strategy: "פיתוח מנגנוני בקרת איכות מובנים ומוסדרים לתכנים מבוססי ב\"מ" },
        { minSeverity: 10, strategy: "הגדרת סטנדרטים ברורים לאיכות התוצרים הנדרשת" },
        { minSeverity: 1, strategy: "ביקורת עמיתים על תכנים לפני אישורם לשימוש" }
      ],
      "כשירות צוות בב\"מ": [
        { minSeverity: 20, strategy: "פיתוח תוכנית הכשרה מקיפה ומחייבת לכל אנשי הצוות" },
        { minSeverity: 10, strategy: "הקצאת שעות ייעודיות ללמידה והתנסות בכלי ב\"מ" },
        { minSeverity: 1, strategy: "יצירת קהילת למידה מקצועית בנושא שימוש מושכל בב\"מ" }
      ],
      "מקצוענות": [
        { minSeverity: 15, strategy: "שילוב מומחיות אנושית כחלק מובנה ומחייב בכל תהליך המשלב ב\"מ" },
        { minSeverity: 8, strategy: "תיעוד ושימור ידע מקצועי באופן מסודר" },
        { minSeverity: 1, strategy: "הגדרת תחומים בהם שיקול דעת אנושי מקצועי הוא הכרחי" }
      ],
      "ארגון ותכנון": [
        { minSeverity: 8, strategy: "הגדרה מחדש של תפקידים ותחומי אחריות במערכת המשלבת ב\"מ" },
        { minSeverity: 5, strategy: "יצירת מנגנונים לחיזוק התקשורת והדיאלוג הבין-צוותי" },
        { minSeverity: 1, strategy: "פיתוח תרבות ארגונית המדגישה את הערך האנושי בחינוך" }
      ],
      "תשתיות": [
        { minSeverity: 6, strategy: "תכנון תקציבי רב-שנתי לרכישה ותחזוקת תשתיות" },
        { minSeverity: 3, strategy: "פיתוח מענים חלופיים למקרה של תקלות טכנולוגיות" },
        { minSeverity: 1, strategy: "הגדרת סטנדרטים מינימליים לתשתיות הנדרשות" }
      ],
      "פרקטיקות הוראה": [
        { minSeverity: 6, strategy: "פיתוח מאגר פרקטיקות הוראה מומלצות המשלבות ב\"מ" },
        { minSeverity: 3, strategy: "תהליכי ניסוי והערכה מבוקרים לפרקטיקות חדשות" },
        { minSeverity: 1, strategy: "שיתוף וחניכה של מורים בפרקטיקות מוצלחות" }
      ],
      "הערכה של עבודת הצוות": [
        { minSeverity: 5, strategy: "פיתוח מדדים חדשים להערכת הצוות בסביבה משולבת ב\"מ" },
        { minSeverity: 3, strategy: "הכשרת מנהלים בהערכת עבודה בסביבה משולבת טכנולוגיה" },
        { minSeverity: 1, strategy: "שילוב משוב עמיתים כחלק מתהליכי הערכה" }
      ],
      "חיבוריות": [
        { minSeverity: 2, strategy: "יצירת פורומים משותפים לאנשי מחקר ושדה" },
        { minSeverity: 1, strategy: "הנגשת ממצאי מחקר לאנשי השדה ואיסוף משוב" }
      ]
    };
    
    // בחירת אסטרטגיות מתאימות לפי רמת חומרה
    const categoryStrategies = strategies[riskCategory.name] || [];
    const relevantStrategies = categoryStrategies
      .filter(s => s.minSeverity <= severity)
      .map(s => s.strategy);
    
    return relevantStrategies;
  }
  
  // יצירת טבלת סיכונים בפורמט HTML
  generateRiskTableHTML() {
    let tableHTML = `
      <table class="risk-table">
        <thead>
          <tr>
            <th>מס'</th>
            <th>קטגוריה</th>
            <th>תיאור הסיכון</th>
            <th>השלכות הסיכון</th>
            <th>הסתברות (1-10)</th>
            <th>נזק צפוי (1-10)</th>
            <th>חומרת הסיכון</th>
            <th>אסטרטגיות להתמודדות</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    this.projectRisks.forEach(risk => {
      tableHTML += `
        <tr>
          <td>${risk.id}</td>
          <td>${risk.category}</td>
          <td>${risk.description}</td>
          <td>${risk.impacts}</td>
          <td>${risk.probability}</td>
          <td>${risk.impact}</td>
          <td>${risk.severity}</td>
          <td>
            <ul>
              ${risk.mitigationStrategies.map(strategy => `<li>${strategy}</li>`).join('')}
            </ul>
          </td>
        </tr>
      `;
    });
    
    tableHTML += `
        </tbody>
      </table>
    `;
    
    return tableHTML;
  }
  
  // יצירת טבלת סיכונים בפורמט CSV
  generateRiskTableCSV() {
    let csv = "מספר,קטגוריה,תיאור הסיכון,השלכות הסיכון,הסתברות,נזק צפוי,חומרת הסיכון,אסטרטגיות להתמודדות\n";
    
    this.projectRisks.forEach(risk => {
      csv += `${risk.id},"${risk.category}","${risk.description}","${risk.impacts}",${risk.probability},${risk.impact},${risk.severity},"${risk.mitigationStrategies.join('; ')}"\n`;
    });
    
    return csv;
  }
  
  // יצירת טבלת סיכונים בפורמט JSON
  generateRiskTableJSON() {
    return JSON.stringify(this.projectRisks, null, 2);
  }
}

// מחלקת הבוט לניתוח סיכונים
class RiskAssessmentBot {
  constructor() {
    this.projectData = null;
    this.riskTable = new RiskManagementTable();
  }
  
  // קריאת מסמך הפרויקט
  readProjectDocument(projectData) {
    this.projectData = projectData;
    console.log("מסמך הפרויקט נקרא בהצלחה");
  }
  
  // זיהוי סיכונים
  identifyRisks() {
    console.log("זיהוי סיכונים פוטנציאליים בפרויקט");
    // אלגוריתם לזיהוי סיכונים - בשלב זה משתמשים במודל הקבוע
  }
  
  // ניתוח סיכונים
  analyzeRisks() {
    console.log("ניתוח וכימות הסיכונים");
    // פונקציונליות זו מועברת למחלקת RiskManagementTable
  }
  
  // הצלבה עם רגולציה קיימת
  matchWithExistingRegulations() {
    console.log("הצלבה עם רגולציה קיימת");
    // בעתיד - הצלבה עם מפת התמצאות לאסדרת חדשנות חינוכית
  }
  
  // הפקת דוח סיכונים
  generateRiskReport() {
    if (!this.projectData) {
      return "יש להזין נתוני פרויקט תחילה";
    }
    
    // יצירת תיאור מלא של הפרויקט לצורך ניתוח
    const fullDescription = [
      this.projectData.description,
      this.projectData.curriculum,
      this.projectData.lte,
      this.projectData.infrastructure,
      this.projectData.planning,
      this.projectData.stakeholders
    ].join(' ');
    
    // ניתוח סיכונים ספציפיים לפרויקט
// הוספת יכולות עבודה עם קבצים
class FileManager {
  constructor() {
    this.files = [];
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];
  }
  
  // הוספת קובץ למערכת
  addFile(file) {
    return new Promise((resolve, reject) => {
      // בדיקת גודל קובץ
      if (file.size > this.maxFileSize) {
        reject(`הקובץ ${file.name} גדול מדי. גודל מקסימלי הוא 5MB.`);
        return;
      }
      
      // בדיקת סוג קובץ
      if (!this.allowedTypes.includes(file.type) && 
          !this.allowedTypes.some(type => file.name.endsWith(type.split('/')[1]))) {
        reject(`סוג הקובץ ${file.name} אינו נתמך. הסוגים הנתמכים הם: PDF, Word, PowerPoint, TXT.`);
        return;
      }
      
      // קריאת הקובץ
      const reader = new FileReader();
      
      reader.onload = (event) => {
        this.files.push({
          name: file.name,
          size: file.size,
          type: file.type,
          content: event.target.result
        });
        resolve(file);
      };
      
      reader.onerror = () => {
        reject(`שגיאה בקריאת הקובץ ${file.name}.`);
      };
      
      // קריאת הקובץ כטקסט או כבינארי בהתאם לסוג
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }
  
  // הסרת קובץ
  removeFile(index) {
    if (index >= 0 && index < this.files.length) {
      this.files.splice(index, 1);
      return true;
    }
    return false;
  }
  
  // מיצוי טקסט מקבצים
  extractTextFromFiles() {
    const textContents = [];
    
    this.files.forEach(file => {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        textContents.push(file.content);
      } else {
        // לקבצים שאינם טקסט - נוסיף לוגיקה בהמשך
        // בינתיים נשתמש רק בשמות הקבצים
        textContents.push(`קובץ: ${file.name}`);
      }
    });
    
    return textContents.join('\n\n');
  }
  
  // עדכון טבלת הקבצים בממשק
  updateFileList(elementId) {
    const fileListElement = document.getElementById(elementId);
    fileListElement.innerHTML = '';
    
    this.files.forEach((file, index) => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      
      // המרת גודל קובץ למבנה קריא
      const fileSizeDisplay = this.formatFileSize(file.size);
      
      fileItem.innerHTML = `
        <div class="file-name">${file.name}</div>
        <div class="file-size">${fileSizeDisplay}</div>
        <div class="file-remove" data-index="${index}">×</div>
      `;
      
      fileListElement.appendChild(fileItem);
      
      // הוספת אירוע להסרת קובץ
      fileItem.querySelector('.file-remove').addEventListener('click', (event) => {
        const fileIndex = parseInt(event.target.getAttribute('data-index'));
        this.removeFile(fileIndex);
        this.updateFileList(elementId);
      });
    });
  }
  
  // המרת גודל קובץ ליחידות קריאות
  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  }
  
  // קבלת מידע רלוונטי מהקבצים לניתוח סיכונים
  getRelevantContentForRiskAnalysis() {
    let relevantContent = '';
    
    // שליפת מילות מפתח רלוונטיות מהקבצים
    const keywordsToExtract = [
      'סיכון', 'סיכונים', 'אתגר', 'אתגרים', 'קושי', 'קשיים',
      'בינה מלאכותית', 'ב"מ', 'טכנולוגיה', 'חדשנות', 'למידה',
      'הוראה', 'פדגוגיה', 'תכנים', 'תשתית', 'תשתיות', 'תכנון',
      'ארגון', 'צוות', 'הכשרה', 'מקצוענות', 'הערכה', 'פיתוח'
    ];
    
    this.files.forEach(file => {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        // חיפוש משפטים עם מילות מפתח
        const content = file.content;
        const sentences = content.split(/[.!?]+/);
        
        sentences.forEach(sentence => {
          if (keywordsToExtract.some(keyword => sentence.includes(keyword))) {
            relevantContent += sentence.trim() + '. ';
          }
        });
      }
    });
    
    return relevantContent;
  }
}

// עדכון מחלקת RiskAssessmentBot לתמיכה בקבצים
class ExtendedRiskBot extends RiskAssessmentBot {
  constructor() {
    super();
    this.fileManager = new FileManager();
  }
  
  // ניתוח מורחב הכולל קבצים
  analyzeWithFiles(projectData, useFilesOption) {
    // קריאת מסמך הפרויקט
    this.readProjectDocument(projectData);
    
    // זיהוי סיכונים
    this.identifyRisks();
    
    // שילוב מידע מקבצים בהתאם לאפשרות שנבחרה
    let additionalContext = '';
    
    if (useFilesOption === 'extract' && this.fileManager.files.length > 0) {
      additionalContext = this.fileManager.getRelevantContentForRiskAnalysis();
    }
    
    // יצירת תיאור מלא של הפרויקט לצורך ניתוח
    const fullDescription = [
      this.projectData.description,
      this.projectData.curriculum,
      this.projectData.lte,
      this.projectData.infrastructure,
      this.projectData.planning,
      this.projectData.stakeholders,
      additionalContext // הוספת המידע מהקבצים
    ].join(' ');
    
    // ניתוח סיכונים עם המידע המשולב
    this.riskTable.analyzeProjectRisks(fullDescription);
    
    // הצלבה עם רגולציה קיימת
    this.matchWithExistingRegulations();
    
    // החזרת דוח מורחב
    return this.generateExtendedReport(useFilesOption);
  }
  
  // יצירת דוח מורחב
  generateExtendedReport(useFilesOption) {
    const standardReport = {
      html: this.riskTable.generateRiskTableHTML(),
      csv: this.riskTable.generateRiskTableCSV(),
      json: this.riskTable.generateRiskTableJSON()
    };
    
    // הוספת מידע על קבצים שנותחו
    let fileInfo = '';
    if (this.fileManager.files.length > 0) {
      fileInfo = `<div class="file-analysis-info">
        <h4>קבצים ששימשו לניתוח (${this.fileManager.files.length}):</h4>
        <ul>
          ${this.fileManager.files.map(file => `<li>${file.name} (${this.fileManager.formatFileSize(file.size)})</li>`).join('')}
        </ul>
        <p>שיטת ניתוח קבצים: ${this.getFileUseDescription(useFilesOption)}</p>
      </div>`;
    }
    
    // יצירת מבנה לשוניות לדוח המורחב
    const tabsHTML = `
      <div class="expanded-report">
        ${fileInfo}
        <div class="report-tabs">
          <div class="report-tab active" data-tab="risk-table">טבלת סיכונים</div>
          <div class="report-tab" data-tab="file-content">תוכן קבצים רלוונטי</div>
          <div class="report-tab" data-tab="summary">סיכום והמלצות</div>
        </div>
        
        <div class="tab-content active" id="risk-table-content">
          ${standardReport.html}
        </div>
        
        <div class="tab-content" id="file-content-content">
          <h3>תוכן רלוונטי מהקבצים שהועלו:</h3>
          <div class="file-content-preview">
            ${this.fileManager.files.length > 0 ? this.fileManager.getRelevantContentForRiskAnalysis() || 'לא נמצא תוכן רלוונטי לניתוח סיכונים בקבצים שהועלו.' : 'לא הועלו קבצים לניתוח.'}
          </div>
        </div>
        
        <div class="tab-content" id="summary-content">
          <h3>סיכום ממצאים והמלצות:</h3>
          <div>
            <p><strong>הסיכונים העיקריים שזוהו:</strong></p>
            <ul>
              ${this.getTopRisks(3).map(risk => `
                <li>
                  <strong>${risk.category}:</strong> ${risk.description} 
                  (חומרה: ${risk.severity}, הסתברות: ${risk.probability}, נזק צפוי: ${risk.impact})
                </li>
              `).join('')}
            </ul>
            
            <p><strong>המלצות עיקריות:</strong></p>
            <ul>
              ${this.getTopRecommendations().map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
    
    return {
      ...standardReport,
      extendedHTML: tabsHTML
    };
  }
  
  // קבלת תיאור לשיטת השימוש בקבצים
  getFileUseDescription(useFilesOption) {
    switch(useFilesOption) {
      case 'extract':
        return 'מיצוי מידע רלוונטי לניתוח סיכונים';
      case 'compare':
        return 'השוואה לפרויקטים קודמים';
      case 'reference':
        return 'שימוש כחומר רקע בלבד';
      default:
        return 'לא צוין';
    }
  }
  
  // קבלת הסיכונים העיקריים
  getTopRisks(count) {
    return this.riskTable.projectRisks.slice(0, count);
  }
  
  // קבלת ההמלצות העיקריות
  getTopRecommendations() {
    const recommendations = [];
    
    // איסוף אסטרטגיות מיטיגציה מהסיכונים העיקריים
    this.getTopRisks(3).forEach(risk => {
      if (risk.mitigationStrategies && risk.mitigationStrategies.length > 0) {
        risk.mitigationStrategies.forEach(strategy => {
          if (!recommendations.includes(strategy)) {
            recommendations.push(strategy);
          }
        });
      }
    });
    
    // הוספת המלצות כלליות
    recommendations.push(
      'מומלץ להקים צוות ייעודי למעקב אחר סיכונים ויישום אסטרטגיות התמודדות',
      'יש לתעד את תהליך ניהול הסיכונים ולעדכן את הניתוח באופן תקופתי'
    );
    
    return recommendations.slice(0, 5); // החזרת 5 המלצות עיקריות
  }
}
