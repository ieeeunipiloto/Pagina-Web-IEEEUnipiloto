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
    '  pwd        - Directorio actual',
    '  cal        - Calendario del mes',
    '  uptime     - Tiempo de actividad',
    '  tree       - Árbol del sitio',
    '  man [cmd]  - Ayuda de un comando',
    '  su         - Cambiar de usuario',
    '  sudo       - Ejecutar como root',
    '  history    - Historial de comandos',
    '  clear      - Limpia la terminal',
    '  banner     - Muestra el banner inicial',
  ],
  whoami: ['semillero-iot'],
  hostname: ['semillero-iot.unipiloto.edu.co'],
  pwd: ['/home/semillero-iot'],
  github: ['https://github.com/ieeeunipiloto/Pagina-Web-IEEEUnipiloto'],
  ls: [
    'institucional/',
    'laboratorio/',
    'eventos/',
    'blog/',
    'contacto/',
    'ieee-unipiloto/',
  ],
  tree: [
    '.',
    '├── institucional/',
    '│   ├── mision',
    '│   ├── vision',
    '│   └── sesiones',
    '├── laboratorio/',
    '│   └── proyectos/',
    '├── eventos/',
    '├── blog/',
    '│   └── bitacoras/',
    '├── contacto/',
    '└── ieee-unipiloto/',
    '    ├── directiva',
    '    └── miembros',
  ],
  su: ['┌──────────────────────────────────────┐',
    '│  ¡JA! No tan rápido.                  │',
    '│  Este es un sistema monousuario.      │',
    '│  Tú eres semillero-iot, siéntelo.     │',
    '└──────────────────────────────────────┘'],
  sudo: ['┌──────────────────────────────────────┐',
    '│  ⚡ ¡ALTO AHÍ! ⚡                      │',
    '│  Inserte la tarjeta de acceso...       │',
    '│  ❌ Acceso denegado.                   │',
    '│  (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Eres dev, no root.       │',
    '└──────────────────────────────────────┘'],
};

function generateCalendar(): string[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const header = `     ${monthNames[month]} ${year}`;
  const weekdays = 'Do Lu Ma Mi Ju Vi Sa';
  let grid = '';
  let day = 1;
  for (let row = 0; row < 6; row++) {
    let line = ' ';
    for (let col = 0; col < 7; col++) {
      if (row === 0 && col < firstDay) {
        line += '   ';
      } else if (day > daysInMonth) {
        break;
      } else {
        const isToday = day === now.getDate();
        line += isToday ? `[${String(day).padStart(2)}]` : ` ${String(day).padStart(2)} `;
        day++;
      }
    }
    if (line.trim()) grid += line + '\n';
  }
  return [header, weekdays, grid.trimEnd()];
}

