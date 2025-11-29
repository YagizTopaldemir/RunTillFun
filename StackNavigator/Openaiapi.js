import AsyncStorage from "@react-native-async-storage/async-storage";
import OpenAI from "openai";
import Constants from "expo-constants";


const client = new OpenAI({
 apiKey: Constants.expoConfig.extra.OPENAI_KEY,
});

export const getRunAdvice = async ({ messageuser }) => {
  try {
    const yourresult = await AsyncStorage.getItem("lasttext");
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Sen bir koşu koçu asistanısın. Kullanıcı sana tek bir mesaj gönderir ve ikinci kez mesaj atma şansı yoktur. Bu yüzden kullanıcıya asla soru sorma, “Tam olarak nasıl?”, “Ne istiyorsun?” gibi ek açıklama isteme. Sadece kullanıcının verdiği metni dikkatlice analiz et, ne istediğini anla ve ona göre net, kısa, direkt bir yanıt üret.

Kullanıcı koşu programı, hızlanma planı, kilo verme koşu planı, yarış hazırlığı, motivasyon, öneri veya teknik tavsiye isteyebilir. Kullanıcı ne isterse direkt olarak yerine getir.

Eğer kullanıcı açıkça program istiyorsa:  
- “Tabii ki istediğin programı hazırlıyorum.” diye başla.  
- Gereksiz uzun yazma, kısa ve uygulanabilir bir plan sun.  

Asla soru sorma.  
Asla tekrar doğrulama isteme.  
Sadece verilen mesajı en iyi şekilde anla ve ona göre yardımcı ol.
kullanıcının mesajı: ${messageuser}.
senin son mesajın eğer kullanıcıdan önce bir mesajın varsa ona göre hareket et: ${yourresult ? yourresult : "bir mesaj yok"};
`,
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.log("AI error:", error);
    return "Tavsiye alınamadı.";
  }
};
