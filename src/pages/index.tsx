import { useEffect, useState } from 'react'
import Image from 'next/image'
// import { Inter } from 'next/font/google'
import bg from '../../public/bg-monda.png'
import LayoutLogin from '@/components/LayoutLogin'
import { useSessionUser } from '../contexts/SessionUserContext'
import { useRouter } from "next/router";
import axios from "axios";
import { motion } from "framer-motion";
import { animateVibrate } from "../animations/animation";
// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { refreshToken, state } = useSessionUser()
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [msgError, setMsgError] = useState<string>();
  const [visiblePass, setVisiblePass] = useState<boolean>(false)

  console.log(state)
  const submitUser = async () => {
    console.log("tes");
    console.log({ username, password });
    console.log(process.env.NEXT_PUBLIC_BASE_URL);
    try {
      // axios.defaults.withCredentials = true
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/user-pengelola/login-user`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
          headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        }
      );
      setMsgError('');
      refreshToken()
      router.push("/home");
    } catch (error: any) {
      console.error(error.response.data.message);
      setMsgError(error.response.data.message);
    }
  };

  return (
    <LayoutLogin>
      <div className="flex flex-col sm:gap-0 gap-10">
        <div className="flex flex-col items-center gap-4">
          <p className="text-2xl text-center font-semibold">Warteg Kharisma Bahari Mertapada</p>
          <Image src="/icon-brand.png" alt={'warteg kharisma bahari'} width={120} height={120} />
        </div>
        <div className="flex flex-col gap-5 w-full sm:w-auto sm:mt-14 bg-[#617A55] p-10 rounded-3xl">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-light text-white">Masuk Sebagai Pengelola</h1>
            <p className="text-[#B4B4B4]">Masuk untuk melanjutkan mengurus laporan</p>
          </div>
          <div className="flex flex-col gap-4 w-full ">
            <input
              type="text"
              name="username"
              placeholder="Nama User"
              className="w-[100%] rounded-xl bg-[#C8C6C6] text-[#666666] font-semibold sm:text-base text-sm p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="flex flex-col gap-2 w-full">
              <input
                type={visiblePass ? "text" : "password"}
                // type="text"
                placeholder="Kata Sandi"
                className="w-[100%] rounded-xl bg-[#C8C6C6] text-[#666666] font-semibold sm:text-base text-sm p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex gap-3 items-center sm:w-full w-[95%] justify-start mt-2">
                <input
                  type="checkbox"
                  className="focus:border-0"
                  checked={visiblePass}
                  onChange={(e) => setVisiblePass(e.target.checked)}
                />
                <p className="text-slate-100 text-sm">Buka Password</p>
              </div>

            </div>
          </div>
          <motion.div
            className={`border-2 border-red-500 rounded-xl p-2 ${msgError ? "block" : "hidden"}`}
            initial={"offscreen"}
            whileInView={"onscreen"}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.5 }}
            variants={animateVibrate}
          >
            <p className="text-red-500">{msgError}</p>
          </motion.div>
          <div className="flex justify-end">
            <button type="submit" className="bg-[#3B71CA] hover:bg-[#2d63ba] text-white text-xl px-7 py-2 rounded-xl" 
              onClick={() => submitUser()}
            >
              Masuk
            </button>
          </div>
        </div>
      </div>
    </LayoutLogin>
  )
}
