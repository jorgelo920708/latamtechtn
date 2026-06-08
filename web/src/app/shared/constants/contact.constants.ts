export const CONTACT = {
  email: 'elbacaseres83@gmail.com',
  elbaLinkedInUrl: 'https://www.linkedin.com/in/elba-maria-caseres-887b62217/',
  calendlyUrl: 'https://calendly.com/elbacaseres83/30min',
  phone: '+543446590156',
  phoneDisplay: '+54 3446 590156',
  whatsappUrl: 'https://wa.me/543446590156',
} as const;

export const isPlaceholderLink = (url: string): boolean => url.startsWith('TODO_');
