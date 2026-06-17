/**
 * Встроенные SVG-иконки.
 * Все на 24x24, цвет наследуется через currentColor.
 * Это даёт темам контроль над цветом иконок через CSS-переменные.
 */

const wrap = (children, { size = 24, ...rest } = {}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

export const MenuIcon = (props) => wrap(
  <>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </>, props,
);

export const SearchIcon = (props) => wrap(
  <>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>, props,
);

export const FilterIcon = (props) => wrap(
  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />, props,
);

export const SortIcon = (props) => wrap(
  <>
    <line x1="4" y1="6" x2="14" y2="6" />
    <line x1="4" y1="12" x2="11" y2="12" />
    <line x1="4" y1="18" x2="8" y2="18" />
    <polyline points="17 8 17 18 21 14" />
  </>, props,
);

export const ChevronRightIcon = (props) => wrap(
  <polyline points="9 18 15 12 9 6" />, props,
);

export const ChevronLeftIcon = (props) => wrap(
  <polyline points="15 18 9 12 15 6" />, props,
);

export const ChevronDownIcon = (props) => wrap(
  <polyline points="6 9 12 15 18 9" />, props,
);

export const CloseIcon = (props) => wrap(
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>, props,
);

export const HomeIcon = (props) => wrap(
  <>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </>, props,
);

export const MapIcon = (props) => wrap(
  <>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </>, props,
);

export const GitBranchIcon = (props) => wrap(
  <>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </>, props,
);

export const ChartIcon = (props) => wrap(
  <>
    <line x1="3" y1="20" x2="21" y2="20" />
    <polyline points="3 16 9 10 13 14 21 6" />
  </>, props,
);

export const SunIcon = (props) => wrap(
  <>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </>, props,
);

export const MoonIcon = (props) => wrap(
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />, props,
);

export const MoreIcon = (props) => wrap(
  <>
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
  </>, props,
);

export const DownloadIcon = (props) => wrap(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </>, props,
);

export const RefreshIcon = (props) => wrap(
  <>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </>, props,
);

export const CheckCircleIcon = (props) => wrap(
  <>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </>, props,
);

export const TrashIcon = (props) => wrap(
  <>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </>, props,
);

export const ThumbsUpIcon = (props) => wrap(
  <path d="M14 9V5a3 3 0 0 0-6 0v4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h11.28a2 2 0 0 0 2-1.7l1.38-9A2 2 0 0 0 17.66 9z" />, props,
);

export const ListIcon = (props) => wrap(
  <>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <polyline points="3 6 4 7 6 5" />
    <polyline points="3 12 4 13 6 11" />
    <polyline points="3 18 4 19 6 17" />
  </>, props,
);

export const PlayIcon = (props) => wrap(
  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />, props,
);

export const PauseIcon = (props) => wrap(
  <>
    <rect x="6" y="4" width="4" height="16" fill="currentColor" />
    <rect x="14" y="4" width="4" height="16" fill="currentColor" />
  </>, props,
);

export const UploadIcon = (props) => wrap(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </>, props,
);
