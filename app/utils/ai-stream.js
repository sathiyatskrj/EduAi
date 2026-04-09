/**
 * Client-side utility for consuming AI streams from the /api/ai endpoint.
 */
export async function consumeStream(response, onChunk, onComplete, onError) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    onError(errorData.error || "Generation failed");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      onChunk(fullText);
    }
    if (onComplete) onComplete(fullText);
  } catch (err) {
    if (onError) onError(err.message);
  }
}
