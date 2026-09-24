/**
 * llmClient.js
 *
 * Cliente mínimo, sin dependencias, para cualquier endpoint de chat compatible
 * con la API de OpenAI (por ejemplo `llama-server` de llama.cpp).
 *
 * API:
 *   createLlmClient(config)                  -> LlmClient
 *   LlmClient.chat(messages)                 -> Promise<string>
 *   LlmClient.chatStream(messages, onToken)  -> Promise<string>
 *   LlmClient.ping()                         -> Promise<boolean>
 *
 * Los errores que lanza tienen `code` para que la interfaz pueda mostrar un
 * mensaje claro:
 *   'network' -> no hay servidor escuchando en la URL (llama-server apagado)
 *   'timeout' -> el servidor no respondió a tiempo
 *   'http'    -> el servidor respondió con error (`status` trae el código)
 */

const DEFAULT_TIMEOUT_MS = 120_000; // los modelos locales pueden tardar en el primer token
const PING_TIMEOUT_MS = 4_000;

/**
 * @param {object} config
 * @param {string} config.baseUrl  p. ej. "http://127.0.0.1:8080/v1" o "/v1"
 * @param {string} [config.apiKey]
 * @param {string} [config.model]
 * @param {number} [config.timeoutMs]
 * @param {object} [config.extra]  campos extra que se suman al body (temperature, etc.)
 */
export function createLlmClient({
  baseUrl,
  apiKey = '',
  model = 'default',
  timeoutMs = DEFAULT_TIMEOUT_MS,
  extra = {},
}) {
  if (!baseUrl) throw new Error('llmClient: baseUrl es obligatorio');

  // Sin barra final, así `${base}/chat/completions` siempre queda bien armado
  const base = baseUrl.replace(/\/+$/, '');

  function buildHeaders(json) {
    const headers = {};
    if (json) headers['Content-Type'] = 'application/json';
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
    return headers;
  }

  async function request(path, { method = 'GET', body, timeout = timeoutMs } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    let res;
    try {
      res = await fetch(`${base}${path}`, {
        method,
        headers: buildHeaders(body !== undefined),
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (err) {
      throw llmError(
        controller.signal.aborted ? 'timeout' : 'network',
        `llmClient: sin respuesta de ${base} (${err?.message || 'network'})`,
        { cause: err }
      );
    } finally {
      // El timeout cubre hasta recibir los headers; el streaming puede durar más
      clearTimeout(timer);
    }

    if (!res.ok) {
      let detail = '';
      try {
        detail = (await res.text()).slice(0, 400);
      } catch { /* sin detalle */ }
      throw llmError('http', `llmClient: HTTP ${res.status} ${res.statusText} ${detail}`.trim(), {
        status: res.status,
      });
    }

    return res;
  }

  function chatBody(messages, stream) {
    return {
      model,
      messages,
      stream,
      temperature: 0.7,
      ...extra,
    };
  }

  return {
    /** Chat sin streaming: devuelve el texto completo de la respuesta. */
    async chat(messages) {
      const res = await request('/chat/completions', {
        method: 'POST',
        body: chatBody(messages, false),
      });
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? '';
      if (typeof content !== 'string') {
        throw new Error('llmClient: la respuesta no tiene contenido');
      }
      return content;
    },

    /**
     * Chat con streaming (SSE). Llama a `onToken(token, textoAcumulado)` a
     * medida que llegan los tokens y resuelve con el texto completo. Si el
     * servidor ignora `stream: true` y devuelve JSON normal, lo lee igual.
     */
    async chatStream(messages, onToken) {
      const res = await request('/chat/completions', {
        method: 'POST',
        body: chatBody(messages, true),
      });
      const ct = res.headers.get('content-type') || '';

      if (!ct.includes('text/event-stream') || !res.body) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content ?? '';
        if (onToken && content) onToken(content, content);
        return content;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let full = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Los eventos SSE se separan con una línea en blanco
        const parts = buffer.split(/\r?\n\r?\n/);
        buffer = parts.pop(); // el último puede estar incompleto

        for (const frame of parts) {
          for (const rawLine of frame.split(/\r?\n/)) {
            const line = rawLine.trim();
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (payload === '[DONE]') return full;
            try {
              const obj = JSON.parse(payload);
              const delta = obj?.choices?.[0]?.delta?.content ?? obj?.choices?.[0]?.text ?? '';
              if (delta) {
                full += delta;
                if (onToken) onToken(delta, full);
              }
            } catch {
              // Líneas que no son JSON (keep-alive): se ignoran
            }
          }
        }
      }
      return full;
    },

    /**
     * Comprueba si hay un servidor escuchando. Cualquier respuesta HTTP
     * (incluso un error) cuenta como "en línea"; solo falla si no hay conexión.
     */
    async ping() {
      try {
        await request('/models', { timeout: PING_TIMEOUT_MS });
        return true;
      } catch (err) {
        return err.code === 'http';
      }
    },
  };
}

function llmError(code, message, { status, cause } = {}) {
  const e = new Error(message);
  e.code = code;
  if (status !== undefined) e.status = status;
  if (cause !== undefined) e.cause = cause;
  return e;
}

/**
 * Valida y normaliza la configuración antes de crear el cliente, para poder
 * mostrar un error legible si la URL está mal.
 *
 * @returns {{ok: boolean, value?: object, error?: string}}
 */
export function normalizeLlmConfig(raw) {
  const cfg = raw || {};
  const baseUrl = (cfg.baseUrl || '').trim();
  if (!baseUrl) {
    return { ok: false, error: 'Falta la URL del servidor del asistente (p. ej. http://127.0.0.1:8080/v1).' };
  }

  // Se acepta una ruta relativa ("/v1", resuelta por un proxy) o una URL http(s)
  const isRelative = baseUrl.startsWith('/');
  const isAbsolute = /^https?:\/\//i.test(baseUrl);
  if (!isRelative && !isAbsolute) {
    return { ok: false, error: 'La URL del asistente debe ser una ruta relativa (/v1) o una URL http(s).' };
  }

  let finalUrl = baseUrl;
  if (isAbsolute) {
    try {
      const url = new URL(baseUrl);
      finalUrl = url.origin + url.pathname.replace(/\/$/, '');
    } catch {
      return { ok: false, error: 'La URL del asistente no es válida.' };
    }
  }

  return {
    ok: true,
    value: {
      baseUrl: finalUrl,
      apiKey: String(cfg.apiKey || '').trim(),
      model: (cfg.model || 'default').trim(),
      temperature: Number.isFinite(cfg.temperature) ? cfg.temperature : 0.7,
    },
  };
}
