export function instagramHandle(url: string) {
  try {
    const path = new URL(url).pathname.replace(/\//g, "");
    return path ? `@${path}` : "Instagram";
  } catch {
    return "Instagram";
  }
}
