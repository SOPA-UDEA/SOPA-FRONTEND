"use client";

import React, {  useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue, 
  Selection,    
  Pagination,
  Input,
  Button,
} from "@heroui/react";
import PropTypes from 'prop-types';
import CustomButton from './CustomButton';

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
}: CustomDataGridProps) => {

  if (!Array.isArray(data)) {
    console.error("CustomDataGrid: la prop 'data' debe ser un array.");
    return <div className="p-4 text-center text-red-500">Error: Datos inválidos.</div>;
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hiddenColumns, sethiddenColumns] = useState(false)

  const selectionMode = checkbox ? "multiple" : "none";

  

  const ITEMS_PER_PAGE = 15;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map(col => col.renderActions ? "actions" : col.field));

  const filteredData = data.filter(item => {
    // Buscar en las columnas visibles que no sean acciones
    return visibleColumns.some(colKey => {
      if (colKey === "actions") return false;
      const value = item[colKey];
      if (!value) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


  const finalTableColumns = columns
    .filter(col => visibleColumns.includes(col.renderActions ? "actions" : col.field))
    .map(col => ({
      key: col.renderActions ? "actions" : col.field,
      label: col.headerName,
      renderActions: col.renderActions,
  }));

  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between">
          <Button 
            color='secondary'
            onPress={() => sethiddenColumns(!hiddenColumns)}>
            Columnas visibles
          </Button>

          <Input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-64 "
          />
        </div>

            { 
              hiddenColumns && (
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
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={currentItems} 
        emptyContent={"No hay datos para mostrar."}
      >
        {(item) => (

          <TableRow key={item.id || item.code}>
            {(columnKey) => {
              const columnConfig = finalTableColumns.find(col => col.key === columnKey);
              if (columnConfig?.renderActions) {
                  return (
                    <TableCell>
                      {columnConfig.renderActions(item)}
                    </TableCell>
                  );
                }
             return (
                  <TableCell className="text-primary-foreground">
                    {getKeyValue(item, columnKey)}
                  </TableCell>
                );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
    {totalPages > 1 && (
      <div className="flex justify-center mt-6 mb-4">
        <Pagination
          total={totalPages}
          initialPage={1}
          page={currentPage}
          onChange={(page) => setCurrentPage(page)}
          color="primary"
        />
      </div>
    )}
    </>
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



