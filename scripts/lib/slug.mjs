/** ASCII slug that matches however a Turkish or German name is spelled or cased. */
export function slug(value) {
  return String(value)
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/Ł/gi, "l")
    .replace(/ł/gi, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
