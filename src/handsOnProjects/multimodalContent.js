// Hands-On Projects — Multimodal.
// Python code reproduced verbatim from the source tutorials; only site branding removed.

export const TAB_OVERVIEW = {
  title: "Multimodal",
  subtitle: "Two loops where the model stops reading text and starts hearing and seeing.",
  audience: "Developers comfortable with a text pipeline who need audio or image input.",
  outcomes: [
    "Wire speech-to-text, a local LLM and text-to-speech into one loop.",
    "Send images to a vision model and get grounded answers.",
    "Batch image analysis with reusable prompt templates.",
  ],
};

export const PROJECTS = [
  {
    id: "p13",
    n: 13,
    title: "Build a Real-Time Voice AI Assistant",
    blurb: "Capture speech, think with Llama 3, and speak responses — a full voice loop.",
    stack: ["SpeechRecognition", "Ollama", "pyttsx3"],
    steps: [
      {
        title: "The Ears — Speech to Text",
        note:
          "Ambient-noise calibration and a 5-second timeout are what stop the loop hanging on silence. `recognize_google` sends audio to a remote API — the only non-local hop in an otherwise local stack.",
        code: String.raw`import speech_recognition as sr

def listen():
    recognizer = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            print("Listening... (Speak now)")
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
            print("Processing...")
            text = recognizer.recognize_google(audio)
            print(f"You said: {text}")
            return text
    except sr.WaitTimeoutError:
        print("No speech detected.")
        return None
    except sr.UnknownValueError:
        print("Sorry, I didn't catch that.")
        return None`,
      },
      {
        title: "The Brain — LLM Thinking",
        note:
          "Returning a spoken-style fallback on error keeps the loop alive — a voice assistant that goes silent on failure feels broken. The except is broad on purpose here.",
        code: String.raw`import ollama

def think(text: str):
    if not text:
        return None
    print("Thinking...")
    try:
        response = ollama.chat(
            model="llama3",
            messages=[{"role": "user", "content": text}]
        )
        response_text = response["message"]["content"]
        print(f"AI: {response_text}")
        return response_text
    except Exception as e:
        print(f"Error in think(): {e}")
        return "Sorry, something went wrong."`,
      },
      {
        title: "The Mouth — Text to Speech",
        note:
          "A new engine per call is wasteful but safe; reusing one across threads is not. Rate 175 wpm is near conversational — much higher and it is unintelligible on small speakers.",
        code: String.raw`import pyttsx3

def speak(text: str):
    if not text:
        return
    try:
        engine = pyttsx3.init()
        voices = engine.getProperty("voices")
        if voices:
            engine.setProperty("voice", voices[0].id)
        engine.setProperty("rate", 175)
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"Error in speak(): {e}")`,
      },
      {
        title: "The Loop — Listen → Think → Speak",
        note:
          "Full-duplex is not handled: the microphone is not listening while the assistant speaks, so it cannot be interrupted. That is the main thing separating this from a real-time assistant.",
        code: String.raw`def main():
    print("--- Voice Assistant Started ---")
    speak("Hello, I am ready. You can start speaking.")
    while True:
        user_input = listen()
        if not user_input:
            continue
        if user_input.lower().strip() in ["exit", "stop", "quit"]:
            speak("Goodbye!")
            break
        ai_response = think(user_input)
        speak(ai_response)

if __name__ == "__main__":
    main()`,
      },
    ],
  },
  {
    id: "p16",
    n: 16,
    title: "Build a Visual Question Answering App",
    blurb:
      "Ask questions about images using multimodal LLMs — combine vision and language understanding.",
    stack: ["Ollama", "LLaVA", "Base64 images"],
    steps: [
      {
        title: "Image Loading & LLM Vision",
        note:
          "`ask_about_image` passes the file path in `images`, so no base64 is actually needed here — the encoding helper is only useful if you send bytes or a remote API. LLaVA is a small model: counts and colours are reliable, reading fine print is not.",
        code: String.raw`import ollama
import base64

def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def ask_about_image(image_path: str, question: str):
    print(f"🖼️ Analyzing image: {image_path}")
    print(f"❓ Question: {question}")

    response = ollama.chat(model="llava", messages=[{
        "role": "user",
        "content": question,
        "images": [image_path]
    }])

    answer = response["message"]["content"]
    print(f"💡 Answer: {answer}")
    return answer

# Ask questions about an image
ask_about_image("./photo.jpg", "What objects are in this image?")
ask_about_image("./chart.png", "What trend does this chart show?")`,
      },
      {
        title: "Batch Image Analysis",
        note:
          "The template map is the whole design: one prompt per analysis type, picked by name. Every image is a separate model call, so a 200-image folder is 200 inferences — decide the batch size before you point it at a directory.",
        code: String.raw`import os

ANALYSIS_TEMPLATES = {
    "describe": "Describe this image in detail.",
    "objects": "List all objects visible in this image.",
    "text": "Extract any text visible in this image.",
    "sentiment": "What mood or emotion does this image convey?",
    "technical": "Analyze the technical aspects (composition, lighting, color palette)."
}

def batch_analyze(folder: str, analysis_type: str = "describe"):
    prompt = ANALYSIS_TEMPLATES.get(analysis_type, analysis_type)
    results = []

    for f in sorted(os.listdir(folder)):
        if f.lower().endswith((".jpg", ".png", ".webp")):
            path = os.path.join(folder, f)
            answer = ask_about_image(path, prompt)
            results.append({"file": f, "analysis": answer})

    # Summary report
    print(f"\n📊 Analyzed {len(results)} images")
    for r in results:
        print(f"  {r['file']}: {r['analysis'][:100]}...")
    return results

batch_analyze("./images", "objects")`,
      },
    ],
  },
];
