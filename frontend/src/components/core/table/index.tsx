'use client';

import * as React from 'react';

type Align = 'left' | 'center' | 'right';

export type ProfileTableColumn<T> = {
  key: keyof T | string;
  header: string;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  tight?: boolean;
  align?: Align;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  getSortValue?: (row: T) => unknown;
};

export type ProfileTableProps<T> = {
  columns: ProfileTableColumn<T>[];
  rows: T[];
  page: number; // 1-based page
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  getRowId?: (row: T, index: number) => string | number;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (key: string, dir: 'asc' | 'desc') => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
};

export function ProfileViewBtn(props: React.ComponentProps<'div'> & { onClick?: () => void }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        minHeight: 30,
        width: 60,
        minWidth: 60,
        borderRadius: 6,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#f5f5f5',
        color: '#495057',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 150ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#e8e8e8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#f5f5f5';
      }}
      {...props}
    >
      View
    </div>
  );
}

export const formatNumber = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);

function cmp(a: unknown, b: unknown): number {
  const aDate = a instanceof Date ? a : (typeof a === 'string' && !isNaN(Date.parse(a)) ? new Date(a) : null);
  const bDate = b instanceof Date ? b : (typeof b === 'string' && !isNaN(Date.parse(b)) ? new Date(b) : null);
  if (aDate && bDate) return aDate.getTime() - bDate.getTime();

  const aNum = typeof a === 'number' ? a : (typeof a === 'string' ? Number(a) : NaN);
  const bNum = typeof b === 'number' ? b : (typeof b === 'string' ? Number(b) : NaN);
  if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;

  const sa = (a ?? '').toString().toLowerCase();
  const sb = (b ?? '').toString().toLowerCase();
  if (sa < sb) return -1;
  if (sa > sb) return 1;
  return 0;
}



