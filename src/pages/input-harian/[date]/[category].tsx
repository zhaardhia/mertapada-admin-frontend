import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { useSessionUser } from '../../../contexts/SessionUserContext'
import { useDataLaporan } from '../../../contexts/DataLaporanContext'
import Layout from '@/components/Layout';
import Link from 'next/link';
import { NumericFormat } from 'react-number-format';
import ModalConfirmAddItem from '@/components/modals/ModalConfirmAddItem';
import ModalAddAdditionalItem from '@/components/modals/ModalAddAdditionalItem';
import ModalDeleteAdditionalItem from '@/components/modals/ModalDeleteAdditionalItem';
import { formatRupiah, findCategoryShopExpense } from '@/utils/util';
import moment from 'moment';
import 'moment/locale/id';  // Import the Indonesian locale
import { Icon } from '@iconify/react';
import { BounceLoader } from 'react-spinners';
import dynamic from 'next/dynamic';
// import { itemShop } from '@/types/laporan';

moment.locale('id');
interface itemShop {
  id: any;
  category_id: string;
  daily_shop_item_id: any;
  date: any;
  name: string;
  price: number;
  quantity: number;
  status: any;
  unit_type: string;
}

interface RouterType {
  category?: string; // Or whatever type you expect
  date?: string; // Or whatever type you expect
}

