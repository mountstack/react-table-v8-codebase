import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, 
    getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';

function ReactTable() {
    const dataSet = [
        { id: 1, name: 'Rijwan Hossain', age: 30 },
        { id: 2, name: 'Roktim Raj', age: 25 },
        { id: 3, name: 'Maryam Islam', age: 28 }, 
        { id: 4, name: 'Rijwan Haque', age: 42 },
        { id: 5, name: 'Roktim Khan', age: 27.5 },
        { id: 6, name: 'Maryam Akter', age: 25 }, 
        { id: 7, name: 'MD. Rijwan', age: 21 },
        { id: 8, name: 'Sohel Rana', age: 35 },
        { id: 9, name: 'Amirul Islam Rana', age: 45 }, 
        { id: 10, name: 'Lisa Mone', age: 25 },
        { id: 11, name: 'Amirul Hossain', age: 25 },
        { id: 12, name: 'MST Maryam Khatun', age: 28 }, 
        { id: 13, name: 'MDR Hossain', age: 26 },
        { id: 14, name: 'Azman', age: 25 },
        { id: 15, name: 'Monirul Alam', age: 35 } 
    ];
    const [pagination, setPagination] = useState({ 
        pageIndex: 0,
        pageSize: 5,
    })
    const data = useMemo(function() {
        return dataSet; 
    }, []); 

    const table = useReactTable({
        data,
        columns: [
            { header: 'Unique ID', accessorKey: 'id' },
            { header: 'Name', accessorKey: 'name'},
            { header: 'Age', accessorKey: 'age', cell: (data) => {
                return `${data.getValue()} years`
            } },
        ],
        getCoreRowModel: getCoreRowModel(), 
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        }
    });


    return (
        <div className='p-6 border-2'>
            <table className="table-auto min-w-full divide-y divide-gray-200 ">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted()] ?? null}
                                            {header.column.getCanFilter() ? (
                                                <div>
                                                    <Filter column={header.column} table={table} />
                                                </div>
                                            ) : null}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className=" hover:bg-slate-100 hover:text-blue-700">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-6 py-1">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody> 
            </table> 

            <div className="h-2" />

            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'First Page'}
                </button> 
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'Previous'} 
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'Next'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'Last Page'}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount().toLocaleString()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[3, 5, 10, 15, 20, 50, 100].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

function Filter({ column, table }) {
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

    const columnFilterValue = column.getFilterValue();

    return typeof firstValue === 'number' ? (
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <input
                type="number"
                value={(columnFilterValue ? columnFilterValue[0] : '') ?? ''}
                onChange={(e) =>
                    column.setFilterValue((old) => [e.target.value, e.target.value])
                }
                placeholder={`Min`}
                className="w-24 border shadow rounded"
            />
        </div>
    ) : (
        <input
            className="w-36 border shadow rounded"
            onChange={(e) => column.setFilterValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '')}
        />
    );
}

export default ReactTable; 
