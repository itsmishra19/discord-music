export function formatTime(ms) {
    const seconds = Math.floor(ms / 1000 % 60);
    const minutes = Math.floor(ms / 1000 / 60 % 60);
    return [minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");
}
