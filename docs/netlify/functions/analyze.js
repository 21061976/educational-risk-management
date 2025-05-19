const axios = require('axios');

exports.handler = async function(event, context) {
  // בדיקה שהבקשה היא POST
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  try {
    // קבל את הנתונים מהבקשה
    const body = JSON.parse(event.body);
    const { projectData, fileContent } = body;

    // בנה את הפרומפט ל-Claude
    const prompt = `
    תנתח את הפרויקט החינוכי הבא ותזהה סיכונים פוטנציאליים בהטמעת בינה מלאכותית בחינוך.
    
    פרטי הפרויקט:
    שם: ${projectData.name}
    תיאור: ${projectData.description}
    תוכנית לימודים: ${projectData.curriculum || 'לא צוין'}
    למידה, הוראה והערכה: ${projectData.lte || 'לא צוין'}
    
    תוכן קבצים נוספים:
    ${fileContent || 'לא הועלו קבצים'}
    
    בצע ניתוח סיכונים הכולל את הקטגוריות הבאות:
    1. תוכן ותכנים
    2. כשירות צוות בבינה מלאכותית
    3. מקצוענות
    4. ארגון ותכנון
    5. תשתיות
    
    לכל קטגוריה, ספק:
    - תיאור קצר של הסיכון בקטגוריה זו בהקשר של הפרויקט המתואר
    - השלכות אפשריות של הסיכון
    - דירוג הסתברות (1-10)
    - דירוג השפעה (1-10)
    - חומרה כוללת (הסתברות × השפעה)
    - אסטרטגיות להתמודדות (2-3 לכל קטגוריה)
    
    החזר את התשובה בפורמט JSON בדיוק לפי המבנה הבא:
    {
      "risks": [
        {
          "category": "שם הקטגוריה",
          "description": "תיאור הסיכון",
          "impacts": "השלכות הסיכון",
          "probability": מספר,
          "impact": מספר,
          "severity": מספר,
          "strategies": ["אסטרטגיה 1", "אסטרטגיה 2", "אסטרטגיה 3"]
        },
        ...
      ],
      "summary": "סיכום קצר של הניתוח",
      "additionalRisks": ["סיכון נוסף 1", "סיכון נוסף 2"]
    }
    
    חשוב: החזר את התשובה אך ורק בפורמט JSON המבוקש ללא טקסט או הסברים נוספים.
    `;

    // קרא ל-API של Anthropic
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      temperature: 0.3,
      system: "אתה מומחה לניתוח סיכונים בפרויקטים חינוכיים המשלבים בינה מלאכותית. תפקידך לזהות סיכונים, להעריך אותם ולהציע אסטרטגיות להתמודדות.",
      messages: [
        { role: "user", content: prompt }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    // החזר את התשובה
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        analysis: response.data.content[0].text
      })
    };
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Internal Server Error", 
        details: error.response ? error.response.data : error.message 
      })
    };
  }
};
