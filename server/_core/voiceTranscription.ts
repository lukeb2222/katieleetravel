// Voice transcription is not used in this project
export async function transcribeAudio(_params: { audioUrl: string; language?: string; prompt?: string }) {
  throw new Error("Voice transcription is not available");
}
