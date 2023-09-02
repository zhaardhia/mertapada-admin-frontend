import React, { useEffect, useState } from "react";
import { useSessionUser } from '../../contexts/SessionUserContext'
import { motion } from "framer-motion";
import { animateVibrate, animateFromAboveSlower } from "../../animations/animation";
import { NumericFormat } from 'react-number-format';
import Select from 'react-select';
import { unitTypes, CustomOptionType, formatRupiah} from "@/utils/util";
import { itemShop } from "@/types/laporan";
import { nanoid } from "nanoid";
import moment from "moment";

interface ModalDeleteAdditionalItemType {
  setShowModalDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setItemAdditionDelete: React.Dispatch<React.SetStateAction<itemShop | undefined>>;
  item: itemShop | undefined;
  setItemsAddition: React.Dispatch<React.SetStateAction<itemShop[] | []>>;
  itemsAddition: itemShop[];
  date: string | undefined;
}

const ModalDeleteAdditionalItem: React.FC<ModalDeleteAdditionalItemType> = ({ setShowModalDelete, item, setItemAdditionDelete, setItemsAddition, itemsAddition, date }) => {
  const { axiosJWT, state } = useSessionUser()
  const [msgError, setMsgError] = useState<string | undefined>()
  const [msgSuccess, setMsgSuccess] = useState<string | undefined>()
  console.log({date})
  const handleDeleteItem = async () => {
    try {
      const deleteItems = await axiosJWT.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/daily-report/item-shopped-by-category`, {
        data: {
          id: item?.id,
          date: date
        },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${state?.token}`
          }
        }
      )
      setMsgSuccess("Sukses menghapus data");
      setTimeout(() => {
        setShowModalDelete(false)
      }, 5000)
      setItemAdditionDelete(undefined)
      setItemsAddition((itemsAdd) =>
        itemsAdd.filter((itemAdd) => itemAdd.id !== item?.id)
      );
    } catch (error) {
      console.error(error)
      setMsgError("Gagal menghapus data. Silahkan hubungi admin")
    }
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-black">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-[90%] mx-auto bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-2xl text-center font-semibold">Data Tambahan Belanja</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                // onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <p>Apakah anda yakin akan menghapus data <strong>{item?.quantity} {item?.unit_type} {item?.name}</strong> dengan harga <strong>{formatRupiah(item?.price)}</strong></p>
              {/* <div className="mt-5 flex flex-col gap-2">
                
              </div> */}
            </div>
            {/*footer*/}
            <motion.div
              className={`border-2 border-green-500 rounded-xl p-2 ${msgSuccess ? "block" : "hidden"} sm:w-[30rem] w-[80%] mx-auto my-10`}
              initial={"offscreen"}
              whileInView={"onscreen"}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.5 }}
              variants={animateFromAboveSlower}
            >
              <p className="text-green-500 text-center">{msgSuccess}</p>
            </motion.div>
            <motion.div
              className={`border-2 border-red-500 rounded-xl p-2 ${msgError ? "block" : "hidden"} sm:w-[30rem] w-[80%] mx-auto my-10`}
              initial={"offscreen"}
              whileInView={"onscreen"}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.5 }}
              variants={animateVibrate}
            ><p className="text-red-500 text-center">{msgError}</p></motion.div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-emerald-500 background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModalDelete(false)}
              >
                Batalkan
              </button>
              <button
                className="bg-red-500 text-white active:bg-red-600 uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                // onClick={() => {
                //   if (type === "to_shipment") handleVerifyShipment()
                //   else if (type === "to_verif_payment") handleVerifyPayment()
                // }}
                onClick={handleDeleteItem}
              >
                Ya, saya yakin
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default ModalDeleteAdditionalItem