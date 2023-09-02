import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import { Icon } from '@iconify/react';
import { useSessionUser } from '@/contexts/SessionUserContext';
import { SelectedDeleteType, EmployeeType } from '@/types/employee';
import ModalKaryawanGaji from '@/components/modals/ModalKaryawanGaji';
import ModalConfirm from '@/components/modals/ModalConfirm';
import ModalConfirmDelete from '@/components/modals/ModalConfirmDelete';
import { NumericFormat } from 'react-number-format';
import { Alert } from '@/components/Alert';
import { BounceLoader } from 'react-spinners';

const Karyawan: FC = () => {
  const router = useRouter();
  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()

  const [loading, setLoading] = useState<boolean>(false)
  const [employees, setEmployees] = useState<EmployeeType[]>([])
  const [employeesOrigin, setEmployeesOrigin] = useState<EmployeeType[]>([])
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
    fetchAllEmployees()
  }, [])

  const fetchAllEmployees = async () => {
    try {
      setLoading(true)
      
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/employee`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })

      if (response?.data?.data) {
        setEmployees(response?.data?.data)
        setEmployeesOrigin(response?.data?.data)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }
  
  const handleAddKaryawan = async (karyawan: EmployeeType) => {
    let addKaryawan = null;
    try {
      setLoading(true)
      addKaryawan = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/employee`, 
        {
          employeeItems: [karyawan]
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${state?.token}`
          }
        }
      )
      setEmployees([...employees, karyawan])
      setEmployeesOrigin([...employeesOrigin, karyawan])
      setShowModalAdd(false)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
    return addKaryawan?.message || "Gagal saat melakukan verifikasi"
  }

  const handleUpdateKaryawan = async () => {
    let updateKaryawan = null;
    try {
      setLoading(true)
      updateKaryawan = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/employee`, 
        {
          employeeItems: employees
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${state?.token}`
          }
        }
      )

      setEmployeesOrigin([...employees])
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
        type: "error",
        message: updateKaryawan.message,
      });
    }
    setIsUpdate(false)
    setShowModalConfirm(false)
    setLoading(false)
  }

  const updateEmployeeSalary = (value: any, obj: EmployeeType) => {
    setEmployees(current => 
      current.map(item =>
        item.id === obj.id ? { ...obj, salary: +value } : item
      )
    );
  }

  const handleCancelEdit = () => {
    setEmployees(employeesOrigin)
    setIsUpdate(false)
  }

  const handleDeleteKaryawan = async () => {
    let updateKaryawan = null;
    try {
      setLoading(true)
      updateKaryawan = await axiosJWT.put(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/employee`, 
        {
          id: selectedDelete?.id
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${state?.token}`
          }
        }
      )

      setEmployeesOrigin([...employees.filter((employee: EmployeeType) => employee.id !== selectedDelete?.id)])
      setEmployees([...employees.filter((employee: EmployeeType) => employee.id !== selectedDelete?.id)])
      setIsUpdate(false)
    } catch (error) {
      console.error(error)
      throw error
    }
    setIsUpdate(false)
    setSelectedDelete(undefined)
    setLoading(false)
    return updateKaryawan?.message || "Gagal saat melakukan verifikasi"
  }
  console.log({showModalConfirm})
  return (
    <Layout>
      <div className="flex flex-col gap-10 mt-10">
        <p className='text-2xl text-center mx-auto'>Pengaturan Gaji Karyawan untuk Bulan Ini (Juli 2023)</p>
        <div className="bg-[#617A55] rounded-2xl sm:w-[80%] w-full p-5 mx-auto flex flex-col gap-5">
          <p className="text-2xl text-white">Karyawan & Gaji (Perbulan)</p>
          <BounceLoader className="mx-auto" loading={loading} color="#e5f3f0" />
          <div className="flex flex-col gap-4 h-[18rem] overflow-y-scroll">
            {employees?.map((employee) => {
              return (
                <div className="flex flex-col">
                  <p className="text-white">{employee.name}</p>
                  <div className="flex justify-between w-[95%] items-center mt-4 mb-4">
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
                        updateEmployeeSalary(+value, employee)
                      }}
                      value={employee.salary}
                      disabled={!isUpdate}
                    />
                    {!isUpdate && (
                      <button onClick={() => {
                        setSelectedDelete({ id: employee.id, name: employee.name})
                        setShowModalDelete(true)
                      }}>
                        <Icon icon="zondicons:minus-solid" className="text-3xl text-[#FF3B30]" />
                      </button>
                    )}
                  </div>
                  <hr />
                </div>
              )
            })}

            {employees?.length < 1 && (
              <p className="text-center text-white">Belum ada data karyawan</p>
            )}

            <button className="text-white text-2xl border border-[#CECECE] w-[80%] mx-auto rounded-lg shadow-lg"
              onClick={() => setShowModalAdd(true)}
            >+</button>
          </div>
          <div className="text-white text-sm">
            <p>Catatan:</p>
            <p>* Gaji yang diubah akan berpengaruh pada pembayaran gaji bulan ini & seterusnya. Pastikan anda telah memasukkan nilai gaji dengan benar</p>
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
      {showModalAdd && (
        <ModalKaryawanGaji onApproved={handleAddKaryawan} setShowModal={setShowModalAdd} />
      )}
      {showModalConfirm && (
        <ModalConfirm onApproved={handleUpdateKaryawan} setShowModal={setShowModalConfirm} header='Karyawan & Gaji' headerTitle='karyawan & gajinya' />
      )}
      {showModalDelete && (
        <ModalConfirmDelete nameToBeDeleted={selectedDelete?.name} onApproved={handleDeleteKaryawan} setShowModal={setShowModalDelete} header='Hapus Karyawan' headerTitle='karyawan' />
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

export default Karyawan