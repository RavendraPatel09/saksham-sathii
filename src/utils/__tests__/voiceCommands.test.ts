// src/utils/__tests__/voiceCommands.test.ts
import { describe, it, expect } from 'vitest';
import { parseCommand, normalizeTranscript, type CommandResult } from '../voiceCommands';

// ══════════════════════════════════════════════════════════════════
// 1. COMMAND PARSER UNIT TESTS
// ══════════════════════════════════════════════════════════════════

describe('normalizeTranscript', () => {
  it('lowercases, trims, strips punctuation, collapses whitespace', () => {
    expect(normalizeTranscript('  Open  the JOBS!  ')).toBe('open the jobs');
    expect(normalizeTranscript("Hello, how's it going?")).toBe('hello hows it going');
  });
});

describe('parseCommand – navigation', () => {
  const navCases: [string, string][] = [
    ['open jobs', '/jobs'],
    ['go to jobs', '/jobs'],
    ['show me jobs', '/jobs'],
    ['take me to jobs', '/jobs'],
    ['i want jobs', '/jobs'],
    ['open home', '/'],
    ['go to home', '/'],
    ['open learning', '/learning'],
    ['open the learning page', '/learning'],
    ['open dashboard', '/dashboard'],
    ['open profile', '/dashboard'],
    ['open feedback', '/post-employment'],
    ['open community', '/community'],
    ['open saved', '/saved'],
    ['open resume builder', '/resume-builder'],
    ['open government schemes', '/government-support'],
    // Noisy/natural speech
    ['umm open the jobs page please', '/jobs'],
    ['can you open learning', '/learning'],
  ];

  it.each(navCases)('"%s" → navigates to %s', (input, expectedRoute) => {
    const result = parseCommand(input);
    expect(result.type).toBe('navigate');
    if (result.type === 'navigate') {
      expect(result.route).toBe(expectedRoute);
    }
  });

  it('"go back" navigates to __back__', () => {
    const result = parseCommand('go back');
    expect(result.type).toBe('navigate');
    if (result.type === 'navigate') expect(result.route).toBe('__back__');
  });

  it('"start interview" navigates to /interview', () => {
    const result = parseCommand('start interview practice');
    expect(result.type).toBe('navigate');
    if (result.type === 'navigate') expect(result.route).toBe('/interview');
  });
});

describe('parseCommand – search', () => {
  it('"search for react developer jobs" extracts query', () => {
    const result = parseCommand('search for react developer jobs');
    expect(result.type).toBe('search');
    if (result.type === 'search') {
      expect(result.query).toBe('react developer jobs');
    }
  });

  it('"find java jobs" extracts query', () => {
    const result = parseCommand('find java jobs');
    expect(result.type).toBe('search');
    if (result.type === 'search') {
      expect(result.query).toBe('java jobs');
    }
  });
});

describe('parseCommand – scroll', () => {
  it('"scroll down"', () => {
    const r = parseCommand('scroll down');
    expect(r.type).toBe('scroll');
    if (r.type === 'scroll') expect(r.direction).toBe('down');
  });
  it('"scroll up"', () => {
    const r = parseCommand('scroll up');
    expect(r.type).toBe('scroll');
    if (r.type === 'scroll') expect(r.direction).toBe('up');
  });
  it('"go to top"', () => {
    const r = parseCommand('go to top');
    expect(r.type).toBe('scroll');
    if (r.type === 'scroll') expect(r.direction).toBe('top');
  });
  it('"go to the bottom"', () => {
    const r = parseCommand('go to the bottom');
    expect(r.type).toBe('scroll');
    if (r.type === 'scroll') expect(r.direction).toBe('bottom');
  });
});

describe('parseCommand – accessibility', () => {
  it('"enable dark mode"', () => {
    const r = parseCommand('enable dark mode');
    expect(r.type).toBe('accessibility');
    if (r.type === 'accessibility') { expect(r.key).toBe('darkMode'); expect(r.value).toBe(true); }
  });
  it('"turn off dark mode"', () => {
    const r = parseCommand('turn off dark mode');
    expect(r.type).toBe('accessibility');
    if (r.type === 'accessibility') { expect(r.key).toBe('darkMode'); expect(r.value).toBe(false); }
  });
  it('"turn on high contrast"', () => {
    const r = parseCommand('turn on high contrast');
    expect(r.type).toBe('accessibility');
    if (r.type === 'accessibility') { expect(r.key).toBe('highContrast'); expect(r.value).toBe(true); }
  });
  it('"increase text size"', () => {
    const r = parseCommand('increase text size');
    expect(r.type).toBe('accessibility');
    if (r.type === 'accessibility') { expect(r.key).toBe('largeText'); expect(r.value).toBe(true); }
  });
  it('"decrease text size"', () => {
    const r = parseCommand('decrease text size');
    expect(r.type).toBe('accessibility');
    if (r.type === 'accessibility') { expect(r.key).toBe('largeText'); expect(r.value).toBe(false); }
  });
});

describe('parseCommand – special commands', () => {
  it('"read this page" → read_page', () => {
    expect(parseCommand('read this page').type).toBe('read_page');
  });
  it('"read page" → read_page', () => {
    expect(parseCommand('read page').type).toBe('read_page');
  });
  it('"help" → help', () => {
    expect(parseCommand('help').type).toBe('help');
  });
  it('"what can you do" → help', () => {
    expect(parseCommand('what can you do').type).toBe('help');
  });
  it('"repeat" → repeat', () => {
    expect(parseCommand('repeat').type).toBe('repeat');
  });
  it('"stop listening" → exit_blind_mode', () => {
    expect(parseCommand('stop listening').type).toBe('exit_blind_mode');
  });
  it('"exit blind mode" → exit_blind_mode', () => {
    expect(parseCommand('exit blind mode').type).toBe('exit_blind_mode');
  });
});

describe('parseCommand – fallback (should NOT match)', () => {
  it('"hello there" → unknown', () => {
    expect(parseCommand('hello there').type).toBe('unknown');
  });
  it('"what is the weather" → unknown', () => {
    expect(parseCommand('what is the weather').type).toBe('unknown');
  });
  it('"play music" → unknown', () => {
    expect(parseCommand('play music').type).toBe('unknown');
  });
});