const Category = () => {
  const router = useRouter();
  const { category: categoryShop, date } = router.query as RouterType;
  // const category: string = router.query.category;
  // const { myValue } = router.query as MyQuery;


  const thisMonth = moment().format("MMMM YYYY")  
  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()
  const { state: stateLaporan, dispatch: dispatchLaporan } = useDataLaporan()
  const currentCategory = stateLaporan?.currentCategory

  const [loading, setLoading] = useState<boolean>(false)
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const [items, setItems] = useState<itemShop[]>([])
  const [itemsOrigin, setItemsOrigin] = useState<itemShop[]>([])
  const [itemsAddition, setItemsAddition] = useState<itemShop[]>([])
  const [itemsAdditionOrigin, setItemsAdditionOrigin] = useState<itemShop[]>([])
  const [shopExpense, setShopExpense] = useState<number>(0)
  const [shopExpenseOrigin, setShopExpenseOrigin] = useState<number>(0)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showModalAddItem, setShowModalAddItem] = useState<boolean>(false)
  const [showModalDeleteItem, setShowModalDeleteItem] = useState<boolean>(false)

  const [categoryId, setCategoryId] = useState<any>(findCategoryShopExpense(categoryShop))

  const [itemAdditionUpdate, setItemAdditionUpdate] = useState<itemShop | null>()
  const [itemAdditionDelete, setItemAdditionDelete] = useState<itemShop>()

  const [isVerified, setIsVerified] = useState<boolean>(true)

  React.useEffect(() => {
    if (router?.query?.date) {
      fetchShopItem()
      setCategoryId(findCategoryShopExpense(categoryShop))
    }
    dispatch({ type: "setCurrentPage", payload: categoryShop})
  }, [router?.query?.date])
  console.log({categoryShop}, typeof(categoryShop))
  const fetchShopItem = async () => {
    try {
      setLoading(true)
      const categoryId: string = currentCategory.id ? currentCategory.id : findCategoryShopExpense(categoryShop)
      
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/daily-report/item-shopped-by-category?date=${date}&category=${categoryId}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      console.log(response)

      if (response?.data?.data) {
        const mainItem = response.data.data.items.filter((item: itemShop) => item.daily_shop_item_id !== "additional")
        const additionalItem = response.data.data.items.filter((item: itemShop) => item.daily_shop_item_id === "additional")
        setItems(mainItem)
        setItemsOrigin(mainItem)
        setShopExpense(response?.data?.data?.shopExpense)
        setShopExpenseOrigin(response?.data?.data?.shopExpense)
        setItemsAddition(additionalItem)
        setItemsAdditionOrigin(additionalItem)
        setIsVerified(response.data.data.isVerified)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }
  console.log({items, shopExpense})

  const addOrUpdateItemQuantity = (value: any, obj: itemShop, type: string) => {
    setItems(current => 
      current.map(item =>
        item.id === obj.id ? { ...obj, quantity: +value } : item
      )
    );
  }

  const addOrUpdateItemPrice = (value: any, obj: itemShop, type: string) => {
    setItems(current => 
      current.map(item =>
        item.id === obj.id ? { ...obj, price: +value } : item
      )
    );
    const findPriceBefore = items.find((item) => item.id === obj.id)
    setShopExpense((shopExpense || 0) - (findPriceBefore?.price || 0) + (+value))
  }

  const addOrUpdateItemUnitType = (value: any, obj: itemShop, type: string) => {
    setItems(current => 
      current.map(item =>
        item.id === obj.id ? { ...obj, unit_type: value } : item
      )
    );
  }

  const handleCancelEdit = () => {
    setItems(itemsOrigin)
    setShopExpense(shopExpenseOrigin)
    setItemsAddition(itemsAdditionOrigin)
    setItemAdditionUpdate(null)
    setIsUpdate(!isUpdate)
  }

  const handleAddOrUpdateItemApproved = async () => {
    console.log([...items, ...itemsAddition])
    try {
      setLoading(true)
      const postItems = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/daily-report/item-shopped-by-category`, 
        {
          date: date,
          item_shop: [...items, ...itemsAddition]
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${state?.token}`
          } 
        }
      )
      setItemsOrigin(itemsOrigin)
      setShopExpenseOrigin(shopExpense)
      setItemsAdditionOrigin(itemsAddition)
      setShowModal(false)
      setItemAdditionUpdate(null)
      setIsUpdate(false)
      console.log({postItems})
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const handleAdditionalItem = (item: itemShop): void => {
    const findItemBefore = itemsAddition.find((itemBefore: itemShop) => itemBefore.id === item.id)
    if (findItemBefore) {
      setItemsAddition(current => 
        current.map(itemAdd =>
          itemAdd.id === item.id ? { ...item } : itemAdd
        )
      );
    } else {
      setItemsAddition([...itemsAddition, item])
    }
    setShowModalAddItem(false)
    const findPriceBefore = itemsAddition.find((itemAdd) => itemAdd.id === item.id)
    setShopExpense((shopExpense || 0) - (findPriceBefore?.price || 0) + (item.price))
  }
  console.log({itemsAddition})
  return (
    <Layout>
      <div className="flex flex-col gap-10 mt-10">
        <div className="flex flex-col items-center gap-3">
          <Icon icon="mdi:file-report-outline" className="text-7xl" />
          <p className='text-2xl text-center mx-auto'>Silahkan Input Data Pengeluaran ({date} {thisMonth})</p>
        </div>
        <div className="bg-[#617A55] rounded-2xl sm:w-[80%] w-full p-5 mx-auto flex flex-col gap-5">
          <p className="text-2xl text-white">{categoryShop}</p>
          <BounceLoader className="mx-auto" loading={loading} color="#e5f3f0" />
          <div className="flex flex-col gap-4 h-[32rem] overflow-y-scroll pr-5">
            {items?.map((item: itemShop) => {
              return (
                <div className="flex flex-col">
                  <p className="text-white">{item?.name}</p>
                  <div className="flex justify-between mt-4 mb-4">
                    {/* <input type="text" className="bg-[#FFF8D6] w-[25%] h-[2rem] rounded-xl p-2 text-center" value={item?.quantity} /> */}
                    <NumericFormat
                      thousandSeparator={true}
                      // prefix={'Rp'}
                      fixedDecimalScale={true}
                      allowNegative={false}
                      placeholder="Jumlah"
                      onValueChange={(values: any) => {
                        const { formattedValue, value } = values;
                        // formattedValue = "$1,234.56", value = "1234.56"
                        console.log(formattedValue, value);
                        addOrUpdateItemQuantity(value, item, "main")
                      }}
                      className={`bg-[#FFF8D6] w-[25%] h-[2rem] rounded-xl p-2 text-center ${!isUpdate && "disabled:opacity-80"}`}
                      value={item?.quantity === 0 ? null : item?.quantity}
                      disabled={isUpdate ? false : true}
                    />
                    <input disabled type="text" className="bg-[#FFF8D6] w-[30%] h-[2rem] rounded-xl p-2 text-center disabled:opacity-80" value={item?.unit_type} />
                    {/* <input
                      type="text"
                      className="bg-[#FFF8D6] w-[45%] h-[2rem] rounded-xl p-2 text-center"
                      onChange={(e) => addOrUpdateItemPrice(e.target.value, item, "main")}
                      value={item?.price}
                    /> */}
                    <NumericFormat
                      thousandSeparator={true}
                      // prefix={'Rp'}
                      fixedDecimalScale={true}
                      allowNegative={false}
                      placeholder="Harga"
                      onValueChange={(values: any) => {
                        const { formattedValue, value } = values;
                        // formattedValue = "$1,234.56", value = "1234.56"
                        console.log(formattedValue, value);
                        addOrUpdateItemPrice(value, item, "main")
                      }}
                      className={`bg-[#FFF8D6] w-[40%] h-[2rem] rounded-xl p-2 text-center ${(!item?.quantity || !isUpdate) && "disabled:opacity-80"}`}
                      value={item?.price === 0 ? null : item?.price}
                      disabled={isUpdate ? false : true}
                    />
                  </div>
                  <hr />
                </div>
              )
            })}

            {itemsAddition.length > 0 && (
              <div className="mt-5 border border-white rounded-lg p-2">
                <p className="text-white text-xl">Tambahan Data {categoryShop}</p>
                <div className="my-5">
                  {itemsAddition?.map((itemAddition: itemShop) => {
                    return (
                      <div className="flex flex-col">
                        <p className="text-white">{itemAddition.name}</p>
                        <div className="flex justify-between mt-4 mb-4">
                          {/* <input type="text" className="bg-[#FFF8D6] w-[25%] h-[2rem] rounded-xl p-2 text-center" value={item?.quantity} /> */}
                          <NumericFormat
                            thousandSeparator={true}
                            // prefix={'Rp'}
                            fixedDecimalScale={true}
                            allowNegative={false}
                            placeholder="Masukkan Jumlah"
                            className={`bg-[#FFF8D6] w-[25%] h-[2rem] rounded-xl p-2 text-center disabled:opacity-75`}
                            value={itemAddition.quantity}
                            disabled={true}
                          />
                          <input disabled type="text" className="bg-[#FFF8D6] w-[25%] h-[2rem] rounded-xl p-2 text-center disabled:opacity-75" value={itemAddition.unit_type} />
                          <NumericFormat
                            thousandSeparator={true}
                            // prefix={'Rp'}
                            fixedDecimalScale={true}
                            allowNegative={false}
                            placeholder="Masukkan Harga"
                            className={`bg-[#FFF8D6] w-[40%] h-[2rem] rounded-xl p-2 text-center disabled:opacity-75`}
                            value={itemAddition.price}
                            disabled={true}
                          />
                        </div>
                        {isUpdate ? (
                            <button 
                              className="text-white border border-[#CECECE] w-full mx-auto rounded-lg shadow-lg p-2"
                              onClick={() => {
                                setItemAdditionUpdate(itemAddition)
                                setShowModalAddItem(true)
                              }}
                            >
                              Ubah Data
                            </button>
                            
                        )
                      : (
                          <button 
                            className="text-white bg-red-600 w-full mx-auto rounded-lg shadow-lg p-2 disabled:opacity-75"
                            onClick={() => {
                              setItemAdditionDelete(itemAddition)
                              setShowModalDeleteItem(true)
                            }}
                            disabled={isVerified}
                          >
                            Hapus Data
                          </button>
                        ) 
                      }
                        <hr className="my-5" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {isUpdate && (
              <button 
                className="text-white text-2xl border border-[#CECECE] w-[80%] mx-auto rounded-lg shadow-lg"
                onClick={() => setShowModalAddItem(true)}
              >
                +
              </button>
            )}
            
          </div>
          <div className="text-white flex flex-col gap-5 mt-3">
            <p>Total Pengeluaran:</p>
            <p className="text-right font-semibold">{formatRupiah(shopExpense)}</p>
            <hr />
          </div>
          <div className="text-white flex justify-between">
            {!isUpdate ? (
              <>
                <Link href={`/input-harian/${date}`} className="p-2 bg-transparent border border-white rounded-lg text-white">Kembali</Link>
                <button className="p-2 bg-[#E4A11B] rounded-lg text-white disabled:opacity-60" onClick={() => setIsUpdate(!isUpdate)} disabled={isVerified}>Ubah Data</button>
              </>
            ) : (
              <>
                <button className="p-2 bg-transparent border border-white rounded-lg text-white" onClick={handleCancelEdit}>Batal</button>
                <button className="p-2 bg-[#14A44D] rounded-lg text-white" onClick={() => setShowModal(!showModal)}  >Simpan Data</button>
              </>
            )}

            {showModalDeleteItem ? <ModalDeleteAdditionalItem setShowModalDelete={setShowModalDeleteItem} item={itemAdditionDelete} setItemAdditionDelete={setItemAdditionDelete} setItemsAddition={setItemsAddition} itemsAddition={itemsAddition} date={date}  /> : null}

            {showModalAddItem ? <ModalAddAdditionalItem setShowModal={setShowModalAddItem} onApproved={handleAdditionalItem} categoryId={categoryId} date={date} itemAdditionUpdate={itemAdditionUpdate} /> : null}
            {showModal ? <ModalConfirmAddItem setShowModal={setShowModal} onApproved={handleAddOrUpdateItemApproved} /> : null}

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(Category), {
  ssr: false,
})