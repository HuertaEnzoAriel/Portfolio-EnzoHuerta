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
const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 5.9c-.7.3-1.5.6-2.3.7a4 4 0 0 0 1.8-2.2c-.8.5-1.6.8-2.6 1a4 4 0 0 0-6.9 3.7A11.4 11.4 0 0 1 3.7 4.6a4 4 0 0 0 1.3 5.4c-.7 0-1.3-.2-1.9-.5v.1a4 4 0 0 0 3.3 4 4 4 0 0 1-1.9.1 4 4 0 0 0 3.8 2.8A8 8 0 0 1 2 18.6a11.3 11.3 0 0 0 6.3 1.9c7.5 0 11.7-6.4 11.7-11.9v-.5c.8-.6 1.5-1.3 2-2.2Z" />
  </svg>
);

const socials = [
  { label: "GitHub", href: "#", Icon: GithubIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedinIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "Twitter", href: "#", Icon: TwitterIcon },
  { label: "Facebook", href: "#", Icon: FacebookIcon },
];

export default function Footer() {
  return (
    <footer
      className="relative bg-white/90 dark:bg-slate-950/70 backdrop-blur-md text-slate-600 dark:text-slate-200 py-16 transition-colors duration-500"
      style={{ clipPath: "polygon(0 8%, 60% 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-6" id="footer">
        {socials.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-200 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-100 dark:hover:text-white dark:hover:border-white/30 dark:hover:bg-white/10 transition-colors"
          >
            <Icon />
          </a>
        ))}
      </div>
    </footer>
  );
}
