import Link from 'next/link';
import React, { FC, useMemo } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { RecapDetailCategoryShop, RecapDetailPriceShop } from '@/types/laporan'
import { formatRupiah } from '@/utils/util'
type MyData = {
  name: string;
  price: string;
};

const FinalRecapDetailTable: FC<RecapDetailPriceShop> = ({ 
  currentbalance, gross_profit, nett_profit, prevbalance, shop_expense, bumbuSayuranTotalPrice,
  lainLainTotalPrice, laukPaukTotalPrice, sembakoMinumanTotalPrice
}) => {

  const columns: TableColumn<MyData>[] = useMemo(
    () => [
      {
        name: 'Nama Harga',
        selector: (row: MyData) => row.name, 
        cell: (row: MyData) => row.name
      },
      { 
        name: 'Jumlah', 
        selector: (row: MyData) => row.price, 
        cell: (row: MyData) => row.price 
      }
    ],
    []
  );

  const data: MyData[] = useMemo(() => [
    {
      name: "Total Lauk - Pauk",
      price: formatRupiah(laukPaukTotalPrice)
    },
    {
      name: "Total Bumbu - Sayuran",
      price: formatRupiah(bumbuSayuranTotalPrice)
    },
    {
      name: "Total Sembako - Minuman",
      price: formatRupiah(sembakoMinumanTotalPrice)
    },
    {
      name: "Total Lain - Lain",
      price: formatRupiah(lainLainTotalPrice)
    },
    {
      name: "Total Pendapatan (Omset)",
      price: formatRupiah(gross_profit)
    },
    {
      name: "Total Pengeluaran (Belanja)",
      price: formatRupiah(shop_expense)
    },
    {
      name: "Saldo Hari Ini",
      price: formatRupiah(nett_profit)
    },
    {
      name: "Saldo Sebelumnya",
      price: formatRupiah(prevbalance)
    },
    {
      name: "Total Saldo",
      price: formatRupiah(currentbalance)
    },
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