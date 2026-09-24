/**
 * LlmAvatarAssistant.jsx
 *
 * Asistente flotante:
 * 1. Estado de la conexión + burbuja de respuesta
 * 2. Avatar 2D (GIF), que también abre y minimiza el asistente
 * 3. Campo para hacer preguntas
 */

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { createLlmClient, normalizeLlmConfig } from './llmClient.js';
import { collectSections, findSectionReference, scrollToSection } from './sectionScanner.js';
import { buildSystemPrompt, DEFAULT_SYSTEM_PROMPT } from './systemPrompt.js';
import { cleanAnswer, displayMarkdown } from './utils.js';

const DEFAULT_CONFIG = {
  // Se puede cambiar con VITE_LLM_URL en un archivo .env.local
  baseUrl: import.meta.env.VITE_LLM_URL || 'http://127.0.0.1:8080/v1',
  apiKey: '',
  model: 'default',
  temperature: 0.7,
  timeoutMs: 120_000,

  defaultText: '¡Hola! ¿En qué puedo ayudarte?',
  offlineText:
    'El asistente IA no está disponible en este momento. Probá de nuevo en unos minutos.',

  modelUrl: 'models/soporte.gif',
  side: 'right',
  maxBubbleHeight: 240,

  sectionDiscovery: 'auto',
  // Altura del navbar fijo, para que la sección no quede tapada al desplazarse
  scrollOffset: 80,

  systemPrompt: DEFAULT_SYSTEM_PROMPT,

  // Máximo de caracteres de cada sección que se mandan como contexto
  knowledgeMaxChars: 3000,

  // Mensajes anteriores (pregunta + respuesta) que se reenvían al modelo
  historyMessages: 6,

  streaming: true,
};

const STATUS_LABELS = {
  checking: 'Conectando…',
  online: 'En línea',
  offline: 'Sin conexión',
};

