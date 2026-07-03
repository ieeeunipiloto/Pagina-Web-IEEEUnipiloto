import { useState, useRef, useEffect, type KeyboardEvent } from 'react';

interface Line {
  type: 'input' | 'output';
  text: string;
}

const COMMANDS: Record<string, string[]> = {
  help: [
    'Comandos disponibles:',
    '  help       - Muestra esta ayuda',
    '  whoami     - Identidad del sistema',
    '  date       - Fecha y hora actual',
    '  neofetch   - Información del semillero',
    '  ls         - Lista secciones del sitio',
    '  echo [txt] - Repite un mensaje',
    '  github     - Enlace al repositorio',
    '  hostname   - Nombre del servidor',
    '  clear      - Limpia la terminal',
    '  banner     - Muestra el banner inicial',
  ],
  whoami: ['semillero-iot'],
  hostname: ['semillero-iot.unipiloto.edu.co'],
  github: ['https://github.com/ieeeunipiloto/Pagina-Web-IEEEUnipiloto'],
  ls: [
    'institucional/',
    'laboratorio/',
    'eventos/',
    'blog/',
    'contacto/',
    'ieee-unipiloto/',
  ],
};

function processCommand(input: string): string[] {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return [];

  const parts = trimmed.split(' ');
  const cmd = parts[0];
  const args = parts.slice(1).join(' ');

  if (cmd === 'clear') return ['__clear__'];
  if (cmd === 'date') return [new Date().toLocaleString('es-CO')];
  if (cmd === 'whoami') return COMMANDS.whoami;
  if (cmd === 'hostname') return COMMANDS.hostname;
  if (cmd === 'github') return COMMANDS.github;
  if (cmd === 'help') return COMMANDS.help;
  if (cmd === 'ls') return COMMANDS.ls;
  if (cmd === 'banner') return BANNER;
  if (cmd === 'neofetch') return NEOFETCH;
  if (cmd === 'echo') return [args || ''];
  if (cmd === 'uname') return ['Linux semillero-iot 6.8.0-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux'];

  return [`comando no encontrado: ${cmd}. Escribe 'help' para ver los comandos disponibles.`];
}

const BANNER = [
  '  ╔══════════════════════════════════════╗',
  '  ║     SEMILLERO IOT E ITSS v2.0       ║',
  '  ║  Universidad Piloto de Colombia     ║',
  '  ╚══════════════════════════════════════╝',
  '',
];

const NEOFETCH = [
  '       ████████████        semillero-iot@unipiloto',
  '     ██            ██      -----------------------',
  '    ██   ████████   ██     OS: Semillero IoT Linux',
  '   ██   ██      ██   ██    Host: Universidad Piloto de Colombia',
  '   ██   ██      ██   ██    Kernel: IoT + ITSS + Smart Cities',
  '   ██   ██      ██   ██    Uptime: desde 2024',
  '    ██   ████████   ██     Shell: bash 5.2',
  '     ██            ██      DE: Cyber Theme',
  '       ████████████        Editor: VS Code',
  '',
  '  Grupos: IEEE ITSS • IEEE IoT • IEEE RAS',
  '  Laboratorio Remoto: http://lab.semilleroiot.com',
  '',
];

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: BANNER.join('\n') },
    { type: 'output', text: "Bienvenido a la terminal del Semillero IoT. Escribe 'help' para comenzar." },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      const cmd = input.trim();
      const output = processCommand(cmd);

      if (output.length === 1 && output[0] === '__clear__') {
        setLines([]);
      } else {
        setLines((prev) => [
          ...prev,
          { type: 'input', text: `$ ${cmd}` },
          ...output.map((text) => ({ type: 'output' as const, text })),
        ]);
      }

      setHistory((prev) => [...prev, cmd]);
      setHistoryIdx(-1);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx >= 0) {
        const newIdx = historyIdx + 1;
        if (newIdx >= history.length) {
          setHistoryIdx(-1);
          setInput('');
        } else {
          setHistoryIdx(newIdx);
          setInput(history[newIdx]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-green-500/30 cursor-text"
      onClick={focusInput}
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/90 border-b border-green-500/20">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-gray-400 font-mono">semillero@iot:~/terminal</span>
      </div>
      <div
        ref={containerRef}
        className="bg-black/85 p-4 h-64 overflow-y-auto font-mono text-sm leading-relaxed"
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={line.type === 'input' ? 'text-green-400' : 'text-green-300/90'}
          >
            {line.text}
          </div>
        ))}
        <div className="flex items-center text-green-400 mt-1">
          <span className="mr-1">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-green-400 caret-green-400 font-mono text-sm"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
