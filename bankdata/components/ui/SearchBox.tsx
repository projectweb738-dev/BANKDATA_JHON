'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useRef, useState, useEffect } from 'react';

interface SearchBoxProps {
  placeholder?: string;
  paramName?: string;
  className?: string;
  defaultValue?: string;
}

export default function SearchBox({
  placeholder = 'Cari...',
  paramName = 'q',
  className,
  defaultValue = '',
}: SearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [value, setValue] = useState(defaultValue);

  // Sync nilai jika defaultValue berubah (pindah halaman)
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue(val);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const url = new URL(window.location.href);
        if (val) {
          url.searchParams.set(paramName, val);
        } else {
          url.searchParams.delete(paramName);
        }
        url.searchParams.delete('page');
        router.push(`${pathname}?${url.searchParams.toString()}`);
      }, 400);
    },
    [pathname, router, paramName],
  );

  const handleClear = useCallback(() => {
    setValue('');
    if (timerRef.current) clearTimeout(timerRef.current);
    const url = new URL(window.location.href);
    url.searchParams.delete(paramName);
    url.searchParams.delete('page');
    router.push(`${pathname}?${url.searchParams.toString()}`);
  }, [pathname, router, paramName]);

  return (
    <div className={`relative ${className ?? ''}`}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="form-input pl-9 pr-8 py-2 w-full"
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Hapus pencarian"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
