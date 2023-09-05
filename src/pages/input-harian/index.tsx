import React, { FC, useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link';
import { useSessionUser } from '@/contexts/SessionUserContext'
import { Icon } from '@iconify/react';
import moment from 'moment';
import { BounceLoader } from "react-spinners";
import dynamic from 'next/dynamic';

interface DateMonthTypes {
  status: string;
  date: string;
}
const july = "2023-09"
const InputHarian: FC = () => {
  const tanggal: Array<string> = ["01", "02" , "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]; // example day of month
  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()
  const thisMonth = moment().format("MMMM YYYY")
  const thisMonthAndYear = moment(july).format("YYYY-MM")  // GANTI INI PAS LIVE

  const [allDates, setAllDates] = useState<DateMonthTypes[]>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchAllDates()
    dispatch({ type: "setCurrentPage", payload: "Data Harian"})
  }, [])

  const fetchAllDates = async () => {
    try {
      setLoading(true)
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/daily-report/date-in-month`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      if (response?.data?.data) {
        setAllDates(response.data.data)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }
  console.log({allDates})

  const buttonDayColor = (tgl: DateMonthTypes, idx: number) => {
    if (tgl.status === "verified") return "bg-[#14A44D] text-white hover:bg-[#15A44D]"
    else if (
      // ganti MOMENT DATENYA PAKE BULAN SKRG DAN TANGGAL SESUAI OBJEK
      allDates && (tgl.status === "filled" || tgl.status === "empty") && (allDates[idx - 1]?.status === "verified" || moment(`${thisMonthAndYear}-${tgl.date}`).format("YYYY-MM-DD") === process.env.NEXT_PUBLIC_DATE_CREATED_PROJECT || tgl.date === "01")
    ) {
      return "bg-[#FFF8D6] hover:bg-[#f5eecc]" 
    }
    else "bg-[#FFF8D6] opacity-60"
  }

  return (
    <Layout>
      <div className="flex flex-col gap-10 mt-10">
        <div className="flex flex-col items-center gap-3">
          {/* <Image src="/icon-brand.png" alt={'warteg kharisma bahari'} width={100} height={100} /> */}
          <Icon icon="clarity:date-line" className="text-7xl" />
          <p className='text-2xl mx-auto text-center'>Silahkan Pilih Tanggal Laporan</p>
        </div>
        <div className="bg-[#617A55] rounded-2xl sm:w-[80%] w-full p-5 mx-auto flex flex-col gap-5">
          <p className="text-2xl text-white">{thisMonth}</p>
          <BounceLoader className="mx-auto" loading={loading} color="#e5f3f0" />
          {!loading && (
            <div className="grid sm:grid-cols-5 grid-cols-4 sm:gap-4 gap-2">
              {allDates?.map((tgl: DateMonthTypes, idx) => {
                  return (
                    allDates[idx - 1]?.status === "verified" || tgl?.status === "verified" || moment(`${july}-${tgl.date}`).format("DD") === "01" ?
                    <Link href={`input-harian/${tgl.date}`} 
                      className={`sm:p-2 p-1 
                        ${buttonDayColor(tgl, idx)}  
                        rounded-lg text-center`
                      }
                    >
                      {tgl?.date}
                    </Link>
                    : <button disabled className="sm:p-2 p-1 bg-[#FFF8D6] opacity-60 rounded-lg text-center">{tgl?.date}</button>
                  )
                })
              }
              
            </div>
          )}

          <div className="text-white flex justify-end">
            <Link href={`/home`} className="p-2 bg-transparent border border-white rounded-lg text-white">Kembali</Link>
            {/* <Link href={`/input-harian/${date}/final-category`} className="p-2 bg-[#14A44D] rounded-lg text-white">Selanjutnya</Link> */}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(InputHarian), {
  ssr: false,
})