function processCommand(input: string): string[] {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return [];

  const parts = trimmed.split(' ');
  const cmd = parts[0];
  const args = parts.slice(1).join(' ');
  const arg = parts[1] || '';

  if (cmd === 'clear') return ['__clear__'];
  if (cmd === 'date') return [new Date().toLocaleString('es-CO')];
  if (cmd === 'whoami') return COMMANDS.whoami;
  if (cmd === 'pwd') return COMMANDS.pwd;
  if (cmd === 'hostname') return COMMANDS.hostname;
  if (cmd === 'github') return COMMANDS.github;
  if (cmd === 'help') return COMMANDS.help;
  if (cmd === 'ls') return COMMANDS.ls;
  if (cmd === 'tree') return COMMANDS.tree;
  if (cmd === 'su') return COMMANDS.su;
  if (cmd === 'sudo') return COMMANDS.sudo;
  if (cmd === 'banner') return BANNER;
  if (cmd === 'neofetch') return NEOFETCH;
  if (cmd === 'echo') return [args || ''];
  if (cmd === 'cal') return generateCalendar();
  if (cmd === 'uptime') {
    const start = new Date('2024-02-01');
    const diff = Math.floor((Date.now() - start.getTime()) / 1000);
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    return [`up ${days} days, ${hours} hours, ${mins} minutes`,
      'active users: 1 (semillero-iot)',
      'load average: 0.01, 0.03, 0.00'];
  }
  if (cmd === 'uname') return ['Linux semillero-iot 6.8.0-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux'];
  if (cmd === 'man') {
    const manPages: Record<string, string[]> = {
      help: ['help - Muestra todos los comandos disponibles', '', 'Uso: help', 'Sin parámetros.'],
      whoami: ['whoami - Identidad del sistema', '', 'Uso: whoami', 'Muestra el nombre del usuario actual del sistema.'],
      date: ['date - Fecha y hora', '', 'Uso: date', 'Muestra la fecha y hora actual en Colombia.'],
      ls: ['ls - Lista directorios', '', 'Uso: ls', 'Enumera las secciones principales del sitio web.'],
      echo: ['echo - Repite texto', '', 'Uso: echo [mensaje]', 'Repite el mensaje ingresado como argumento.'],
      pwd: ['pwd - Directorio actual', '', 'Uso: pwd', 'Muestra la ruta del directorio de trabajo actual.'],
      cal: ['cal - Calendario', '', 'Uso: cal', 'Muestra el calendario del mes actual.'],
      neofetch: ['neofetch - Info del sistema', '', 'Uso: neofetch', 'Muestra información detallada del semillero.'],
      clear: ['clear - Limpia la terminal', '', 'Uso: clear', 'Limpia todas las líneas de la terminal.'],
      github: ['github - Repositorio', '', 'Uso: github', 'Abre el enlace al repositorio oficial.'],
      tree: ['tree - Árbol del sitio', '', 'Uso: tree', 'Muestra la estructura de directorios del sitio.'],
      uptime: ['uptime - Tiempo activo', '', 'Uso: uptime', 'Muestra desde cuándo está activo el semillero.'],
      history: ['history - Historial', '', 'Uso: history', 'Muestra el historial de comandos ejecutados.'],
      banner: ['banner - Banner inicial', '', 'Uso: banner', 'Muestra el banner de bienvenida del sistema.'],
      hostname: ['hostname - Nombre del servidor', '', 'Uso: hostname', 'Muestra el nombre del servidor actual.'],
      uname: ['uname - Info del kernel', '', 'Uso: uname', 'Muestra información del kernel del sistema.'],
    };
    if (arg && manPages[arg]) return manPages[arg];
    if (arg) return [`No hay entrada de man para '${arg}'.`];
    return ['¿Qué comando? Uso: man <comando>'];
  }

  return [`comando no encontrado: ${cmd}. Escribe 'help' para ver los comandos disponibles.`];
}

const BANNER = [
  '  ┌──────────────────────────────────┐',
  '  │  SEMILLERO IoT E ITSS  v2.0     │',
  '  │  Universidad Piloto de Colombia  │',
  '  └──────────────────────────────────┘',
  '',
];

const NEOFETCH = [
  '  semillero-iot@unipiloto',
  '  ──────────────────────',
  '  OS:       Semillero IoT Linux',
  '  Host:     Universidad Piloto de Colombia',
  '  Kernel:   IoT + ITSS + Smart Cities',
  '  Uptime:   desde 2024',
  '  Grupos:   IEEE ITSS • IEEE IoT • IEEE RAS',
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

      if (cmd.toLowerCase() === 'history') {
        const histLines = history.length
          ? history.map((h, i) => `  ${i + 1}  ${h}`)
          : ['  El historial está vacío.'];
        setLines((prev) => [
          ...prev,
          { type: 'input', text: `$ ${cmd}` },
          ...histLines.map((text) => ({ type: 'output' as const, text })),
        ]);
      } else {
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
      className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/20 cursor-text backdrop-blur-sm"
      onClick={focusInput}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-black/60 border-b border-emerald-500/10">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        <span className="ml-2 text-[10px] text-gray-500 font-mono tracking-wide uppercase">semillero@iot:~/terminal</span>
      </div>
      <div
        ref={containerRef}
        className="bg-black/70 p-4 h-64 overflow-y-auto font-mono text-sm leading-relaxed"
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={line.type === 'input' ? 'text-emerald-400' : 'text-emerald-300/70'}
          >
            {line.text}
          </div>
        ))}
        <div className="flex items-center text-emerald-400 mt-1">
          <span className="mr-1.5 opacity-70">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-emerald-400 caret-emerald-400 font-mono text-sm placeholder-gray-600"
            spellCheck={false}
            autoComplete="off"
            placeholder="Escribe help para comenzar..."
          />
        </div>
      </div>
    </div>
  );
}
