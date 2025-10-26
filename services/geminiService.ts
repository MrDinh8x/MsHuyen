import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// FIX: Initialize GoogleGenAI with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// For Study Buddy, the current implementation in StudyBuddy.tsx doesn't manage history,
// it just sends the last message. To keep it simple, we'll use generateContent for each turn.
export const getStudyBuddyResponse = async (prompt: string): Promise<string> => {
    try {
        // FIX: Use ai.models.generateContent instead of deprecated methods.
        const response: GenerateContentResponse = await ai.models.generateContent({
            // FIX: Use a recommended model name. 'gemini-2.5-flash' is suitable for chat.
            model: 'gemini-2.5-flash',
            // FIX: The 'contents' property should be used for the prompt.
            contents: `Bạn là một trợ lý học tập AI thân thiện tên là "AI Learning Mate". Hãy trả lời câu hỏi của học sinh một cách ngắn gọn, dễ hiểu và khuyến khích. Câu hỏi: "${prompt}"`,
            config: {
                // FIX: Add system instruction for better persona management.
                systemInstruction: "Bạn là một trợ lý học tập AI thân thiện, luôn hỗ trợ và khuyến khích học sinh. Tên bạn là AI Learning Mate.",
            }
        });

        // FIX: Access the generated text directly from the 'text' property.
        return response.text;
    } catch (error) {
        console.error("Error getting response from Gemini:", error);
        return "Ôi, có lỗi xảy ra rồi. Bạn thử lại sau nhé!";
    }
};

// For grading open questions
export const gradeOpenQuestion = async (question: string, correctAnswer: string, userAnswer: string): Promise<{ score: number, feedback: string }> => {
    const prompt = `
        Chấm điểm câu trả lời của học sinh cho câu hỏi sau.
        Chỉ trả về một đối tượng JSON có dạng { "score": number, "feedback": "string" }.
        - "score" là điểm từ 0 đến 10.
        - "feedback" là nhận xét ngắn gọn, giải thích tại sao đúng hoặc sai và cung cấp đáp án đúng nếu cần.
        
        Câu hỏi: "${question}"
        Đáp án tham khảo: "${correctAnswer}"
        Câu trả lời của học sinh: "${userAnswer}"
    `;

    try {
        // FIX: Use ai.models.generateContent for this task as well.
        const response: GenerateContentResponse = await ai.models.generateContent({
            // FIX: Use a recommended model name. 'gemini-2.5-flash' is good for this kind of structured output task.
            model: 'gemini-2.5-flash',
            contents: prompt,
            // FIX: Configure the model to return JSON.
            config: {
                responseMimeType: "application/json",
                // FIX: Define the expected JSON schema.
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        feedback: { type: Type.STRING }
                    },
                    required: ["score", "feedback"]
                },
            },
        });

        // FIX: Access the text and parse it as JSON.
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return {
            score: result.score,
            feedback: result.feedback
        };
    } catch (error) {
        console.error("Error grading with Gemini:", error);
        return { score: 0, feedback: "Không thể chấm điểm tự động. Vui lòng thử lại." };
    }
};
