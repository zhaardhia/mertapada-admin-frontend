import React, { useEffect, useRef, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useSessionUser } from '@/contexts/SessionUserContext';
import moment from 'moment';
import { formatRupiah } from '@/utils/util';
import { BounceLoader } from 'react-spinners';
import 'moment/locale/id';  // Import the Indonesian locale

type ExpenseType = {
  shopExpense: number;
  laukPauk: number;
  bumbuSayuran: number;
  sembakoMinuman: number;
  lainLain: number;
}
type GajiType = {
  id: string;
  name: string;
  salary: number;
  salaryPerDay: number;
}
type SewaType = {
  id: string;
  name: string;
  fee: number;
  rentPerDay: number;
}
type GajiSewaType = {
  gajiSewaTotal: number;
  totalGaji: number;
  totalSewa: number;
  gaji: GajiType[];
  sewa: SewaType[];
}
type TransferInvestor = {
  bagiHasil: number;
  totalSewa: number;
  transferKeInvestor: number;
}

type BagiHasilType = {
  omset: number;
  expense: ExpenseType;
  gajiSewa: GajiSewaType;
  bagiHasil: number;
  nettProfit: number;
  transferToInvestor: TransferInvestor;
  message: string;
  statusCode: string;
  flagIsReportFullOneMonth: boolean;
  startDate: string;
  endDate: string;
  additionExpense: AdditionalExpenseType | null;
}

type AdditionalExpenseType = {
  additionExpenseTotal: number;
  additionExpenseItems: AdditionExpenseItemType[]
}

