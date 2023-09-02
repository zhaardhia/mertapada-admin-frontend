import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { useSessionUser } from '../../contexts/SessionUserContext'
import { useDataLaporan } from '../../contexts/DataLaporanContext'
import Layout from '@/components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion'
import { animateVibrate, animateFromAboveSlower, animateFromLeftWithOpacity } from '../../animations/animation'
import { formatRupiah, findCategoryShopExpense } from '@/utils/util';
import moment from 'moment';
import 'moment/locale/id';  // Import the Indonesian locale
import ModalVerifItemShop from '@/components/modals/ModalVerifItemShop';
import { Icon } from '@iconify/react';
import { BounceLoader } from 'react-spinners';
import dynamic from 'next/dynamic';
interface CheckCategoryType {
  name: string;
  filled: boolean;
}
moment.locale('id');

const Date = () => {
  const router = useRouter();
  const { date } = router.query;
  const thisMonth = moment().format("MMMM YYYY")
  console.log({thisMonth})

  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()
  // const category: Array<string> = ["Lauk - pauk", "Bumbu - bumbuan", "Sembako - Minuman", "Lain - Lain"]

  const { dispatch: dispatchLaporan } = useDataLaporan()

  const [loading, setLoading] = useState<boolean>(false)
  const [shopExpense, setShopExpense] = useState<number>()
  const [checkCategory, setCheckCategory] = useState<[]>([])
  const [isAllowedNext, setIsAllowedNext] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [showModalVerif, setShowModalVerif] = useState<boolean>(false)
  const [dailyReportId, setDailyReportId] = useState<string>('')

  React.useEffect(() => {
    if (router?.query?.date) {
      fetchCheckCategory()
    }
    dispatch({ type: "setCurrentPage", payload: "Kategori Data Harian"})
  }, [router?.query?.date])

  const fetchCheckCategory = async () => {
    try {
      setLoading(true)
      
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/daily-report/check-category?date=${date}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      console.log(response)

      setShopExpense(response.data.data.shop_expense)
      setIsAllowedNext(response.data.data.isReadyToVerifCategory)
      setIsVerified(response.data.data.isVerified)
      setDailyReportId(response.data.data.daily_report_id)
      if (response.data.data.responseCheckCategory) {
        setCheckCategory(response.data.data.responseCheckCategory)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const handleApproved = async () => {
    let verifDailyReport = null;
    try {
      verifDailyReport = await axiosJWT.put(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/daily-report/verify-shopped-by-category`, 
        {
          id: dailyReportId,
          date
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${state?.token}`
          }
        }
      )

      setIsVerified(true);
    } catch (error) {
      console.error(error)
    }
    return verifDailyReport.message || "Gagal saat melakukan verifikasi"
  }

  console.log({shopExpense}, {checkCategory}, {isVerified, isAllowedNext})
  return (
    <Layout>
      <div className="flex flex-col gap-10 mt-10">
        <div className="flex flex-col items-center gap-3">
          <Icon icon="mdi:file-report-outline" className="text-7xl" />
          <p className='text-2xl text-center mx-auto'>Data Pengeluaran ({date} {thisMonth})</p>
        </div>
        <div className="bg-[#617A55] rounded-2xl sm:w-[80%] w-full p-5 mx-auto flex flex-col gap-5">
          <p className="text-2xl text-white text-center">Pilih Kategori Data</p>
          <BounceLoader className="mx-auto" loading={loading} color="#e5f3f0" />
          <div className="flex flex-col gap-4">
            {checkCategory.map((category: CheckCategoryType) => {
              return (
                <Link href={`/input-harian/${date}/${category?.name}`} onClick={() => {
                  console.log({category})
                  dispatchLaporan({ type: "setCurrentCategory", payload: category})
                }} 
                className={`p-2 bg-transparent border border-${category?.filled ? "[#87E490]" : "white"} rounded-lg text-white sm:text-base text-sm flex justify-between hover:bg-[#566d4b]`}>
                  <p>{category?.name}</p>
                  {category?.filled ? <p className="text-[#87E490]">Sudah Terisi ✅</p> : <p className="">Belum Terisi</p>}
                </Link>
              )
            })}
          </div>
          <div className="text-white flex flex-col gap-5">
            <p>Total Pengeluaran:</p>
            <p className="text-right font-semibold">{formatRupiah(shopExpense)}</p>
            <hr />
          </div>
          <div className="text-white flex justify-between">
            <Link href="/input-harian" className="p-2 bg-transparent border border-white rounded-lg text-white">Kembali</Link>
            {isAllowedNext && isVerified ? 
              (<Link href={`/input-harian/${date}/final-category`} className="p-2 bg-[#14A44D] rounded-lg text-white">Selanjutnya</Link>) 
            : isAllowedNext && !isVerified ? 
              (
                <button className="p-2 bg-[#E4A11B] rounded-lg text-white" onClick={() => setShowModalVerif(true)}>Verifikasi Data Belanja</button>
              ) :
              (
                <button className="p-2 bg-[#14A44D] rounded-lg text-white opacity-60" disabled>Selanjutnya</button>
              )
            }
            {/* <Link href={`/input-harian/${date}/final-category`} className="p-2 bg-[#14A44D] rounded-lg text-white">Selanjutnya</Link> */}
            {/* <Link href={`/input-harian/${date}/final-category`} className="p-2 bg-[#14A44D] rounded-lg text-white">Selanjutnya</Link> */}
          </div>
          {showModalVerif && (
            <ModalVerifItemShop onApproved={handleApproved}  setShowModal={setShowModalVerif} />
          )}
        </div>
      </div>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(Date), {
  ssr: false,
})
