// src/utils/voiceCommands.ts
// Independently testable command parser with word-boundary regex matching

export type CommandResult =
  | { type: 'navigate'; route: string; confirm: string }
  | { type: 'scroll'; direction: 'up' | 'down' | 'top' | 'bottom'; confirm: string }
  | { type: 'search'; query: string; confirm: string }
  | { type: 'accessibility'; key: string; value: boolean; confirm: string }
  | { type: 'read_page'; confirm: string }
  | { type: 'help'; confirm: string }
  | { type: 'repeat'; confirm: string }
  | { type: 'exit_blind_mode'; confirm: string }
  | { type: 'unknown' };

interface CommandDef {
  pattern: RegExp;
  action: (match: RegExpMatchArray) => CommandResult;
  description: string;
}

// Route map — every page the user can navigate to by voice
const ROUTE_MAP: Record<string, string> = {
  home: '/',
  jobs: '/jobs',
  learning: '/learning',
  learn: '/learning',
  dashboard: '/dashboard',
  profile: '/dashboard',
  interview: '/interview',
  community: '/community',
  feedback: '/post-employment',
  'post employment': '/post-employment',
  'post-employment': '/post-employment',
  'resume builder': '/resume-builder',
  resume: '/resume-builder',
  saved: '/saved',
  'saved items': '/saved',
  'saved jobs': '/saved',
  'government support': '/government-support',
  'government schemes': '/government-support',
  schemes: '/government-support',
  'career roadmap': '/career-roadmap',
  calendar: '/calendar',
  events: '/events',
  safety: '/safety',
  financial: '/financial',
  mentors: '/mentors',
  'employers directory': '/employers-directory',
  employers: '/employers-directory',
  'reserved jobs': '/reserved-jobs',
  settings: '/dashboard',
  more: '/dashboard',
};

