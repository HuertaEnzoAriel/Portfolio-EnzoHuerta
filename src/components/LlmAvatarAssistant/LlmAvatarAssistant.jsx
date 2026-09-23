/**
 * LlmAvatarAssistant.jsx
 *
 * Asistente flotante:
 * 1. Burbuja de respuesta
 * 2. Avatar 2D (GIF)
 * 3. Campo para hacer preguntas
 */

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import {
  createLlmClient,
  normalizeLlmConfig,
} from './llmClient.js';

import {
  collectSections,
  findSectionReference,
  scrollToSection,
} from './sectionScanner.js';

import {
  buildSystemPrompt,
  DEFAULT_SYSTEM_PROMPT,
} from './systemPrompt.js';

import { displayMarkdown } from './utils.js';

const DEFAULT_CONFIG = {
  baseUrl: 'http://127.0.0.1:8080/v1',
  apiKey: '',
  model: 'default',
  temperature: 0.7,

  defaultText:
    '¡Hola! ¿En qué puedo ayudarte?',

  modelUrl: 'models/clippy.gif',

  side: 'right',
  corner: null,

  maxBubbleHeight: 240,

  sectionDiscovery: 'auto',

  systemPrompt: DEFAULT_SYSTEM_PROMPT,

  // Máximo de caracteres de cada sección que se mandan como contexto
  knowledgeMaxChars: 1200,

  streaming: true,
};

export { DEFAULT_CONFIG };

export default function LlmAvatarAssistant({
  config = {},
  onScrollToSection,
  onSend,
}) {
  const cfg = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );

  const [input, setInput] = useState('');
  const [response, setResponse] = useState(cfg.defaultText);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [matchedSection, setMatchedSection] = useState(null);

  const bubbleRef = useRef(null);
  const inputRef = useRef(null);
  const clientRef = useRef(null);
  const sectionsRef = useRef([]);

  const stickToBottom = useRef(true);

  // Crear cliente LLM
  useEffect(() => {
    const res = normalizeLlmConfig(cfg);

    if (!res.ok) {
      setError(res.error);
      clientRef.current = null;
      return;
    }

    clientRef.current = createLlmClient({
      baseUrl: res.value.baseUrl,
      apiKey: res.value.apiKey,
      model: res.value.model,
      timeoutMs: cfg.timeoutMs,
      extra: {
        temperature: res.value.temperature,
      },
    });

    setError('');
  }, [cfg]);

  // Detectar las secciones de la página
  useEffect(() => {
    const list = collectSections(
      document,
      cfg.sectionDiscovery === 'auto'
        ? null
        : cfg.sectionDiscovery
    );

    sectionsRef.current = list;
  }, [cfg.sectionDiscovery]);

  // Mantener la burbuja abajo mientras llega el texto
  useEffect(() => {
    const el = bubbleRef.current;

    if (!el) return;

    if (stickToBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [response, busy]);

  const handleBubbleScroll = useCallback(() => {
    const el = bubbleRef.current;

    if (!el) return;

    const atBottom =
      el.scrollHeight -
        el.scrollTop -
        el.clientHeight <
      24;

    stickToBottom.current = atBottom;
  }, []);

  // Ir hasta una sección
  const performScroll = useCallback(
    (section) => {
      setMatchedSection(section);

      const ok = scrollToSection(section.id, {
        behavior: 'smooth',
        offset: 64,
      });

      if (onScrollToSection && ok) {
        onScrollToSection(section);
      }
    },
    [onScrollToSection]
  );

  // Enviar pregunta
  const ask = useCallback(
    async (text) => {
      const q = (text ?? input).trim();

      if (!q || busy) return;

      const client = clientRef.current;

      if (!client) {
        setError(
          'The assistant is not configured. Set a valid base URL.'
        );
        return;
      }

      setError('');
      setBusy(true);
      setMatchedSection(null);
      setResponse('');

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
        {
          role: 'user',
          content: q,
        },
      ];

      let full = '';

      try {
        if (cfg.streaming) {
          full = await client.chatStream(
            messages,
            (token, current) => {
              setResponse(current);
            }
          );
        } else {
          full = await client.chat(messages);
          setResponse(full);
        }

        if (!full) {
          setResponse('(empty response)');
        }

        const ref = findSectionReference(
          full,
          sectionsRef.current
        );

        if (ref) {
          performScroll(ref.section);
        }

        if (onSend) {
          onSend(q, full);
        }
      } catch (err) {
        setResponse((prev) => prev || '');

        setError(
          err?.message ||
            'The model request failed.'
        );
      } finally {
        setBusy(false);
      }
    },
    [
      input,
      busy,
      cfg,
      performScroll,
      onSend,
    ]
  );

  const submit = (e) => {
    e.preventDefault();
    ask();
  };

  const sideClass = cfg.corner
    ? `lav-side--${cfg.corner}`
    : `lav-side--${
        cfg.side === 'left'
          ? 'left'
          : 'right'
      }`;

  return (
    <div className={`lav-container ${sideClass}`}>

      {/* 1. Burbuja de respuesta */}
      <div
        ref={bubbleRef}
        className="lav-bubble"
        style={{
          maxHeight: `${cfg.maxBubbleHeight}px`,
        }}
        onScroll={handleBubbleScroll}
      >
        {renderResponse(
          response,
          busy,
          matchedSection,
          performScroll
        )}
      </div>

      {/* 2. Avatar GIF */}
      <div className="lav-avatar">
        <img
          src={cfg.modelUrl}
          alt="Assistant avatar"
          className="lav-avatar-image"
          style={{
            transform:
              cfg.side === 'left'
                ? 'scaleX(-1)'
                : 'scaleX(1)',

            filter: busy
              ? 'brightness(1.15)'
              : 'none',
          }}
        />
      </div>

      {/* 3. Campo de pregunta */}
      <form
        className="lav-input-container"
        onSubmit={submit}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder="Hazme una pregunta..."
          disabled={busy}
          aria-label="Ask the assistant"
          className="lav-input"
        />

        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="lav-button"
        >
          {busy ? '…' : "Enviar"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="lav-error">
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Renderiza la respuesta y permite hacer clic
 * sobre el nombre de una sección encontrada.
 */
function renderResponse(
  text,
  busy,
  matchedSection,
  performScroll
) {
  const body =
    busy && !text
      ? '…'
      : displayMarkdown(text) || '…';

  if (!matchedSection) {
    return <>{body}</>;
  }

  const title = matchedSection.title || '';

  const lower = body.toLowerCase();
  const titleLower = title.toLowerCase();

  const position = titleLower
    ? lower.indexOf(titleLower)
    : -1;

  if (position === -1) {
    return <>{body}</>;
  }

  return (
    <>
      {body.slice(0, position)}

      <button
        type="button"
        className="lav-section-link"
        onClick={() =>
          performScroll(matchedSection)
        }
        title={`Go to ${title}`}
      >
        {body.slice(
          position,
          position + title.length
        )}
      </button>

      {body.slice(position + title.length)}
    </>
  );
}