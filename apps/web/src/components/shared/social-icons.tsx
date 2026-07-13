import type { SVGProps } from "react";

/** lucide-react dropped brand/logo icons; these are minimal inline replacements. */

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23 12s0-3.4-.43-5a3.02 3.02 0 0 0-2.13-2.14C18.8 4.43 12 4.43 12 4.43s-6.8 0-8.44.43A3.02 3.02 0 0 0 1.43 7C1 8.6 1 12 1 12s0 3.4.43 5a3.02 3.02 0 0 0 2.13 2.14c1.64.43 8.44.43 8.44.43s6.8 0 8.44-.43A3.02 3.02 0 0 0 22.57 17c.43-1.6.43-5 .43-5ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" />
    </svg>
  );
}