export const normalizeTranscript = (raw: string): string => {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[.,!?'"]/g, '')
    .replace(/\s+/g, ' ');
};

const COMMANDS: CommandDef[] = [
  // ── EXIT / STOP ─────────────────────────────────────────────
  {
    pattern: /\b(stop listening|exit blind mode|turn off blind mode|disable blind mode)\b/,
    action: () => ({ type: 'exit_blind_mode', confirm: 'Exiting blind mode. Goodbye.' }),
    description: 'Exit blind mode',
  },

  // ── NAVIGATION ──────────────────────────────────────────────
  {
    pattern: /\b(?:open|go to|navigate to|take me to|show me|show|i want)\b\s+(.+)/,
    action: (match) => {
      const target = match[1].trim().replace(/^the\s+/, '').replace(/\s+page$/, '');
      const route = ROUTE_MAP[target];
      if (route) {
        return { type: 'navigate', route, confirm: `Opening ${target}.` };
      }
      // Try partial matching — find the first route key that the target includes
      for (const [key, r] of Object.entries(ROUTE_MAP)) {
        if (target.includes(key) || key.includes(target)) {
          return { type: 'navigate', route: r, confirm: `Opening ${key}.` };
        }
      }
      return { type: 'unknown' };
    },
    description: 'Navigate to a page',
  },
  {
    pattern: /\bgo\s*back\b/,
    action: () => ({ type: 'navigate', route: '__back__', confirm: 'Going back.' }),
    description: 'Go back',
  },
  {
    pattern: /\b(?:start|begin)\b.*\binterview\b/,
    action: () => ({ type: 'navigate', route: '/interview', confirm: 'Starting interview practice.' }),
    description: 'Start interview',
  },

  // ── SEARCH ──────────────────────────────────────────────────
  {
    pattern: /\b(?:search|find|look)\s+(?:for\s+)?(.+)/,
    action: (match) => {
      const query = match[1].trim();
      return { type: 'search', query, confirm: `Searching for ${query}.` };
    },
    description: 'Search for something',
  },

  // ── SCROLL ──────────────────────────────────────────────────
  {
    pattern: /\bscroll\s+up\b/,
    action: () => ({ type: 'scroll', direction: 'up', confirm: 'Scrolling up.' }),
    description: 'Scroll up',
  },
  {
    pattern: /\bscroll\s+down\b/,
    action: () => ({ type: 'scroll', direction: 'down', confirm: 'Scrolling down.' }),
    description: 'Scroll down',
  },
  {
    pattern: /\bgo\s+to\s+(?:the\s+)?top\b/,
    action: () => ({ type: 'scroll', direction: 'top', confirm: 'Going to top.' }),
    description: 'Scroll to top',
  },
  {
    pattern: /\bgo\s+to\s+(?:the\s+)?bottom\b/,
    action: () => ({ type: 'scroll', direction: 'bottom', confirm: 'Going to bottom.' }),
    description: 'Scroll to bottom',
  },

  // ── ACCESSIBILITY ───────────────────────────────────────────
  {
    pattern: /\b(?:enable|turn on)\b.*\b(?:dark\s*mode)\b/,
    action: () => ({ type: 'accessibility', key: 'darkMode', value: true, confirm: 'Turning on dark mode.' }),
    description: 'Enable dark mode',
  },
  {
    pattern: /\b(?:disable|turn off)\b.*\b(?:dark\s*mode)\b/,
    action: () => ({ type: 'accessibility', key: 'darkMode', value: false, confirm: 'Turning off dark mode.' }),
    description: 'Disable dark mode',
  },
  {
    pattern: /\b(?:enable|turn on)\b.*\b(?:high\s*contrast|contrast)\b/,
    action: () => ({ type: 'accessibility', key: 'highContrast', value: true, confirm: 'Turning on high contrast.' }),
    description: 'Enable high contrast',
  },
  {
    pattern: /\b(?:disable|turn off)\b.*\b(?:high\s*contrast|contrast)\b/,
    action: () => ({ type: 'accessibility', key: 'highContrast', value: false, confirm: 'Disabling high contrast.' }),
    description: 'Disable high contrast',
  },
  {
    pattern: /\b(?:increase|bigger|larger|enlarge)\b.*\b(?:text|font|size)\b/,
    action: () => ({ type: 'accessibility', key: 'largeText', value: true, confirm: 'Increasing text size.' }),
    description: 'Increase text size',
  },
  {
    pattern: /\b(?:decrease|smaller|reduce)\b.*\b(?:text|font|size)\b/,
    action: () => ({ type: 'accessibility', key: 'largeText', value: false, confirm: 'Reducing text size.' }),
    description: 'Decrease text size',
  },

  // ── READ PAGE ───────────────────────────────────────────────
  {
    pattern: /\bread\s+(?:this\s+)?(?:page|screen|content)\b/,
    action: () => ({ type: 'read_page', confirm: '' }),
    description: 'Read current page content',
  },

  // ── REPEAT ──────────────────────────────────────────────────
  {
    pattern: /\brepeat\b/,
    action: () => ({ type: 'repeat', confirm: '' }),
    description: 'Repeat the last spoken confirmation',
  },

  // ── HELP ────────────────────────────────────────────────────
  {
    pattern: /\b(?:help|what can (?:you|i) do|available commands?)\b/,
    action: () => ({
      type: 'help',
      confirm: 'You can say: open jobs, open learning, open dashboard, open feedback, start interview, search for react jobs, scroll down, enable dark mode, read this page, repeat, or stop listening.',
    }),
    description: 'List available commands',
  },
];

export const parseCommand = (rawTranscript: string): CommandResult => {
  const normalized = normalizeTranscript(rawTranscript);

  for (const cmd of COMMANDS) {
    const match = normalized.match(cmd.pattern);
    if (match) {
      const result = cmd.action(match);
      // If the action returns unknown (e.g. navigation target not found),
      // continue checking other patterns
      if (result.type !== 'unknown') {
        return result;
      }
    }
  }

  return { type: 'unknown' };
};

// Export for testing
export const _testInternals = { COMMANDS, ROUTE_MAP, normalizeTranscript };
