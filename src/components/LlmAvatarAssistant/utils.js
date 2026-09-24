/**
 * utils.js — helpers de texto compartidos por el asistente.
 */

/**
 * Normaliza texto para comparar: minúsculas, sin tildes y con espacios
 * simples. "Café  Grande" -> "cafe grande".
 */
export function normalize(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Limpia la respuesta del modelo antes de mostrarla: quita los bloques
 * <think> de los modelos de razonamiento y los encabezados
 * [SECCIÓN: ...] que los modelos chicos a veces copian de la base de
 * conocimiento.
 */
export function cleanAnswer(raw) {
  return String(raw || '')
    .replace(/<think>[\s\S]*?(<\/think>|$)/gi, '')
    .replace(/\[\s*secci[oó]n\s*:[^\]\n]*\]/gi, '')
    .trim();
}

/**
 * Limpia la sintaxis markdown más común (negritas, código, títulos, links)
 * para mostrar la respuesta como texto plano en la burbuja.
 */
export function displayMarkdown(md) {
  let s = String(md || '');
  s = s.replace(/```[\s\S]*?```/g, (m) => m.replace(/^```[a-z]*\n?|\n?```$/g, '').trim());
  s = s.replace(/`([^`]+)`/g, '$1');
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
  s = s.replace(/\*([^*\n]+)\*/g, '$1');
  s = s.replace(/^#{1,6}\s+/gm, '');
  // [texto](url) -> "texto (url)", para no perder el link
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => (label === url ? url : `${label} (${url})`));
  return s;
}
