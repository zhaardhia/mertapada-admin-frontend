import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useDataLaporan } from '../../../../contexts/DataLaporanContext'
import { useSessionUser } from '../../../../contexts/SessionUserContext'
import { formatRupiah } from '@/utils/util';
import { RecapDetailCategoryShop } from '@/types/laporan';
import FinalRecapDetailTable from '@/components/excel/FinalRecapDetailTable';
import dynamic from 'next/dynamic';
import moment from 'moment';
import { BounceLoader } from 'react-spinners';
const DynamicFinalDetailDataTable = dynamic(() => import('@/components/excel/FinalRecapDetailTable'), { ssr: false });
const DynamicFinalPriceDataTable = dynamic(() => import('@/components/excel/FinalRecapTotalPrice'), { ssr: false });

interface FinalRecapType {
  id: string;
  gross_profit: number;
  nett_profit: number;
  shop_expense: number;
  prevbalance: number;
  currentbalance: number;
  lainLain: RecapDetailCategoryShop[];
  lainLainTotalPrice: number;
  sembakoMinuman: RecapDetailCategoryShop[];
  sembakoMinumanTotalPrice: number;
  bumbuSayuran: RecapDetailCategoryShop[];
  bumbuSayuranTotalPrice: number;
  laukPauk: RecapDetailCategoryShop[];
  laukPaukTotalPrice: number;

}

const FinalRecapDetail = () => {
  const router = useRouter();
  const { date, id } = router.query;
  const { dispatch: dispatchLaporan } = useDataLaporan()
  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()
  const thisMonth = moment().format("MMMM YYYY")
  const [loading, setLoading] = useState<boolean>(false)
  const [finalRecapDetail, setFinalRecapDetail] = useState<FinalRecapType>()
  const [tabSwitch, setTabSwitch] = useState<string>('dataBelanja') 
  const [isAllowedNext, setIsAllowedNext] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)

  useEffect(() => {
    if (router?.query?.date && router?.query?.id) {
      fetchFinalRecap()
    }
  }, [date, id])

  const fetchFinalRecap = async () => {
    try {
      setLoading(true)
      // const categoryId: string = currentCategory.id ? currentCategory.id : findCategoryShopExpense(categoryShop)
      
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/daily-report/final-recap-detail?id=${id}&date=${date}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      console.log(response)

      if (response?.data?.data) {
        setFinalRecapDetail(response.data.data)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }
  console.log({finalRecapDetail})
  return (
    <Layout>
      <div className="flex flex-col gap-10 mt-10 text-black">
        {/* <p className='text-2xl text-start mx-auto'>Silahkan Input Data Hari Ini ({date} {thisMonth})</p> */}
        <div className="bg-[#85a476] rounded-2xl sm:w-[80%] w-full p-5 mx-auto flex flex-col gap-5">
          <p className="text-2xl text-white text-center">Rekap Akhir Data ({date} {thisMonth})</p>
          <BounceLoader className="mx-auto" loading={loading} color="#e5f3f0" />
          <div className="flex justify-around">
            <button className={`p-2 bg-transparent border rounded-lg text-white ${tabSwitch === "dataBelanja" && "border-slate-400"}`}
              onClick={() => setTabSwitch('dataBelanja')}
            >Data Belanja</button>
            <button className={`p-2 bg-transparent border rounded-lg text-white ${tabSwitch === "totalHarga" && "border-slate-400"}`}
              onClick={() => setTabSwitch('totalHarga')}
            >Total Harga</button>
          </div>
          <div className="flex flex-col gap-4 rounded-lg">
            {finalRecapDetail && tabSwitch === "dataBelanja" && (
              <DynamicFinalDetailDataTable laukPauk={finalRecapDetail!.laukPauk} bumbuSayuran={finalRecapDetail!.bumbuSayuran} sembakoMinuman={finalRecapDetail!.sembakoMinuman} lainLain={finalRecapDetail!.lainLain} />
            )}
            {finalRecapDetail && tabSwitch === "totalHarga" && (
              <DynamicFinalPriceDataTable 
                bumbuSayuranTotalPrice={finalRecapDetail!.bumbuSayuranTotalPrice}
                currentbalance={finalRecapDetail!.currentbalance}
                gross_profit={finalRecapDetail!.gross_profit}
                lainLainTotalPrice={finalRecapDetail!.lainLainTotalPrice}
                laukPaukTotalPrice={finalRecapDetail!.laukPaukTotalPrice}
                nett_profit={finalRecapDetail!.nett_profit}
                prevbalance={finalRecapDetail!.prevbalance}
                sembakoMinumanTotalPrice={finalRecapDetail!.sembakoMinumanTotalPrice}
                shop_expense={finalRecapDetail!.shop_expense}
              />
            )}
          </div>
          <div className="text-white flex justify-end mt-10">
            <Link href={`/input-harian/${date}/final-recap`} className="p-2 bg-transparent border border-white rounded-lg text-white">Kembali</Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(FinalRecapDetail), {
  ssr: false,
})