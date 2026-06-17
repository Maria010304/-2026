import { useEffect, useRef, useState } from 'react';
import { SortIcon } from '../Icons/Icons';
import './SortDropdown.css';

const SORT_OPTIONS = [
  { id: 'date-desc', label: 'По дате (новые)' },
  { id: 'date-asc', label: 'По дате (старые)' },
  { id: 'title', label: 'По алфавиту' },
  { id: 'duration', label: 'По длительности' },
  { id: 'views', label: 'По просмотрам' },
];

/**
 * Выпадающее меню сортировки.
 * Точно по макету "Сортировка".
 */
export default function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="sort" ref={ref}>
      <button
        type="button"
        className={`sort__trigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Сортировка"
      >
        <SortIcon size={18} />
      </button>
      {open && (
        <ul className="sort__menu" role="listbox">
          <li className="sort__menu-header">
            <SortIcon size={16} />
            <span>Сортировка</span>
          </li>
          {SORT_OPTIONS.map((opt) => (
            <li key={opt.id}>
              <button
                type="button"
                className={`sort__item ${value === opt.id ? 'is-active' : ''}`}
                onClick={() => { onChange(opt.id); setOpen(false); }}
                role="option"
                aria-selected={value === opt.id}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