type AdditionExpenseItemType = {
  id: string;
  name: string;
  nominal: number;
}
moment.locale('id')
const Laporan = () => {
  const router = useRouter();
  const month = moment().format("MM")
  const year = moment().format("YYYY")

  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()
  const category: Array<string> = ["Lauk - pauk", "Bumbu - bumbuan", "Sembako - Minuman", "Lain - Lain"]
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<BagiHasilType>()

  useEffect(() => {
    fetchBagiHasil()
  }, [])

  const fetchBagiHasil = async () => {
    try {
      setLoading(true)
      
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/monthly-recap-pengelola/bagi-hasil?month=${month}&year=${year}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })

      console.log(response?.data)
      if (response?.data?.data) {
        setData(response?.data?.data)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }
  console.log({data})
  return (
    <Layout>
      <div className="flex flex-col gap-10 mt-10" >
        <p className='text-2xl text-center mx-auto'>Laporan Laba/Rugi (Juli 2023)</p>
        <div className="bg-[#617A55] rounded-2xl sm:w-[80%] w-full p-5 mx-auto flex flex-col gap-5">
          <p className="text-2xl text-white text-center">Rekapitulasi</p>
          {!data?.flagIsReportFullOneMonth && data?.endDate && (
            <p className="text-md text-yellow-500 text-center">(Laporan sementara dari tanggal {moment(data?.startDate).format("DD MMMM YYYY")} sampai tanggal {moment(data?.endDate).format("DD MMMM YYYY")})</p>
          )}
          {!data?.flagIsReportFullOneMonth && !data?.endDate && (
            <p className="text-md text-red-500 text-center">(Laporan Harian belum diisi)</p>
          )}
          <BounceLoader className="mx-auto" loading={loading} color="#e5f3f0" />
          <div className="flex flex-col gap-4">
            <div className="p-2 bg-transparent border border-[#5DB7F8] rounded text-white sm:text-base text-sm flex justify-between">
              <p>Pendapatan (OMZET)</p>
              <p className="text-white font-semibold">{formatRupiah(data?.omset)}</p>
            </div>
            <details className="bg-transparent border border-[#F27676] shadow rounded group text-white">
              <summary className="list-none flex flex-wrap items-center cursor-pointer
              focus-visible:outline-none focus-visible:ring focus-visible:ring-pink-500
              rounded group-open:rounded-b-none group-open:z-[1] relative 
              ">
                <div className="flex w-5 items-center justify-center">
                  <div className="border-8 border-transparent border-l-white ml-2 group-open:ml-5
                  group-open:rotate-90 transition-transform origin-left group-open:mb-1
                  "></div>
                </div>
                <div className="flex justify-between items-center sm:w-[95%] w-[90%] sm:text-base text-sm">
                  <h3 className="flex flex-1 p-2">Pengeluaran (Belanja)</h3>
                  <p className="text-white font-semibold">{formatRupiah(data?.expense?.shopExpense)}</p>
                </div>
              </summary>
              <div className="p-4 sm:text-base text-sm">
                <div className="flex justify-between">
                  <p>Lauk - pauk:</p>
                  <p>{formatRupiah(data?.expense?.laukPauk)}</p>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <p>Bumbu - sayuran:</p>
                  <p>{formatRupiah(data?.expense?.bumbuSayuran)}</p>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <p>Sembako - minuman:</p>
                  <p>{formatRupiah(data?.expense?.sembakoMinuman)}</p>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <p>Lain - lain:</p>
                  <p>{formatRupiah(data?.expense?.lainLain)}</p>
                </div>
              </div>
            </details>
            <details className="bg-transparent border border-[#F27676] shadow rounded group text-white">
              <summary className="list-none flex flex-wrap items-center cursor-pointer
              focus-visible:outline-none focus-visible:ring focus-visible:ring-pink-500
              rounded group-open:rounded-b-none group-open:z-[1] relative
              ">
                <div className="flex w-5 items-center justify-center">
                  <div className="border-8 border-transparent border-l-white ml-2 group-open:ml-5
                  group-open:rotate-90 transition-transform origin-left group-open:mb-1
                  "></div>
                </div>
                <div className="flex justify-between items-center sm:w-[95%] w-[90%] sm:text-base text-sm">
                  <h3 className="flex flex-1 p-2">Gaji & Sewa</h3>
                  <p className="text-white font-semibold">{formatRupiah(data?.gajiSewa?.gajiSewaTotal)}</p>
                </div>
              </summary>
              <div className="p-4 sm:text-base text-sm">
                {data?.gajiSewa?.gaji?.map((gaji) => {
                  return (
                    <div className="flex justify-between my-2">
                      <p>Gaji Pak / Bu {gaji?.name}:</p>
                      <p>{formatRupiah(gaji?.salaryPerDay)}</p>
                    </div>
                  )
                })}
                <hr className="my-2" />
                {data?.gajiSewa?.sewa?.map((sewa) => {
                  return (
                    <div className="flex justify-between my-2">
                      <p>Sewa {sewa?.name}:</p>
                      <p>{formatRupiah(sewa?.rentPerDay)}</p>
                    </div>
                  )
                })}
              </div>
            </details>
            {data?.additionExpense && (
              <details className="bg-transparent border border-[#F27676] shadow rounded group text-white">
                <summary className="list-none flex flex-wrap items-center cursor-pointer
                focus-visible:outline-none focus-visible:ring focus-visible:ring-pink-500
                rounded group-open:rounded-b-none group-open:z-[1] relative
                ">
                  <div className="flex w-5 items-center justify-center">
                    <div className="border-8 border-transparent border-l-white ml-2 group-open:ml-5
                    group-open:rotate-90 transition-transform origin-left group-open:mb-1
                    "></div>
                  </div>
                  <div className="flex justify-between items-center sm:w-[95%] w-[90%] sm:text-base text-sm">
                    <h3 className="flex flex-1 p-2">Pengeluaran Tambahan</h3>
                    <p className="text-white font-semibold">{formatRupiah(data?.additionExpense?.additionExpenseTotal)}</p>
                  </div>
                </summary>
                <div className="p-4 sm:text-base text-sm">
                  {data?.additionExpense?.additionExpenseItems.map((addItem) => {
                    return (
                      <>
                        <div className="flex justify-between my-2">
                          <p>{addItem?.name}:</p>
                          <div className="flex gap-3 items-center">
                            <p>{formatRupiah(addItem?.nominal)}</p>
                          </div>
                        </div>
                        <hr className="my-2" />
                      </>
                    )
                  })}
                </div>
              </details>
            )}
            <div className="p-2 bg-transparent border border-[#87E490] rounded text-white sm:text-base text-sm flex justify-between">
              <p>Keuntungan Bersih</p>
              <p className="text-white font-semibold">{formatRupiah(data?.nettProfit)}</p>
            </div>
          </div>
          
          <div className="sm:text-base text-sm text-white px-1">
            <div className="flex sm:flex-row flex-col justify-between">
              <p>Bagi hasil untuk investor (50%):</p>
              <p>{formatRupiah(data?.bagiHasil)}</p>
            </div>
            <hr className="my-2" />
            <div className="flex sm:flex-row flex-col justify-between mt-3">
              <p>Bagi hasil untuk pengelola (50%):</p>
              <p>{formatRupiah(data?.bagiHasil)}</p>
            </div>
          </div>

          <details className="bg-transparent border border-white mb-4 shadow rounded group text-white">
            <summary className="list-none flex flex-wrap items-center cursor-pointer
            focus-visible:outline-none focus-visible:ring focus-visible:ring-pink-500
            rounded group-open:rounded-b-none group-open:z-[1] relative
            ">
              <div className="flex w-5 items-center justify-center">
                <div className="border-8 border-transparent border-l-white ml-2 group-open:ml-5
                group-open:rotate-90 transition-transform origin-left group-open:mb-1
                "></div>
              </div>
              <div className="flex justify-between items-center sm:w-[95%] w-[90%] sm:text-base text-sm">
                <h3 className="flex flex-1 p-2">Transfer ke Investor</h3>
                <p className="text-white font-semibold">{formatRupiah(data?.transferToInvestor?.transferKeInvestor)}</p>
              </div>
            </summary>
            <div className="p-4 sm:text-base text-sm">
              <div className="flex justify-between">
                <p>Bagi hasil:</p>
                <p>{formatRupiah(data?.transferToInvestor?.bagiHasil)}</p>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <p>Sewa:</p>
                <p>{formatRupiah(data?.transferToInvestor?.totalSewa)}</p>
              </div>
            </div>
          </details>
          <div className="text-white flex justify-end gap-2 w-[70%] ml-[30%]">
            <Link href={`/home`} className="p-2 bg-[#14A44D] rounded-lg text-white">Kembali</Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Laporan