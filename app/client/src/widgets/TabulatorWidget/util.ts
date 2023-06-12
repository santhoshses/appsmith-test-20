export function ReturnFontSize(key: string) {
  let size;
  key === "HEADING1"
    ? (size = "24px")
    : key === "HEADING2"
    ? (size = "18px")
    : key === "HEADING3"
    ? (size = "16px")
    : key === "PARAGRAPH"
    ? (size = "14px")
    : key === "PARAGRAPH2"
    ? (size = "12px")
    : (size = "16px");
  return size;
}
