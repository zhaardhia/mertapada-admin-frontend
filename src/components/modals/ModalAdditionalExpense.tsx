import React, { useEffect, useState } from "react";
import { useSessionUser } from '../../contexts/SessionUserContext'
import { motion } from "framer-motion";
import { animateVibrate, animateFromAboveSlower } from "../../animations/animation";
import { NumericFormat } from 'react-number-format';
import Select from 'react-select';
import { unitTypes, CustomOptionType } from "@/utils/util";
import { itemShop } from "@/types/laporan";
import { nanoid } from "nanoid";
import moment from "moment";

interface ModalConfirmAddItemChildType {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onApproved: () => Promise<void>;
  setName: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPrice: React.Dispatch<React.SetStateAction<number | undefined>>;
  price: number | undefined;
  name: string | undefined;
  monthYear: string | undefined;
}

const ModalAdditionalExpense: React.FC<ModalConfirmAddItemChildType> = ({ setShowModal, onApproved, setName, setPrice, name, price, monthYear }) => {
  const { axiosJWT, state } = useSessionUser()
  const [msgError, setMsgError] = useState()
  const [msgSuccess, setMsgSuccess] = useState()
  // const [name, setName] = useState<string>(itemAdditionUpdate?.name || '')
  // const [price, setPrice] = useState<number>(itemAdditionUpdate?.price || 0)

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-black">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-[90%] mx-auto bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-2xl text-center font-semibold">Data Pengeluaran Tambahan {moment(monthYear).format("MMMM YYYY")}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                // onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <p>Silahkan masukkan data belanja tambahan dengan benar</p>
              <div className="mt-5 flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <label>Nama</label>
                  <input placeholder="Masukkan Nama" type="text" className="border border-[#bebebe] sm:w-[23rem] w-full py-2 px-2 rounded-md" onChange={(e) => setName(e.target.value)} value={name} />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Harga</label>
                  <NumericFormat type="text" 
                    className="border border-[#bebebe] sm:w-[23rem] w-full py-2 px-2 rounded-md" 
                    thousandSeparator={true}
                    // prefix={'Rp'}
                    fixedDecimalScale={true}
                    allowNegative={false}
                    placeholder="Masukkan Harga"
                    onValueChange={(values: any) => {
                      const { formattedValue, value } = values;
                      // formattedValue = "$1,234.56", value = "1234.56"
                      console.log(formattedValue, value);
                      setPrice(+value)
                    }}
                    // className={`bg-[#FFF8D6] h-[2rem] rounded-xl p-2 text-center`}
                    value={price}
                    // disabled={item?.quantity && isUpdate ? false : true}
                  />
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Batalkan
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                // onClick={() => {
                //   if (type === "to_shipment") handleVerifyShipment()
                //   else if (type === "to_verif_payment") handleVerifyPayment()
                // }}
                onClick={onApproved}              >
                Ya, saya yakin
              </button>
            </div>
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
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ModalAdditionalExpense;
