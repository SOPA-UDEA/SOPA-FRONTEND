"use client";

import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue, 
  Selection    
} from "@heroui/react";
import PropTypes from 'prop-types';

export interface ColumnConfig {
  field: string; 
  headerName: string; 
}

interface CustomDataGridProps {
  data: any[]; 
  columns: ColumnConfig[]; 
  ariaLabel?: string;
  tableClassName?: string; 

  checkbox?: boolean;
  selectedKeys?: Selection; 
  onSelectionChange?: (keys: Selection) => void; 

  actions?: boolean;
  renderActions?: (item: any) => React.ReactNode; 
}

export const CustomDataGrid = ({
  data,
  columns,
  ariaLabel = "Tabla de datos",
  tableClassName = "",
  checkbox = false,
  selectedKeys,
  onSelectionChange,
  actions = false,
  renderActions,
}: CustomDataGridProps) => {

  if (!Array.isArray(data)) {
    console.error("CustomDataGrid: la prop 'data' debe ser un array.");
    return <div className="p-4 text-center text-red-500">Error: Datos inválidos.</div>;
  }

  const selectionMode = checkbox ? "multiple" : "none";


  const finalTableColumns: { key: string; label: string; [key: string]: any }[] = columns.map(col => ({
    key: col.field, 
    label: col.headerName,

  }));

  if (actions && renderActions) {
    finalTableColumns.push({ key: "__actions__", label: "Acciones" }); 
  }

  return (
    <Table
      aria-label={ariaLabel}
      isStriped
      className={tableClassName}
      selectionMode={selectionMode}
      selectedKeys={selectionMode !== "none" ? selectedKeys : undefined} 
      onSelectionChange={selectionMode !== "none" ? onSelectionChange : undefined} 
      classNames={{
        tr: "hover:bg-neutral-50/70 dark:hover:bg-neutral-500/30 transition-colors duration-150", /* */
      }}
    >
      <TableHeader columns={finalTableColumns}>
        {(column) => (
          <TableColumn
            key={column.key}
            allowsSorting={column.key !== "__actions__"} 
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data} 
        emptyContent={"No hay datos para mostrar."}
      >
        {(item) => (

          <TableRow key={item.id || item.code || `row-${React.useId()}`}>
            {(columnKey) => {
              if (columnKey === "__actions__" && renderActions) {
                return <TableCell>{renderActions(item)}</TableCell>;
              }
              return (
                <TableCell className="text-primary-foreground"> {/* */}
                  {getKeyValue(item, columnKey)}
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

CustomDataGrid.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string.isRequired,
    headerName: PropTypes.string.isRequired,
  })).isRequired,
  ariaLabel: PropTypes.string,
  tableClassName: PropTypes.string,
  checkbox: PropTypes.bool,
  selectedKeys: PropTypes.object, 
  onSelectionChange: PropTypes.func,
  actions: PropTypes.bool,
  renderActions: PropTypes.func,
};