export default function Table<T>({
  columns,
  rows,
  page,
  pageSize,
  total,
  pageSizeOptions = [10, 25, 50],
  onPageChange,
  onPageSizeChange,
  getRowId,
  sortKey,
  sortDirection,
  onSortChange,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search',
}: ProfileTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = React.useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  const handleRowsPerPageForSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = parseInt(e.target.value, 10);
    onPageSizeChange?.(next);
    onPageChange?.(1);
  };

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  const [keyInt, setKeyInt] = React.useState<string | undefined>(sortKey);
  const [dirInt, setDirInt] = React.useState<'asc' | 'desc' | undefined>(sortDirection);
  React.useEffect(() => setKeyInt(sortKey), [sortKey]);
  React.useEffect(() => setDirInt(sortDirection), [sortDirection]);

  const effKey = sortKey ?? keyInt;
  const effDir: 'asc' | 'desc' = sortDirection ?? dirInt ?? 'asc';

  const handleSortClick = (key: string) => {
    const nextDir: 'asc' | 'desc' = effKey !== key ? 'asc' : effDir === 'asc' ? 'desc' : 'asc';
    setKeyInt(key);
    setDirInt(nextDir);
    onSortChange?.(key, nextDir);
  };

  const sortedRows = React.useMemo(() => {
    if (!effKey) return rows;
    const col = columns.find((c) => String(c.key) === effKey);
    if (!col) return rows;
    const getVal = (r: T) => (col.getSortValue ? col.getSortValue(r) : (r as any)[col.key as any]);
    const copy = [...rows];
    copy.sort((ra, rb) => {
      const res = cmp(getVal(ra), getVal(rb));
      return effDir === 'asc' ? res : -res;
    });
    return copy;
  }, [rows, columns, effKey, effDir]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '78vw',
        height: '100%',
        flexGrow: 1,
        minHeight: 0,
        gap: '16px',
      }}
    >
      {/* Search Bar */}
      {onSearchChange && (
        <div style={{ width: '100%', marginBottom: '8px' }}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              width: '300px',
              height: '40px',
              padding: '0 16px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              outline: 'none',
              backgroundColor: '#fff',
              color: '#495057',
              transition: 'border-color 150ms ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#80bdff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#dee2e6';
            }}
          />
        </div>
      )}

      {/* Table Container */}
      <div
        style={{
          width: '100%',
          flex: 1,
          minHeight: 0,
          borderRadius: 8,
          overflowX: 'auto',
          overflowY: 'auto',
          background: 'white',
        }}
      >
        {/* Table */}
        <div
          style={{
            minWidth: '100%',
            width: 'max-content',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #ffffff',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {/* Table Head */}
          <div
            style={{
              display: 'flex',
              background: '#f8f9fa',
              borderBottom: '1px solid #dee2e6',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            {columns.map((c, idx) => {
              const keyStr = String(c.key);
              const isLast = idx === columns.length - 1;
              const sortable = c.sortable === false ? false : !isLast;
              const active = sortable && effKey === keyStr;

              // Calculate width
              let width = c.width;
              if (c.tight && !width) width = 80;
              if (isLast && !width) width = 110;

              return (
                <div
                  key={keyStr}
                  onClick={sortable ? () => handleSortClick(keyStr) : undefined}
                  style={{
                    width: width as any,
                    minWidth: c.minWidth as any,
                    maxWidth: c.maxWidth as any,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px 55px',
                    cursor: sortable ? 'pointer' : 'default',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 12,
                      fontFamily: 'Inter, sans-serif',
                      color: '#495057',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.header}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Table Body */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {sortedRows.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '48px 24px',
                  color: '#6c757d',
                  background: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                No data available
              </div>
            ) : (
              sortedRows.map((row, i) => {
                const rowKey = String(getRowId ? getRowId(row, i) : i);
                return (
                  <div
                    key={rowKey}
                    style={{
                      display: 'flex',
                      background: '#fff',
                      borderBottom: '1px solid #dee2e6',
                      transition: 'background-color 150ms ease',
                      minHeight: '60px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    {columns.map((c, idx) => {
                      const isFirst = idx === 0;
                      const isLast = idx === columns.length - 1;
                      const content = c.render ? c.render(row) : (row as any)[c.key as any] ?? '';

                      // Calculate width (same as header)
                      let width = c.width;
                      if (c.tight && !width) width = 80;
                      if (isLast && !width) width = 110;

                      return (
                        <div
                          key={String(c.key)}
                          style={{
                            width: width as any,
                            minWidth: c.minWidth as any,
                            maxWidth: c.maxWidth as any,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px 55px',
                            fontSize: 12,
                            fontWeight: 400,
                            fontFamily: 'Inter, sans-serif',
                            color: '#6c757d',
                            textAlign: 'center',
                            overflow: c.maxWidth && !isFirst && !isLast ? 'hidden' : 'visible',
                            textOverflow: c.maxWidth && !isFirst && !isLast ? 'ellipsis' : 'clip',
                            whiteSpace: 'nowrap',
                          }}
                          title={typeof content === 'string' ? content : undefined}
                        >
                          {typeof content === 'string' ? <span>{content}</span> : content}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#6c757d', fontSize: 12, fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>Show per page</span>
          <select
            value={pageSize}
            onChange={handleRowsPerPageForSelect}
            style={{
              height: 34,
              padding: '0 8px',
              background: '#fff',
              border: '1px solid #dee2e6',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 400,
              fontFamily: 'Inter, sans-serif',
              color: '#6c757d',
            }}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <span style={{ color: '#888', fontSize: 12, fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>
            {start}-{end} of {total} {total === 1 ? 'record' : 'records'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
          {/* Previous */}
          <div
            onClick={() => {
              if (page > 1) {
                onPageChange?.(Math.max(1, page - 1));
              }
            }}
            style={{
              minWidth: 0,
              paddingLeft: 6,
              paddingRight: 6,
              color: page <= 1 ? '#d3d3d3' : '#6c757d',
              fontSize: 16,
              fontFamily: 'Inter, sans-serif',
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              userSelect: 'none',
              transition: 'all 150ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              minHeight: 32,
            }}
            onMouseEnter={(e) => {
              if (page > 1) {
                e.currentTarget.style.color = '#495057';
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }
            }}
            onMouseLeave={(e) => {
              if (page > 1) {
                e.currentTarget.style.color = '#495057';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            ‹
          </div>

          {/* Pages */}
          {pages.map((p) => (
            <div
              key={p}
              onClick={() => onPageChange?.(p)}
              style={{
                minWidth: 0,
                paddingLeft: 8,
                paddingRight: 8,
                color: p === page ? '#fff' : '#6c757d',
                backgroundColor: p === page ? '#6c757d' : 'transparent',
                fontWeight: 600,
                fontSize: 12,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 150ms ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: p === page ? 'none' : '1px solid transparent',
                borderRadius: 4,
                minHeight: 32,
              }}
              onMouseEnter={(e) => {
                if (p !== page) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (p !== page) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {p}
            </div>
          ))}

          {/* Next */}
          <div
            onClick={() => {
              if (page < totalPages) {
                onPageChange?.(Math.min(totalPages, page + 1));
              }
            }}
            style={{
              minWidth: 0,
              paddingLeft: 8,
              paddingRight: 8,
              color: page >= totalPages ? '#d3d3d3' : '#6c757d',
              fontSize: 16,
              fontFamily: 'Inter, sans-serif',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              userSelect: 'none',
              transition: 'all 150ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              minHeight: 32,
            }}
            onMouseEnter={(e) => {
              if (page < totalPages) {
                e.currentTarget.style.color = '#495057';
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }
            }}
            onMouseLeave={(e) => {
              if (page < totalPages) {
                e.currentTarget.style.color = '#495057';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            ›
          </div>
        </div>
      </div>
    </div>
  );
}