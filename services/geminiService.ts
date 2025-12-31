
import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { PlantInfo } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PLANT_ANALYSIS_MODEL = "gemini-3-pro-preview";
const CHAT_MODEL = "gemini-3-pro-preview";

// Schema for structured output including verification
const plantSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isMatch: { type: Type.BOOLEAN, description: "True if the plant is successfully identified. False if ambiguous or mismatch." },
    verificationMessage: { type: Type.STRING, description: "Explanation of identification or mismatch." },
    commonName: { type: Type.STRING, description: "Common name of the plant identified" },
    scientificName: { type: Type.STRING, description: "Scientific name of the plant" },
    shortDescription: { type: Type.STRING, description: "A brief, engaging description (2-3 sentences)." },
    careInstructions: {
      type: Type.OBJECT,
      properties: {
        water: { type: Type.STRING, description: "Watering frequency and advice." },
        sunlight: { type: Type.STRING, description: "Sunlight exposure requirements." },
        temperature: { type: Type.STRING, description: "Ideal temperature range." },
        soil: { type: Type.STRING, description: "Soil type preferences." },
        fertilizer: { type: Type.STRING, description: "Fertilizer recommendations." },
        pruning: { type: Type.STRING, description: "Pruning advice (optional)." },
      },
      required: ["water", "sunlight", "temperature", "soil", "fertilizer"],
    },
    funFact: { type: Type.STRING, description: "An interesting fact." },
    toxicity: { type: Type.STRING, description: "Toxicity info." },
    vastuTips: { type: Type.STRING, description: "General summary of Vastu advice." },
    vastuDetails: {
      type: Type.OBJECT,
      properties: {
        bestDirections: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: "List of optimal directions. Must choose from: 'North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'." 
        },
        avoidDirections: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "List of directions to avoid. Choose from standard 8 cardinal/ordinal directions."
        },
        energyType: { type: Type.STRING, description: "Type of energy this plant brings (e.g., 'Wealth', 'Calm', 'Health')." },
        placementReason: { type: Type.STRING, description: "Detailed explanation of why these directions are chosen." }
      },
      required: ["bestDirections", "energyType", "placementReason"]
    },
    stepByStepGuide: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A simple, easy-to-understand comprehensive guide formatted exactly as 'Point 1: ...', 'Point 2: ...', etc. covering placement, watering, and care."
    },
    healthAssessment: {
      type: Type.OBJECT,
      properties: {
        status: { 
          type: Type.STRING, 
          description: "Analyze the image for signs of disease. Must be one of: 'HEALTHY', 'NEEDS_ATTENTION', 'SICK'. If the plant looks vibrant with no spots/yellowing, it is HEALTHY." 
        },
        issues: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: "List of visual symptoms (e.g., 'Yellow leaves', 'Brown spots', 'Drooping', 'Pests'). Return empty array if healthy." 
        },
        remedy: { type: Type.STRING, description: "Brief summary of the cure or maintenance." },
        detailedDiagnosis: { type: Type.STRING, description: "A detailed explanation of the condition, why it might be happening (e.g., overwatering causing root rot), and what to look for." },
        actionableSteps: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: "A specific checklist of actions to take immediately. E.g., 'Isolate the plant', 'Trim affected leaves', 'Apply Neem oil'." 
        },
        potentialPests: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: "List specific pests if detected or suspected (e.g., 'Spider Mites', 'Mealybugs'). Empty if none." 
        },
        confidence: { type: Type.INTEGER, description: "Confidence score (0-100) of the health diagnosis." }
      },
      required: ["status", "issues", "remedy", "detailedDiagnosis", "actionableSteps", "potentialPests", "confidence"]
    }
  },
  required: ["isMatch", "verificationMessage", "commonName", "scientificName", "shortDescription", "careInstructions", "funFact", "toxicity", "vastuTips", "vastuDetails", "stepByStepGuide", "healthAssessment"],
};