export default function LlmAvatarAssistant({ config = {} }) {
  const cfg = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);

  const llm = useMemo(() => {
    const res = normalizeLlmConfig(cfg);
    if (!res.ok) return { client: null, error: res.error };

    return {
      client: createLlmClient({
        baseUrl: res.value.baseUrl,
        apiKey: res.value.apiKey,
        model: res.value.model,
        timeoutMs: cfg.timeoutMs,
        extra: { temperature: res.value.temperature },
      }),
      baseUrl: res.value.baseUrl,
      error: '',
    };
  }, [cfg]);

  // En pantallas chicas arranca minimizado para no tapar el contenido
  const [open, setOpen] = useState(
    () => typeof window === 'undefined' || window.matchMedia('(min-width: 768px)').matches
  );
  const [status, setStatus] = useState('checking');
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [matchedSection, setMatchedSection] = useState(null);

  const bubbleRef = useRef(null);
  const sectionsRef = useRef([]);
  const historyRef = useRef([]);
  const stickToBottom = useRef(true);

  const { client } = llm;

  // Comprobar al cargar si el servidor del modelo está en ejecución
  useEffect(() => {
    if (!client) return undefined;
    let active = true;
    client.ping().then((ok) => {
      if (active) setStatus(ok ? 'online' : 'offline');
    });
    return () => {
      active = false;
    };
  }, [client]);

  // Detectar las secciones de la página
  useEffect(() => {
    sectionsRef.current = collectSections(
      document,
      cfg.sectionDiscovery === 'auto' ? null : cfg.sectionDiscovery
    );
  }, [cfg.sectionDiscovery]);

  // Mantener la burbuja abajo mientras llega el texto
  useEffect(() => {
    const el = bubbleRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [question, answer, busy]);

  const handleBubbleScroll = useCallback(() => {
    const el = bubbleRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  }, []);

  const goToSection = useCallback(
    (section) => {
      setMatchedSection(section);
      scrollToSection(section.id, { behavior: 'smooth', offset: cfg.scrollOffset });
    },
    [cfg.scrollOffset]
  );

  const retryConnection = () => {
    if (!client) return;
    setStatus('checking');
    setQuestion('');
    setAnswer('');
    client.ping().then((ok) => setStatus(ok ? 'online' : 'offline'));
  };

  const ask = async (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy || !client) return;

    setInput('');
    setQuestion(q);
    setAnswer('');
    setMatchedSection(null);
    setBusy(true);
    stickToBottom.current = true;

    // Se arma en cada pregunta para leer el contenido actual de la página
    const messages = [
      {
        role: 'system',
        content: buildSystemPrompt({
          rules: cfg.systemPrompt,
          sections: sectionsRef.current,
          maxChars: cfg.knowledgeMaxChars,
        }),
      },
      ...historyRef.current,
      { role: 'user', content: q },
    ];

    try {
      const full = cfg.streaming
        ? await client.chatStream(messages, (_token, current) => {
            setAnswer(cleanAnswer(current));
          })
        : await client.chat(messages);

      const text = cleanAnswer(full);
      setStatus('online');
      setAnswer(text || 'No obtuve respuesta del modelo. Probá reformular la pregunta.');

      if (text) {
        historyRef.current = [
          ...historyRef.current,
          { role: 'user', content: q },
          { role: 'assistant', content: text },
        ].slice(-cfg.historyMessages);
      }

      // Primero la sección que el usuario nombró en su pregunta (es lo más
      // confiable); si no nombró ninguna, la que nombra la respuesta
      const ref =
        findSectionReference(q, sectionsRef.current) ||
        findSectionReference(text, sectionsRef.current);
      if (ref) goToSection(ref.section);
    } catch (err) {
      if (err?.code === 'network') setStatus('offline');
      setAnswer(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const connection = client ? status : 'offline';
  const showOffline = connection === 'offline' && !busy;

  const errorText = llm.error
    ? llm.error
    : connection === 'offline'
      ? `No se pudo conectar con ${llm.baseUrl}. Verificá que llama-server esté en ejecución.`
      : '';

  const sideClass = cfg.side === 'left' ? 'lav-side--left' : 'lav-side--right';

  return (
    <div className={`lav-container ${sideClass} ${open ? 'is-open' : ''}`}>
      {open && (
        <div className="lav-panel">
          <div className="lav-header">
            <span className={`lav-status lav-status--${busy ? 'checking' : connection}`}>
              {busy ? 'Escribiendo…' : STATUS_LABELS[connection]}
            </span>
            <button
              type="button"
              className="lav-close"
              onClick={() => setOpen(false)}
              aria-label="Minimizar asistente"
              title="Minimizar"
            >
              ×
            </button>
          </div>

          {/* 1. Burbuja de respuesta */}
          <div
            ref={bubbleRef}
            className="lav-bubble"
            style={{ maxHeight: `min(${cfg.maxBubbleHeight}px, 35vh)` }}
            onScroll={handleBubbleScroll}
            aria-live="polite"
            aria-busy={busy}
          >
            {question && <p className="lav-question">{question}</p>}

            {showOffline && !answer ? (
              <p>{cfg.offlineText}</p>
            ) : (
              <p>
                {busy && !answer
                  ? '…'
                  : linkify(displayMarkdown(answer)) || cfg.defaultText}
              </p>
            )}

            {showOffline && (
              <button type="button" className="lav-link" onClick={retryConnection}>
                Reintentar conexión
              </button>
            )}

            {matchedSection && !busy && (
              <button
                type="button"
                className="lav-link"
                onClick={() => goToSection(matchedSection)}
              >
                Ir a {matchedSection.title} →
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Avatar: abre y minimiza el asistente */}
      <button
        type="button"
        className="lav-avatar"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Minimizar asistente' : 'Abrir asistente IA'}
        title={open ? 'Minimizar asistente' : 'Preguntale al asistente IA'}
      >
        <img
          src={cfg.modelUrl}
          alt=""
          className={`lav-avatar-image ${busy ? 'is-busy' : ''}`}
          style={{ transform: cfg.side === 'left' ? 'scaleX(-1)' : undefined }}
        />
      </button>

      {/* 3. Campo de pregunta */}
      {open && (
        <form className="lav-input-container" onSubmit={ask}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Haceme una pregunta…"
            aria-label="Pregunta para el asistente"
            maxLength={500}
            className="lav-input"
          />
          <button
            type="submit"
            disabled={busy || !input.trim() || !client}
            className="lav-button"
          >
            {busy ? '…' : 'Enviar'}
          </button>
        </form>
      )}

      {open && errorText && <p className="lav-error">{errorText}</p>}
    </div>
  );
}

/** Mensaje para el usuario según el tipo de error del cliente. */
function errorMessage(err) {
  switch (err?.code) {
    case 'network':
      return 'No me pude conectar con el modelo de IA. Parece que el servidor local (llama-server) no está en ejecución.';
    case 'timeout':
      return 'El modelo tardó demasiado en responder. Probá de nuevo con una pregunta más corta.';
    case 'http':
      return err.status === 503
        ? 'El modelo todavía se está cargando. Esperá unos segundos y volvé a preguntar.'
        : `El servidor del modelo respondió con un error (HTTP ${err.status}). Probá de nuevo en unos segundos.`;
    default:
      return 'Ocurrió un error inesperado al consultar al asistente. Probá de nuevo.';
  }
}

const LINK_RE = /https?:\/\/[^\s<>()]*[^\s<>().,;:!?"']|[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;

/** Convierte las URLs y los emails de la respuesta en links clickeables. */
function linkify(text) {
  if (!text) return '';
  const parts = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const isUrl = m[0].startsWith('http');
    parts.push(
      <a
        key={m.index}
        href={isUrl ? m[0] : `mailto:${m[0]}`}
        target={isUrl ? '_blank' : undefined}
        rel={isUrl ? 'noopener noreferrer' : undefined}
        className="lav-link"
      >
        {m[0]}
      </a>
    );
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return parts;
}
