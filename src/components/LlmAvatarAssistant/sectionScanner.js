/**
 * sectionScanner.js
 *
 * Detecta las secciones de la página y desplaza la vista hasta ellas.
 *
 *   1. Las secciones se registran con una lista explícita de
 *      {id, title, aliases[]} o en modo "auto", leyendo cada
 *      <section id> / <footer id> / <h2 id> / <h3 id> del documento.
 *   2. Un texto "menciona" una sección cuando contiene su id, su título o un
 *      alias como palabra completa, sin importar mayúsculas ni tildes
 *      ("Hero" no coincide con "heroico").
 *   3. Si hay varias, gana la que aparece primero en el texto.
 */

import { normalize } from './utils.js';

/**
 * Arma la lista de secciones.
 *
 * @param {Document} [doc]
 * @param {Array} [explicit] lista opcional desde la config
 * @returns {Array<{id: string, title: string, aliases: string[], el: () => Element|null}>}
 */
export function collectSections(doc = globalThis.document, explicit) {
  if (Array.isArray(explicit) && explicit.length) {
    return explicit
      .filter((s) => s && (s.id || s.title))
      .map((s) => ({
        id: s.id || slugify(s.title),
        title: s.title || s.id,
        aliases: normalizeAliases(s.aliases),
        el: () => findSectionEl(doc, s.id, s.title),
      }));
  }

  const out = [];
  const seen = new Set();
  doc.querySelectorAll('section[id], footer[id], h2[id], h3[id]').forEach((node) => {
    const id = node.getAttribute('id');
    if (!id || seen.has(id)) return;
    seen.add(id);

    // El título visible es el propio encabezado o el primero dentro de la sección
    const heading = node.matches('h2, h3') ? node : node.querySelector('h1, h2, h3');
    const title = heading ? heading.textContent.trim() : id;
    if (!title) return;

    out.push({
      id,
      title,
      aliases: [slugToTitle(id)],
      el: () => findSectionEl(doc, id, title),
    });
  });
  return out;
}

/**
 * Todas las secciones mencionadas en `text`, en el orden en que aparecen.
 *
 * @param {string} text
 * @param {Array} sections salida de collectSections()
 * @returns {Array<{section, matched: string, index: number}>}
 */
export function findSectionReferences(text, sections) {
  if (!text || !Array.isArray(sections) || !sections.length) return [];
  const hay = normalize(text);

  const found = [];
  for (const s of sections) {
    let best = null;
    for (const cand of buildCandidates(s)) {
      const idx = indexOfWord(hay, cand);
      if (idx !== -1 && (!best || idx < best.index)) {
        best = { section: s, matched: cand, index: idx };
      }
    }
    if (best) found.push(best);
  }
  return found.sort((a, b) => a.index - b.index);
}

/**
 * Busca la sección mencionada primero en `text`.
 *
 * @returns {{section, matched: string, index: number} | null}
 */
export function findSectionReference(text, sections) {
  return findSectionReferences(text, sections)[0] || null;
}

/**
 * Desplaza la página hasta una sección. Devuelve true si la encontró.
 *
 * @param {string|Element} target id o elemento
 * @param {{behavior?: string, offset?: number, doc?: Document}} opts
 */
export function scrollToSection(target, { behavior = 'smooth', offset = 0, doc = globalThis.document } = {}) {
  const el = typeof target === 'string' ? doc.getElementById(target) : target;
  if (!el) return false;

  const win = doc.defaultView || globalThis.window;
  const top = Math.max(0, el.getBoundingClientRect().top + win.scrollY - offset);
  win.scrollTo({ top, behavior });
  return true;
}

/* --------------------------- internos --------------------------- */

function buildCandidates(s) {
  const set = new Set([s.id, s.title, ...(s.aliases || [])].filter(Boolean));
  // Se descartan candidatos de 2 letras o menos para evitar coincidencias casuales
  return [...set].map(normalize).filter((c) => c.length > 2);
}

// Posición de `needle` en `hay` solo si es una palabra completa
function indexOfWord(hay, needle) {
  const word = /[a-z0-9]/;
  let i = hay.indexOf(needle);
  while (i !== -1) {
    const before = hay[i - 1];
    const after = hay[i + needle.length];
    if (!(before && word.test(before)) && !(after && word.test(after))) return i;
    i = hay.indexOf(needle, i + 1);
  }
  return -1;
}

function findSectionEl(doc, id, title) {
  if (id && doc.getElementById(id)) return doc.getElementById(id);
  // Si no hay id, se busca por el texto del encabezado
  const normTitle = normalize(title);
  if (!normTitle) return null;
  for (const h of doc.querySelectorAll('h1, h2, h3')) {
    if (normalize(h.textContent) === normTitle) return h;
  }
  return null;
}

function slugify(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function slugToTitle(slug) {
  return String(slug || '').replace(/[-_]/g, ' ').trim();
}

function normalizeAliases(list) {
  return Array.isArray(list) ? list.filter(Boolean).map(String) : [];
}
