import React, { FC, useEffect } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useSessionUser } from '../../contexts/SessionUserContext'
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import dynamic from 'next/dynamic';

const index: FC = () => {
  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()
  const router = useRouter();

  useEffect(() => {
    dispatch({ type: "setCurrentPage", payload: "Utama"})
  }, [])

  const logout = async () => {
    try {
      await axiosJWT.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/user-pengelola/logout-user`, {
        withCredentials: true,
        headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
      })
      dispatch({ type: "setIsLoggedIn", payload: false})
      router.push("/")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout>
      <div className="flex flex-col gap-10 mt-5">
        <div className="flex flex-col items-center gap-3">
          <Image src="/icon-brand.png" alt={'warteg kharisma bahari'} width={100} height={100} />
          <p className='text-2xl text-start mx-auto'>Selamat Datang Pengelola!</p>
        </div>
        <div className="bg-[#617A55] shadow-xl rounded-2xl sm:w-[80%] w-full grid grid-cols-2 sm:gap-5 gap-2 items-center sm:p-10 p-5 mx-auto place-items-center h-[15rem]">
          <Link href="/input-harian" className="bg-[#F7E1AE] hover:bg-[#f3dca6] p-3 rounded-2xl w-[80%] text-center flex flex-col items-center gap-1"
            onClick={() => dispatch({ type: "setCurrentPage", payload: "Data Harian"})}
          >
            <Icon icon="mdi:file-report-outline" className="text-2xl" />
            <p className="text-[0.8rem]">Data Harian</p>
          </Link>
          <Link href="/laporan" className="bg-[#F7E1AE] hover:bg-[#f3dca6] p-3 rounded-2xl w-[80%] text-center flex flex-col items-center gap-1"
            onClick={() => dispatch({ type: "setCurrentPage", payload: "Laporan"})}
          >
            <Icon icon="mdi:report-pie-outline" className="text-2xl" />
            <p className="text-[0.8rem]">Laporan</p>
          </Link>
          <Link href="/karyawan" className="bg-[#F7E1AE] hover:bg-[#f3dca6] p-3 rounded-2xl w-[80%] text-center flex flex-col items-center gap-1"
            onClick={() => dispatch({ type: "setCurrentPage", payload: "Karyawan"})}
          >
            <Icon icon="clarity:employee-line" className="text-2xl" />
            <p className="text-[0.8rem]">Karyawan</p>
          </Link>
          <Link href="/biaya-sewa" className="bg-[#F7E1AE] hover:bg-[#f3dca6] p-3 rounded-2xl w-[80%] text-center flex flex-col items-center gap-1"
            onClick={() => dispatch({ type: "setCurrentPage", payload: "Biaya Sewa"})}
          >
            <Icon icon="fluent:money-20-regular" className="text-2xl" />
            <p className="text-[0.8rem]">Biaya Sewa</p>
          </Link>
        </div>
      </div>
      <div className="flex justify-end my-5">
        <button className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-md text-white flex justify-between" onClick={logout}>
          <Icon icon="material-symbols:logout" className="text-2xl" />
          <p>Keluar</p>
        </button>
      </div>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
})