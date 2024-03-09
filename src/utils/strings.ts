export function removeHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}
