import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useSessionUser } from '@/contexts/SessionUserContext';
import ModalConfirm from '@/components/modals/ModalConfirm';
import { Alert } from '@/components/Alert';
import moment from 'moment';
import { BounceLoader } from 'react-spinners';
import dynamic from 'next/dynamic';
interface AbsenceType {
  id: string;
  name: string;
  is_present: boolean;
  salary: number;
}

const Absen = () => {
  const router = useRouter();
  const { date, id } = router.query;
  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()

  const [absence, setAbsence] = useState<AbsenceType[]>([])
  const [absenceOrigin, setAbsenceOrigin] = useState<AbsenceType[]>([])
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const thisMonth = moment().format("MMMM YYYY")
  const [loading, setLoading] = useState(false)
  const [isVerified, setIsVerified] = useState<boolean>(true)
  const [alertState, setAlertState] = useState({
    isShow: false,
    type: "success",
    message: "",
  });

  const [showModal, setShowModal] = useState<boolean>(false)
  console.log({date})

  useEffect(() => {
    if (router?.query?.id && router?.query?.date) {
      fetchAbsence()
    }
    dispatch({ type: "setCurrentPage", payload: "Absen" })
  }, [date, id])

  const fetchAbsence = async () => {
    try {
      setLoading(true)
      
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/daily-report/absence?date=${date}&id=${id}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      console.log({response})
      if (response?.data?.data) {
        setAbsence(response?.data?.data?.absence)
        setAbsenceOrigin(response?.data?.data?.absence)
        setIsVerified(response.data.data.isVerified)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }
  console.log({absence, isVerified})

  const updateAbsence = (value: any, obj: AbsenceType) => {
    setAbsence(current => 
      current.map(item =>
        item.id === obj.id ? { ...obj, is_present: value } : item
      )
    );
  }

  const handleApproved = async () => {
    let verifDailyReport = null;
    try {
      setLoading(true)
      const filterIsPresent = absence.filter((absen: AbsenceType) => absen.is_present === true)
      console.log("AKWK")
      verifDailyReport = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/daily-report/absence`, 
        {
          absence_item: [...absence],
          date,
          allNotPresent: Boolean(filterIsPresent.length < 1)
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${state?.token}`
          }
        }
      )

      setAbsenceOrigin(absence)
      setIsUpdate(false)
      setShowModal(false)
      console.log(verifDailyReport.data.message)
      setAlertState({
        isShow: true,
        type: "success",
        message: verifDailyReport.data.message,
      });
      // return verifDailyReport?.message
    } catch (error) {
      console.error(error)
      // return verifDailyReport?.message || "Gagal saat melakukan verifikasi" 
      setAlertState({
        isShow: true,
        type: "error",
        message: verifDailyReport?.message || "Gagal saat mengubah data absen" ,
      });
      setIsUpdate(false)
      setShowModal(false)
    }
    setLoading(false)
  }

  const handleCancelEdit = () => {
    setAbsence(absenceOrigin)
    setIsUpdate(false)
  }
  console.log({absence})
  return (
    <Layout>
      <div className="flex flex-col gap-10 mt-10">
        <p className='text-2xl text-center mx-auto'>Silahkan Input Data Hari Ini ({date} {thisMonth})</p>
        <div className="bg-[#617A55] rounded-2xl sm:w-[80%] w-full p-5 mx-auto flex flex-col gap-5">
          <p className="text-2xl text-white">Absen</p>
          <BounceLoader className="mx-auto" loading={loading} color="#e5f3f0" />
          <div className="flex flex-col gap-4 h-[18rem] overflow-y-scroll">
            {absence?.map((absen: AbsenceType) => {
              return (
                <div className="flex flex-col">
                  <div className="flex justify-between mt-4 mb-4">
                    <p className="text-white">{absen.name}</p>
                    <label htmlFor={absen.id} className="cursor-pointer relative">
                      <input type="checkbox" id={absen.id} className="appearance-none h-8 w-8 border-2 rounded-lg border-white check-absen disabled:opacity-60"
                        onChange={(e) => updateAbsence(e.target.checked, absen)}
                        disabled={!isUpdate}
                        checked={absen.is_present}
                      />
                      <Icon icon="mingcute:check-fill" className="text-3xl text-white absolute left-[7px] top-0 text-opacity-0 check-1 transition" />
                    </label>
                  </div>
                  <hr />
                </div>
              )
            })}
            
          </div>
          <div className="text-white flex justify-between">
            {!isUpdate ? (
              <>
                <Link href={`/input-harian/${date}/final-category`} className="p-2 bg-transparent border border-white rounded-lg text-white">Kembali</Link>
                <button className="p-2 bg-[#E4A11B] rounded-lg text-white disabled:opacity-60" onClick={() => setIsUpdate(!isUpdate)} disabled={isVerified}>Ubah Data</button>
              </>
            ) : (
              <>
                <button className="p-2 bg-transparent border border-white rounded-lg text-white" onClick={handleCancelEdit}>Batal</button>
                <button className="p-2 bg-[#14A44D] rounded-lg text-white" onClick={() => setShowModal(!showModal)} >Simpan Data</button>
              </>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <ModalConfirm onApproved={handleApproved} setShowModal={setShowModal} header='Laporan Absen' headerTitle='absen' />
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

export default dynamic(() => Promise.resolve(Absen), {
  ssr: false,
})