"use client";

import React, { useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  getKeyValue, Selection, Button, Pagination
} from "@heroui/react";

export interface ColumnConfig {
  field: string;
  headerName: string;
  renderActions?: (item: any) => React.ReactNode;
}

interface CustomDataGridProps {
  data: any[];
  columns: ColumnConfig[];
  ariaLabel?: string;
  tableClassName?: string;
  checkbox?: boolean;
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;

  // 👇 NUEVO: paginado server-side (opcional)
  total?: number;                 // total de filas en el server
  page?: number;                 // 0-based
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  // opcional: spinner externo
  loading?: boolean;
}

export const CustomDataGrid = ({
  data,
  columns,
  ariaLabel = "Tabla de datos",
  tableClassName = "",
  checkbox = false,
  selectedKeys,
  onSelectionChange,

  // paginado
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,

  loading = false,
}: CustomDataGridProps) => {
  if (!Array.isArray(data)) {
    console.error("CustomDataGrid: la prop 'data' debe ser un array.");
    return <div className="p-4 text-center text-red-500">Error: Datos inválidos.</div>;
  }

  const [hiddenColumns, sethiddenColumns] = useState(false);
  const selectionMode = checkbox ? "multiple" : "none";
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map(col => col.renderActions ? "actions" : col.field)
  );

  const finalTableColumns = columns
    .filter(col => visibleColumns.includes(col.renderActions ? "actions" : col.field))
    .map(col => ({
      key: col.renderActions ? "actions" : col.field,
      label: col.headerName,
      renderActions: col.renderActions,
    }));

  // 🤝 Paginación (si se pasan props, se usa; si no, se comporta como antes)
  const effectivePage = typeof page === "number" ? page : 0; // 0-based
  const effectivePageSize = pageSize ?? (data.length || 20);
  const totalRows = total ?? data.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / effectivePageSize));

  return (
    <div className='mb-4'>
      <div className="mb-4">
        <div className="flex justify-between">
          <Button color='secondary' onPress={() => sethiddenColumns(!hiddenColumns)}>
            Columnas visibles
          </Button>
        </div>

        {hiddenColumns && (
          <div className="flex flex-wrap gap-2 mt-2">
            {columns.map((col) => {
              const key = col.renderActions ? "actions" : col.field;
              return (
                <label key={key} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setVisibleColumns([...visibleColumns, key]);
                      } else {
                        setVisibleColumns(visibleColumns.filter(c => c !== key));
                      }
                    }}
                  />
                  {col.headerName}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Tabla */}
      <Table
        aria-label={ariaLabel}
        isStriped
        className={tableClassName}
        selectionMode={selectionMode}
        selectedKeys={selectionMode !== "none" ? selectedKeys : undefined}
        onSelectionChange={selectionMode !== "none" ? onSelectionChange : undefined}
        classNames={{
          tr: "hover:bg-neutral-50/70 dark:hover:bg-neutral-500/30 transition-colors duration-150 m-y-3",
        }}
        aria-busy={loading}
      >
        <TableHeader columns={finalTableColumns}>
          {(column) => (
            <TableColumn key={column.key}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody items={data} emptyContent={loading ? "Cargando..." : "No hay datos para mostrar."}>
          {(item) => (
            <TableRow key={item.id || item.code}>
              {(columnKey) => {
                const columnConfig = finalTableColumns.find(col => col.key === columnKey);
                if (columnConfig?.renderActions) {
                  return <TableCell>{columnConfig.renderActions(item)}</TableCell>;
                }
                return <TableCell className="text-primary-foreground">{getKeyValue(item, columnKey)}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {typeof total === "number" && typeof page === "number" && typeof pageSize === "number" && (
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-default-500">Filas por página</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
              className="border rounded px-2 py-1 bg-transparent"
            >
              {[10, 20, 50, 100].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-default-500">
              {totalRows === 0
                ? "0–0 de 0"
                : `${effectivePage * effectivePageSize + 1}–${Math.min(totalRows, (effectivePage + 1) * effectivePageSize)} de ${totalRows}`}
            </span>
            <Pagination
              isCompact
              showControls
              page={effectivePage + 1}
              total={totalPages}
              onChange={(p) => onPageChange?.(p - 1)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
