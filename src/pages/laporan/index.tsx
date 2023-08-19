import React, { useRef } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { createPDF } from '@/utils/util';

const Laporan = () => {
  const router = useRouter();
  const { date } = router.query;
  const category: Array<string> = ["Lauk - pauk", "Bumbu - bumbuan", "Sembako - Minuman", "Lain - Lain"]
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  return (
    <Layout>
      <div className="flex flex-col gap-10 mt-10" ref={pdfContainerRef} id="pdf">
        <p className='text-2xl text-center mx-auto'>Laporan Laba/Rugi (Juli 2023)</p>
        <div className="bg-[#617A55] rounded-2xl sm:w-[80%] w-full p-5 mx-auto flex flex-col gap-5">
          <p className="text-2xl text-white text-center">Rekapitulasi</p>
          <div className="flex flex-col gap-4">
            <div className="p-2 bg-transparent border border-[#5DB7F8] rounded text-white sm:text-base text-sm flex justify-between">
              <p>Pendapatan (OMZET)</p>
              <p className="text-white font-semibold">64.400.000</p>
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
                  <p className="text-white font-semibold">64.400.000</p>
                </div>
              </summary>
              <div className="p-4 sm:text-base text-sm">
                <div className="flex justify-between">
                  <p>Lauk - pauk:</p>
                  <p>Rp xxx.xxx</p>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <p>Bumbu - sayuran:</p>
                  <p>Rp xxx.xxx</p>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <p>Sembako - minuman:</p>
                  <p>Rp xxx.xxx</p>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <p>Lain - lain:</p>
                  <p>Rp xxx.xxx</p>
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
                  <p className="text-white font-semibold">64.400.000</p>
                </div>
              </summary>
              <div className="p-4 sm:text-base text-sm">
                <div className="flex justify-between">
                  <p>Gaji (1 orang):</p>
                  <p>Rp xxx.xxx</p>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <p>Sewa:</p>
                  <p>Rp xxx.xxx</p>
                </div>
              </div>
            </details>
            <div className="p-2 bg-transparent border border-[#87E490] rounded text-white sm:text-base text-sm flex justify-between">
              <p>Keuntungan Bersih</p>
              <p className="text-white font-semibold">64.400.000</p>
            </div>
          </div>
          
          <div className="sm:text-base text-sm text-white px-1">
            <div className="flex sm:flex-row flex-col justify-between">
              <p>Bagi hasil untuk investor (50%):</p>
              <p>Rp xxx.xxx</p>
            </div>
            <div className="flex sm:flex-row flex-col justify-between mt-3">
              <p>Bagi hasil untuk pengelola (50%):</p>
              <p>Rp xxx.xxx</p>
            </div>
            <hr className="my-2" />
            <div className="flex sm:flex-row flex-col justify-between">
              <p>Sewa:</p>
              <p>Rp xxx.xxx</p>
            </div>
            <hr className="my-2" />
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
                <p className="text-white font-semibold">64.400.000</p>
              </div>
            </summary>
            <div className="p-4 sm:text-base text-sm">
              <div className="flex justify-between">
                <p>Bagi hasil:</p>
                <p>Rp xxx.xxx</p>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <p>Sewa:</p>
                <p>Rp xxx.xxx</p>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <p>Sisa modal awal:</p>
                <p>Rp xxx.xxx</p>
              </div>
            </div>
          </details>
          <div className="text-white flex justify-end gap-2 w-[70%] ml-[30%]">
            {/* <button className="p-2 bg-[#3B71CA] rounded-lg text-white"
              onClick={() => createPDF(pdfContainerRef.current)}
            >Download PDF</button> */}
            {/* <Link className="p-2 bg-[#3B71CA] rounded-lg text-white"
              href={`/laporan/01`}
            >Rincian</Link> */}
            <Link href={`/home`} className="p-2 bg-[#14A44D] rounded-lg text-white">Kembali</Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Laporan