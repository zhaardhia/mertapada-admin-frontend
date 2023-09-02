import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link';
import { useRouter } from 'next/router'
import { Icon } from '@iconify/react';
import { useSessionUser } from '@/contexts/SessionUserContext';
import { SelectedDeleteType, EmployeeType } from '@/types/employee';
import { BiayaSewaType } from '@/types/biayaSewa';

import ModalKaryawanGaji from '@/components/modals/ModalKaryawanGaji';
import ModalConfirm from '@/components/modals/ModalConfirm';
import ModalConfirmDelete from '@/components/modals/ModalConfirmDelete';
import { NumericFormat } from 'react-number-format';
import { Alert } from '@/components/Alert';
import { BounceLoader } from 'react-spinners';

const BiayaSewa = () => {
  const router = useRouter();
  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()

  const [loading, setLoading] = useState<boolean>(false)
  const [biayaSewa, setBiayaSewa] = useState<BiayaSewaType[]>([])
  const [biayaSewaOrigin, setBiayaSewaOrigin] = useState<BiayaSewaType[]>([])
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false)
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [selectedDelete, setSelectedDelete] = useState<SelectedDeleteType>()
  const [alertState, setAlertState] = useState({
    isShow: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    fetchAllBiayaSewa()
  }, [])

  const fetchAllBiayaSewa = async () => {
    try {
      setLoading(true)
      
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/biaya-sewa`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })

      if (response?.data?.data) {
        setBiayaSewa(response?.data?.data)
        setBiayaSewaOrigin(response?.data?.data)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }
  
  // const handleAddBiayaSewa = async (karyawan: BiayaSewaType) => {
  //   let addKaryawan = null;
  //   try {
  //     addKaryawan = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/employee`, 
  //       {
  //         employeeItems: [karyawan]
  //       },
  //       {
  //         withCredentials: true,
  //         headers: {
  //           Authorization: `Bearer ${state?.token}`
  //         }
  //       }
  //     )
  //     setBiayaSewa([...biayaSewa, karyawan])
  //     setBiayaSewaOrigin([...biayaSewaOrigin, karyawan])
  //     setShowModalAdd(false)
  //   } catch (error) {
  //     console.error(error)
  //   }
  //   return addKaryawan?.message || "Gagal saat melakukan verifikasi"
  // }

  const handleUpdateBiayaSewa = async () => {
    let updateKaryawan = null;
    try {
      setLoading(true)
      updateKaryawan = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/biaya-sewa`, 
        {
          biayaSewaItems: biayaSewa
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${state?.token}`
          }
        }
      )

      setBiayaSewaOrigin([...biayaSewa])
      setIsUpdate(false)
      setAlertState({
        isShow: true,
        type: "success",
        message: updateKaryawan.data.message,
      });
    } catch (error) {
      console.error(error)
      setAlertState({
        isShow: true,
        type: "success",
        message: updateKaryawan.message,
      });
    }
    setIsUpdate(false)
    setShowModalConfirm(false)
    setLoading(false)
  }

  const updatePriceBiayaSewa = (value: any, obj: BiayaSewaType) => {
    setBiayaSewa(current => 
      current.map(item =>
        item.id === obj.id ? { ...obj, fee: +value } : item
      )
    );
  }

  const handleCancelEdit = () => {
    setBiayaSewa(biayaSewaOrigin)
    setIsUpdate(false)
  }

  // const handleDeleteBiayaSewa = async () => {
  //   let updateBiayaSewa = null;
  //   try {
  //     updateBiayaSewa = await axiosJWT.put(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/biaya-sewa`, 
  //       {
  //         id: selectedDelete?.id
  //       },
  //       {
  //         withCredentials: true,
  //         headers: {
  //           Authorization: `Bearer ${state?.token}`
  //         }
  //       }
  //     )

  //     setBiayaSewaOrigin([...biayaSewa.filter((employee: BiayaSewaType) => employee.id !== selectedDelete?.id)])
  //     setBiayaSewa([...biayaSewa.filter((employee: BiayaSewaType) => employee.id !== selectedDelete?.id)])
  //     setIsUpdate(false)
  //   } catch (error) {
  //     console.error(error)
  //     throw error
  //   }
  //   setIsUpdate(false)
  //   setSelectedDelete(undefined)
  //   return updateBiayaSewa?.message || "Gagal saat melakukan verifikasi"
  // }
  console.log({showModalConfirm, biayaSewa})

  return (
    <Layout>
      <div className="flex flex-col gap-10 mt-10">
        <p className='text-2xl text-center mx-auto'>Pengaturan Biaya Sewa untuk Bulan Ini (Juli 2023)</p>
        <div className="bg-[#617A55] rounded-2xl sm:w-[80%] w-full p-5 mx-auto flex flex-col gap-5">
          <p className="text-2xl text-white">Biaya Sewa (Perbulan)</p>
          <BounceLoader className="mx-auto" loading={loading} color="#e5f3f0" />
          <div className="flex flex-col gap-4 h-[18rem] overflow-y-scroll">
            {biayaSewa?.map((sewa) => {
              return (
                <div className="flex flex-col">
                  <p className="text-white">{sewa.name}</p>
                  <div className="flex justify-between items-center mt-4 mb-4">
                    <NumericFormat type="text" 
                      className="bg-[#FFF8D6] w-[55%] h-[2rem] rounded-xl py-2 px-3 disabled:opacity-60" 
                      thousandSeparator={true}
                      // prefix={'Rp'}
                      fixedDecimalScale={true}
                      allowNegative={false}
                      placeholder="Masukkan Gaji"
                      onValueChange={(values: any) => {
                        const { formattedValue, value } = values;
                        // formattedValue = "$1,234.56", value = "1234.56"
                        console.log(formattedValue, value);
                        updatePriceBiayaSewa(+value, sewa)
                      }}
                      value={sewa.fee}
                      disabled={!isUpdate}
                    />
                    {/* {!isUpdate && (
                      <button onClick={() => {
                        setSelectedDelete({ id: sewa.id, name: sewa.name})
                        setShowModalDelete(true)
                      }}>
                        <Icon icon="zondicons:minus-solid" className="text-3xl text-[#FF3B30]" />
                      </button>
                    )} */}
                  </div>
                  <hr />
                </div>
              )
            })}
          </div>
          <div className="text-white text-sm">
            <p>Catatan:</p>
            <p>* Biaya sewa yang diubah akan berpengaruh pada pencatatan laporan bulan ini & seterusnya. Pastikan anda telah memasukkan nilai biaya sewa dengan benar</p>
          </div>
          <div className="text-white flex justify-between">
            {!isUpdate ? (
              <>
                <Link href={`/home`} className="p-2 bg-transparent border border-white rounded-lg text-white">Kembali</Link>
                <button className="p-2 bg-[#E4A11B] rounded-lg text-white" onClick={() => setIsUpdate(!isUpdate)}>Ubah Data</button>
              </>
            ) : (
              <>
                <button className="p-2 bg-transparent border border-white rounded-lg text-white" onClick={handleCancelEdit}>Batal</button>
                <button className="p-2 bg-[#14A44D] rounded-lg text-white" onClick={() => setShowModalConfirm(true)} >Simpan Data</button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* {showModalAdd && (
        <ModalKaryawanGaji onApproved={handleAddBiayaSewa} setShowModal={setShowModalAdd} />
      )} */}
      {showModalConfirm && (
        <ModalConfirm onApproved={handleUpdateBiayaSewa} setShowModal={setShowModalConfirm} header='Biaya Sewa' headerTitle='biaya sewa' />
      )}
      {/* {showModalDelete && (
        <ModalConfirmDelete nameToBeDeleted={selectedDelete?.name} onApproved={handleDeleteBiayaSewa} setShowModal={setShowModalDelete} header='Hapus Biaya Sewa' headerTitle='biaya sewa' />
      )} */}
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

export default BiayaSewa