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
  onApproved: (item: itemShop) => void;
  categoryId: any;
  date: any;
  itemAdditionUpdate: itemShop | null | undefined;
}

const ModalAddAdditionalItem: React.FC<ModalConfirmAddItemChildType> = ({ setShowModal, onApproved, categoryId, date, itemAdditionUpdate }) => {
  const { axiosJWT, state } = useSessionUser()
  const [msgError, setMsgError] = useState()
  const [msgSuccess, setMsgSuccess] = useState()
  const [name, setName] = useState<string>(itemAdditionUpdate?.name || '')
  const [unitType, setUnitType] = useState<CustomOptionType | null>(itemAdditionUpdate ? { label: itemAdditionUpdate.unit_type, value: itemAdditionUpdate.unit_type } : null)
  const [selectedUnitType, setSelectedUnitType] = useState<string>(itemAdditionUpdate?.unit_type || '')
  const [price, setPrice] = useState<number>(itemAdditionUpdate?.price || 0)
  const [quantity, setQuantity] = useState<number>(itemAdditionUpdate?.quantity || 0)

  console.log({unitType, categoryId})
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
              <p>Silahkan masukkan data belanja tambahan dengan benar</p>
              <div className="mt-5 flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <label>Nama</label>
                  <input placeholder="Masukkan Nama" type="text" className="border border-[#bebebe] sm:w-[23rem] w-full py-2 px-2 rounded-md" onChange={(e) => setName(e.target.value)} value={name} />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Satuan</label>
                  <Select
                    className="basic-single sm:w-[23rem] w-full"
                    classNamePrefix="select"
                    // defaultValue={selectedCity}
                    // isDisabled={!onEdit}
                    defaultValue={unitType}
                    value={unitType}
                    // isLoading={isLoading}
                    placeholder="Pilih Satuan"
                    isClearable={true}
                    // isSearchable={true}
                    name="unit type"
                    options={unitTypes}
                    // onChange={(e: CustomOptionType) => {
                    //   setUnitType(e)
                    // }}
                    onChange={(e) => {
                      setUnitType(e as CustomOptionType)
                      if (e?.value !== "lainnya" && e?.value) setSelectedUnitType(e.value)
                    }}
                  />
                  {unitType?.value === "lainnya" && (
                    <input placeholder="Masukkan nama satuan" type="text" className="border border-[#bebebe] sm:w-[23rem] w-full py-2 px-2 rounded-md" onChange={(e) => setSelectedUnitType(e.target.value)} />
                  )}

                </div>
                <div className="flex flex-col gap-2">
                  <label>Jumlah</label>
                  <NumericFormat type="text" 
                    className="border border-[#bebebe] sm:w-[23rem] w-full py-2 px-2 rounded-md" 
                    thousandSeparator={true}
                    // prefix={'Rp'}
                    fixedDecimalScale={true}
                    allowNegative={false}
                    placeholder="Masukkan Jumlah"
                    onValueChange={(values: any) => {
                      const { formattedValue, value } = values;
                      // formattedValue = "$1,234.56", value = "1234.56"
                      console.log(formattedValue, value);
                      setQuantity(value)
                    }}
                    // className={`bg-[#FFF8D6] h-[2rem] rounded-xl p-2 text-center`}
                    value={quantity}
                    // disabled={item?.quantity && isUpdate ? false : true}
                  />
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
                onClick={() => {
                  const item = {
                    id: itemAdditionUpdate ? itemAdditionUpdate.id : nanoid(10),
                    category_id: categoryId,
                    daily_shop_item_id: 'additional',
                    date: `${moment().format("YYYY-MM")}-${date}`,
                    name: name,
                    price: +price,
                    quantity: +quantity,
                    status: "filled",
                    unit_type: selectedUnitType
                  }
                  console.log({item})
                  onApproved(item)
                }}
              >
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

export default ModalAddAdditionalItem;
