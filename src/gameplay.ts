const playing = new Set<string>();
export function isPlaying(id: string) {
  return playing.has(id);
}

export function startPlaying(id: string) {
  playing.add(id);
}

export function stopPlaying(id: string) {
  playing.delete(id);
}