export const analyzePlantImage = async (base64Image: string, country: string, userPlantName: string): Promise<PlantInfo> => {
  try {
    let promptText = `The user is currently in this country: "${country}".`;
    const parts: any[] = [];

    // Case 1: Image provided
    if (base64Image && base64Image.trim() !== "") {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      });

      if (userPlantName && userPlantName.trim() !== "") {
        promptText += `\nThe user claims the plant in the image is named: "${userPlantName}".
        1. Identify the plant in the image.
        2. Compare your identification with the user's claimed name ("${userPlantName}").
        3. If the image reasonably matches the user's name (allow for synonyms or broad categories), set 'isMatch' to true.
        4. If the image is CLEARLY a different plant, set 'isMatch' to false.`;
      } else {
        promptText += `\nThe user has NOT provided a plant name.
        1. Identify the plant in the image.
        2. If you can identify it with high confidence, set 'isMatch' to true.
        3. If the image is too blurry, generic, or ambiguous (could be multiple distinct plants) and you cannot be sure, set 'isMatch' to false.`;
      }
    } 
    // Case 2: No Image provided (Text only)
    else {
      promptText += `\nNO IMAGE PROVIDED. The user specifically wants information about the plant named: "${userPlantName}".
      1. Assume the user's identification is correct.
      2. Set 'isMatch' to true.
      3. Set 'verificationMessage' to "Care instructions generated for ${userPlantName}."
      4. Provide details for "${userPlantName}".`;
    }

    promptText += `\n5. Provide detailed care instructions specifically optimized for the climate in "${country}".
    6. Provide specific Vastu Shastra advice. IMPORTANT: You must populate the 'vastuDetails' object with specific directions (North, North-East, etc) for the visual compass.
    7. Provide a 'stepByStepGuide' that explains everything a beginner needs to know in simple English, formatted as "Point 1: ...", "Point 2: ...", etc.
    8. **CRITICAL - PLANT DOCTOR DIAGNOSIS**: 
       - Analyze the visual evidence in the image for health issues (color, texture, spots, drooping). 
       - If no image is provided, set status to 'HEALTHY' and actionableSteps to general preventative maintenance.
       - If the plant is SICK or NEEDS_ATTENTION:
         - Identify specific pests if visible (e.g., Mealybugs, Scale, Spider Mites).
         - Provide a 'detailedDiagnosis' explaining the root cause.
         - Provide 3-5 specific 'actionableSteps' for treatment (e.g., "Quarantine plant immediately", "Wipe leaves with alcohol").`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: PLANT_ANALYSIS_MODEL,
      contents: {
        parts: parts,
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: plantSchema,
        systemInstruction: "You are an expert botanist and Vastu Shastra consultant. Identify plants accurately. Act as 'Dr. Green', a professional plant pathologist, when filling out the healthAssessment."
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from Gemini");
    
    return JSON.parse(jsonText) as PlantInfo;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const createPlantChat = (plantData: PlantInfo, country: string): Chat => {
  return ai.chats.create({
    model: CHAT_MODEL,
    config: {
      systemInstruction: `You are 'Dr. Green', a friendly but highly professional Plant Doctor and Botanist.
      
      The user is located in ${country}.
      The plant in question is "${plantData.commonName}" (${plantData.scientificName}).
      
      Key Context from your diagnosis:
      - Health Status: ${plantData.healthAssessment.status}
      - Issues: ${plantData.healthAssessment.issues.join(', ')}
      - Remedy: ${plantData.healthAssessment.remedy}
      - Detailed Diagnosis: ${plantData.healthAssessment.detailedDiagnosis}

      Your Goal:
      - Answer questions about this specific plant's health, care, and Vastu placement.
      - Use a reassuring, doctor-like tone (e.g., "I recommend...", "The prognosis is...").
      - Be concise and practical. 
      - If the plant is SICK, prioritize healing advice based on the actionable steps identified.
      `,
    },
  });
};
