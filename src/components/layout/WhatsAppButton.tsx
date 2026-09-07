import { whatsappGenericoUrl } from "@/lib/utils";

export function WhatsAppButton({ whatsapp }: { whatsapp: string }) {
  if (!whatsapp) return null;

  return (
    <a
      href={whatsappGenericoUrl(whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 4a8 8 0 0 0-6.9 12l-1 3.6 3.7-1A8 8 0 1 0 12 4Zm4.4 11.3c-.2.5-1 1-1.5 1-.4 0-.9.1-2.9-.8-2.5-1.1-4-3.7-4.1-3.9-.1-.2-1-1.3-1-2.5 0-1.2.6-1.7.8-2 .2-.2.5-.3.7-.3h.5c.2 0 .4 0 .5.4.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.2.5.1.6-.1l.6-.7c.2-.3.4-.2.6-.1l1.7.8c.2.1.3.2.4.3.1.2.1.9-.1 1.3Z" />
      </svg>
    </a>
  );
}
