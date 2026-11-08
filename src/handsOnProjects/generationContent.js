// Hands-On Projects — Generation.
// Python code reproduced verbatim from the source tutorials; only site branding removed.

export const TAB_OVERVIEW = {
  title: "Generation",
  subtitle: "Turning an input into a new artifact: notes from a transcript, images from a prompt.",
  audience: "Developers adding an output stage — summarisation or diffusion — to a local stack.",
  outcomes: [
    "Pull a transcript and chunk it to fit a context window.",
    "Turn raw video into structured, skimmable notes.",
    "Run Stable Diffusion locally with the right device fallback.",
    "Control sample quality through steps, guidance and seed.",
  ],
};

export const PROJECTS = [
  {
    id: "p8",
    n: 8,
    title: "Build an AI System to Summarize YouTube Videos into Notes",
    blurb:
      "Download transcripts, chunk them, and generate structured study notes with an LLM.",
    stack: ["youtube-transcript-api", "Ollama", "Chunked summarisation"],
    steps: [
      {
        title: "Extract YouTube Transcripts",
        note:
          "Parsing `v=` out of the URL fails on short links and embeds — normalise first if you accept arbitrary input. Transcripts are auto-generated, so punctuation and names are already wrong before the model sees them.",
        code: String.raw`from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_url: str) -> str:
    video_id = video_url.split("v=")[-1].split("&")[0]
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    full_text = " ".join([entry["text"] for entry in transcript])
    return full_text

url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
transcript = get_transcript(url)
print(f"Transcript length: {len(transcript)} chars")
print(f"Preview: {transcript[:200]}...")`,
      },
      {
        title: "Generate Structured Notes",
        note:
          "Fixed 3,000-character windows ignore sentence boundaries, so a point can be cut in half. Summarising each chunk separately then joining gives coverage but repeats the same topic once per chunk — a merge pass fixes that.",
        code: String.raw`import ollama

def summarize_to_notes(transcript: str):
    # Chunk long transcripts
    max_len = 3000
    chunks = [transcript[i:i+max_len] for i in range(0, len(transcript), max_len)]

    all_notes = []
    for i, chunk in enumerate(chunks):
        response = ollama.chat(model="llama3", messages=[{
            "role": "user",
            "content": f"""Convert this video transcript into structured study notes.
Use this format:
## Key Topics
- Topic 1: explanation
## Important Points
- Point with detail
## Action Items
- What to do next

Transcript (part {i+1}): {chunk}"""
        }])
        all_notes.append(response["message"]["content"])

    return "\n\n---\n\n".join(all_notes)

notes = summarize_to_notes(transcript)
print(notes)`,
      },
    ],
  },
  {
    id: "p19",
    n: 19,
    title: "AI Image Generation using Diffusion Models",
    blurb:
      "Generate images from text prompts using Stable Diffusion running locally on your machine.",
    stack: ["diffusers", "Stable Diffusion 1.5", "PyTorch"],
    steps: [
      {
        title: "Load Stable Diffusion Pipeline",
        note:
          "Device fallback order matters: CUDA, then Apple MPS, then CPU. Half precision only on GPU — fp16 on CPU is unsupported or catastrophically slow. SD 1.5 needs roughly 4 GB of VRAM at this size.",
        code: String.raw`from diffusers import StableDiffusionPipeline
import torch

model_id = "runwayml/stable-diffusion-v1-5"

pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    safety_checker=None
)

if torch.cuda.is_available():
    pipe = pipe.to("cuda")
    print("🎮 Using GPU acceleration")
elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
    pipe = pipe.to("mps")
    print("🍎 Using Apple Silicon acceleration")
else:
    print("💻 Using CPU (slower)")

print("✅ Stable Diffusion pipeline loaded")`,
      },
      {
        title: "Generate & Customize Images",
        note:
          "Steps trade time for detail; guidance trades prompt adherence for naturalness. A fixed seed makes a run reproducible, which is the only way to compare two prompts fairly.",
        code: String.raw`def generate_image(prompt, negative_prompt="", steps=30, guidance=7.5, seed=None):
    generator = torch.Generator().manual_seed(seed) if seed else None

    image = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt or "blurry, low quality, distorted",
        num_inference_steps=steps,
        guidance_scale=guidance,
        generator=generator
    ).images[0]

    filename = f"generated_{prompt[:30].replace(' ', '_')}.png"
    image.save(filename)
    print(f"🖼️ Saved: {filename}")
    return image

# Generate images
generate_image("A futuristic city with flying cars at sunset, digital art", seed=42)
generate_image(
    "A cozy cabin in snowy mountains, warm lighting, photorealistic",
    negative_prompt="cartoon, anime, drawing",
    steps=50, guidance=8.0
)`,
      },
    ],
  },
];
