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
    Button,
} from "@heroui/react";

export interface ColumnConfig {
    field: string; 
    headerName: string; 
    renderActions?: (item: unknown) => React.ReactNode;
}

interface CustomDataGridProps {
    data: unknown[]; 
    columns: ColumnConfig[]; 
    ariaLabel?: string;
    tableClassName?: string; 
    checkbox?: boolean;
    selectedKeys?: Selection; 
    onSelectionChange?: (keys: Selection) => void; 
    renderActions?: (item: unknown) => React.ReactNode; 
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
    // const [searchTerm, setSearchTerm] = useState("");
    const [hiddenColumns, sethiddenColumns] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map((col: ColumnConfig) => col.renderActions ? "actions" : col.field));

    if (!Array.isArray(data)) {
        console.error("CustomDataGrid: la prop 'data' debe ser un array.");
        return <div className="p-4 text-center text-red-500">Error: Datos inválidos.</div>;
    }

    const selectionMode = checkbox ? "multiple" : "none";

    const finalTableColumns = columns
        .filter((col: ColumnConfig) => visibleColumns.includes(col.renderActions ? "actions" : col.field))
        .map((col: ColumnConfig) => ({
        key: col.renderActions ? "actions" : col.field,
        label: col.headerName,
        renderActions: col.renderActions,
    }));

    return (
        <div className='mb-4'>
            <div className="mb-4">
                <div className="flex justify-between">
                    <Button 
                        color='secondary'
                        onPress={() => sethiddenColumns(!hiddenColumns)}>
                        Columnas visibles
                    </Button>

                </div>

                    { 
                        hiddenColumns && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {columns.map((col: ColumnConfig) => {
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
                    tr: "hover:bg-neutral-50/70 dark:hover:bg-neutral-500/30 transition-colors duration-150 m-y-3", /* */
                }}
            >
                <TableHeader columns={finalTableColumns}>
                    {(column: { key: string; label: string; renderActions?: (item: unknown) => React.ReactNode }) => (
                    <TableColumn
                        key={column.key}
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

                            <TableRow key={String((item as { id?: unknown; code?: unknown }).id || (item as { id?: unknown; code?: unknown }).code || Math.random())}>
                                {(columnKey) => {
                                const columnConfig = finalTableColumns.find((col: { key: string; label: string; renderActions?: (item: unknown) => React.ReactNode }) => col.key === columnKey);
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
        </div>
    );
};





