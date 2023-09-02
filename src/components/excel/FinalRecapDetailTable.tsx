import Link from 'next/link';
import React, { FC, useMemo } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { RecapDetailCategoryShop } from '@/types/laporan';

type MyData = {
  name: string;
  category: string;
  quantity: string;
  unit_type: string;
  price: string;
};

interface FinalRecapDetailTableType {
  laukPauk: RecapDetailCategoryShop[]; 
  bumbuSayuran: RecapDetailCategoryShop[];
  sembakoMinuman: RecapDetailCategoryShop[];
  lainLain: RecapDetailCategoryShop[];
}

const FinalRecapDetailTable: FC<FinalRecapDetailTableType> = ({ laukPauk, bumbuSayuran, sembakoMinuman, lainLain }) => {

  const columns: TableColumn<MyData>[] = useMemo(
    () => [
      {
        name: 'Nama',
        selector: (row: MyData) => row.name, 
        cell: (row: MyData) => row.name
      },
      { 
        name: 'Kategori', 
        selector: (row: MyData) => row.category, 
        cell: (row: MyData) => row.category 
      },
      { 
        name: 'Jumlah', 
        selector: (row: MyData) => row.quantity, 
        cell: (row: MyData) => row.quantity 
      },
      { 
        name: 'Satuan', 
        selector: (row: MyData) => row.unit_type, 
        cell: (row: MyData) => row.unit_type 
      },
      { 
        name: 'Harga', 
        selector: (row: MyData) => row.price, 
        cell: (row: MyData) => row.price 
      }
    ],
    []
  );

  const data: MyData[] = useMemo(() => [
    ...laukPauk,
    {
      name: "--------",
      category: "--------",
      quantity: "--------",
      unit_type: "--------",
      price: "--------"
    },
    ...bumbuSayuran,
    {
      name: "--------",
      category: "--------",
      quantity: "--------",
      unit_type: "--------",
      price: "--------"
    },
    ...sembakoMinuman,
    {
      name: "--------",
      category: "--------",
      quantity: "--------",
      unit_type: "--------",
      price: "--------"
    },
    ...lainLain
  ], []) 

  return (
    <DataTableExtensions
      className="paid"
      columns={columns}
      data={data}
      // filterPlaceholder="Filter Halaman"
      exportHeaders
    >
      <DataTable
        noHeader
        paginationServer
        sortServer
        data={data}
        columns={columns}
      />
    </DataTableExtensions>
  )
}

export default FinalRecapDetailTable