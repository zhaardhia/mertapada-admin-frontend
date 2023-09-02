import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useSessionUser } from '../../../../contexts/SessionUserContext'
import ModalConfirmFinal from '@/components/modals/ModalConfirmFinal';
import { Alert } from '@/components/Alert';
import moment from 'moment';
import { BounceLoader } from 'react-spinners';
import dynamic from 'next/dynamic';

interface FinalCategoryStatusType {
  daily_report_id: string;
  absence_filled: boolean;
  isVerified: boolean;
  omset_filled: boolean;
  isReadyToVerif: boolean;
}

const FinalCategory = () => {
  const router = useRouter();
  const categories: Array<string> = ["Omset", "Absen"];
  const { date, id } = router.query;

  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()
  const thisMonth = moment().format("MMMM YYYY")
  const [loading, setLoading] = useState<boolean>(false)
  const [omsetAndAbsence, setOmsetAndAbsence] = useState<FinalCategoryStatusType>()
  const [isAllowedNext, setIsAllowedNext] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [showModalVerif, setShowModalVerif] = useState<boolean>(false)
  const [sure, setSure] = useState<string>()
  const [alertState, setAlertState] = useState({
    isShow: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (router?.query?.date) {
      fetchAbsenOmset()
    }
    dispatch({ type: "setCurrentPage", payload: "Kategori Data Harian" })
  }, [date])

  const fetchAbsenOmset = async () => {
    try {
      setLoading(true)
      // const categoryId: string = currentCategory.id ? currentCategory.id : findCategoryShopExpense(categoryShop)
      
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/daily-report/omset-absence-status?date=${date}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      console.log(response)

      if (response?.data?.data) {
        setOmsetAndAbsence(response.data.data)
        setIsAllowedNext(response.data.data.isReadyToVerif)
        setIsVerified(response.data.data.isVerified)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }
  
  const handleApproved = async () => {
    let verifFinal = null;
    try {
      setLoading(true)
      verifFinal = await axiosJWT.put(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/daily-report/verify-final`, 
        {
          id: omsetAndAbsence?.daily_report_id,
          date,
          sure
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${state?.token}`
          }
        }
      )

      setOmsetAndAbsence({...omsetAndAbsence, isVerified: true } as FinalCategoryStatusType)
      setIsVerified(true)
      setShowModalVerif(false)
      console.log(verifFinal.data.message)
      setAlertState({
        isShow: true,
        type: "success",
        message: verifFinal.data.message,
      });
      setSure(undefined)
      // return verifDailyReport?.message
      setLoading(false)
    } catch (error) {
      console.error(error)
      // return verifDailyReport?.message || "Gagal saat melakukan verifikasi" 
      console.log({verifFinal})
      setAlertState({
        isShow: true,
        type: "error",
        message: verifFinal?.message || "Gagal saat verifikasi akhir" ,
      });
      setShowModalVerif(false)
      setSure(undefined)
      setLoading(false)
    }
  }
  console.log({omsetAndAbsence}, {isAllowedNext, isVerified})
  return (
    <Layout>
      <div className="flex flex-col gap-10 mt-10">
        <p className='text-2xl text-center mx-auto'>Data Omset & Absen ({date} {thisMonth})</p>
        <div className="bg-[#617A55] rounded-2xl sm:w-[80%] w-full p-5 mx-auto flex flex-col gap-5 h-[30rem]">
          <p className="text-2xl text-white text-center">Pilih Kategori Data</p>
          <BounceLoader className="mx-auto" loading={loading} color="#e5f3f0" />
          <div className="flex flex-col">
            <div className="flex flex-col gap-4">
              <Link href={`/input-harian/${date}/final-category/omset/${omsetAndAbsence?.daily_report_id}`} onClick={() => {
              }} 
              className={`p-2 bg-transparent border border-${omsetAndAbsence?.omset_filled ? "[#87E490]" : "white"} rounded-lg text-white sm:text-base text-sm flex justify-between`}>
                <p>Omset</p>
                {omsetAndAbsence?.omset_filled ? <p className="text-[#87E490]">Sudah Terisi ✅</p> : <p className="">Belum Terisi</p>}
              </Link>
              <Link href={`/input-harian/${date}/final-category/absen/${omsetAndAbsence?.daily_report_id}`} onClick={() => {
                // console.log({category})
                // dispatchLaporan({ type: "setCurrentCategory", payload: category})
              }} 
              className={`p-2 bg-transparent border border-${omsetAndAbsence?.absence_filled ? "[#87E490]" : "white"} rounded-lg text-white sm:text-base text-sm flex justify-between`}>
                <p>Absen</p>
                {omsetAndAbsence?.absence_filled ? <p className="text-[#87E490]">Sudah Terisi ✅</p> : <p className="">Belum Terisi</p>}
              </Link>
            </div>
            <div className="text-white flex justify-between mt-[15rem]">
              <Link href={`/input-harian/${date}`} className="p-2 bg-transparent border border-white rounded-lg text-white">Kembali</Link>
              {isAllowedNext && isVerified ? 
                (<Link href={`/input-harian/${date}/final-recap`} className="p-2 bg-[#14A44D] rounded-lg text-white">Selanjutnya</Link>) 
              : isAllowedNext && !isVerified ? 
                (
                  <button className="p-2 bg-[#E4A11B] rounded-lg text-white" onClick={() => setShowModalVerif(true)}>Verifikasi Akhir</button>
                ) :
                (
                  <button className="p-2 bg-[#14A44D] rounded-lg text-white opacity-60" disabled>Selanjutnya</button>
                )
              }
            </div>
          </div>
        </div>
      </div>
      {showModalVerif && (
        <ModalConfirmFinal onApproved={handleApproved}  setShowModal={setShowModalVerif} header='Verifikasi Final' headerTitle='verifikasi final' setSure={setSure} />
      )}
      {alertState.isShow && (
        <Alert
          showAlert={alertState.isShow}
          hideAlert={() =>
            setAlertState({
              isShow: false,
              type: "success",
              message: "",
            })
          }
          message={alertState.message}
          type={alertState.type}
        />
      )}
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(FinalCategory), {
  ssr: false,
})