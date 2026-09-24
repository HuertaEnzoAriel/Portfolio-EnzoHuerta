import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Íconos como SVG inline, sin depender de librerías externas
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM20.44 21h-3.37v-6.4c0-1.53-.03-3.5-2.13-3.5-2.14 0-2.47 1.67-2.47 3.39V21H9.1V8.5h3.24v1.71h.05c.45-.85 1.55-1.75 3.19-1.75 3.41 0 4.86 2.24 4.86 5.14V21Z" />
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
  </svg>
);
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/HuertaEnzoAriel",
    Icon: GithubIcon,
    colorClass: "text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-300",
  },
  {
    label: "LinkedIn",
    href: "#",
    Icon: LinkedinIcon,
    colorClass: "text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/enzo_7510/",
    Icon: InstagramIcon,
    colorClass: "text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400",
  },
  {
    label: "X",
    href: "#",
    Icon: XIcon,
    colorClass: "text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/enzo.huerta.2025/",
    Icon: FacebookIcon,
    colorClass: "text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500",
  },
];

// Las redes con href "#" todavía no tienen perfil: no se muestran hasta cargar el link
const activeSocials = socials.filter(({ href }) => href && href !== "#");

const CONTACT_EMAIL = "enzo.a.h75@gmail.com";
const CONTACT_PHONE_DISPLAY = "+54 9 264 446-6742";
const WHATSAPP_LINK = "https://wa.me/5492644466742";

const inputStyles =
  "w-full rounded-md border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow";

function ContactModal({ open, onClose }) {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contacto desde el portfolio — ${form.nombre}`);
    const body = encodeURIComponent(`${form.mensaje}\n\n— ${form.nombre} (${form.email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setForm({ nombre: "", email: "", mensaje: "" });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="relative w-full max-w-md rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-slate-950 shadow-xl p-6 md:p-8 animate-modal-in"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
        >
          <CloseIcon />
        </button>

        <h3 id="contact-modal-title" className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          Enviame un mensaje
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Te respondo a la brevedad a tu correo.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="contact-nombre" className="sr-only">Nombre</label>
          <input
            id="contact-nombre"
            type="text"
            name="nombre"
            required
            autoFocus
            autoComplete="name"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={handleChange}
            className={inputStyles}
          />
          <label htmlFor="contact-email" className="sr-only">Email</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Tu email"
            value={form.email}
            onChange={handleChange}
            className={inputStyles}
          />
          <label htmlFor="contact-mensaje" className="sr-only">Mensaje</label>
          <textarea
            id="contact-mensaje"
            name="mensaje"
            required
            rows={4}
            placeholder="Contame sobre tu proyecto..."
            value={form.mensaje}
            onChange={handleChange}
            className={`${inputStyles} resize-none`}
          />
          <button
            type="submit"
            className="mt-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2.5 rounded-md transition-colors"
          >
            <SendIcon /> Enviar mensaje
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <footer
      id="contacto"
      className="relative bg-white/90 dark:bg-slate-950/70 backdrop-blur-md text-slate-600 dark:text-slate-200 pt-16 pb-10 transition-colors duration-500"
      style={{ clipPath: "polygon(0 8%, 60% 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-3 md:flex-row md:items-center md:justify-between md:text-left md:gap-8">
          <div className="flex flex-col items-center text-center gap-1 md:items-start md:text-left">
            <p className="text-slate-500 dark:text-slate-400">¿Tenés un proyecto en mente?</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Hablemos
            </h2>
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-2 text-sm md:mt-0 md:flex-nowrap">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
              >
                <MailIcon /> {CONTACT_EMAIL}
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                title="Escribir por WhatsApp"
                className="flex items-center gap-2 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
              >
                <PhoneIcon /> {CONTACT_PHONE_DISPLAY}
              </a>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-md transition-colors md:mt-0 shrink-0"
            >
              <SendIcon /> Enviar un mensaje
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-12 pt-8 border-t border-slate-200 dark:border-white/10">
          {activeSocials.map(({ label, href, Icon, colorClass }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`flex items-center justify-center w-11 h-11 rounded-full border border-slate-300 dark:border-white/10 hover:border-slate-400 hover:bg-slate-100 dark:hover:border-white/30 dark:hover:bg-white/10 transition-colors ${colorClass}`}
            >
              <Icon />
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8">
          © {new Date().getFullYear()} Enzo Huerta. Todos los derechos reservados.
        </p>
      </div>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </footer>
  );
}
