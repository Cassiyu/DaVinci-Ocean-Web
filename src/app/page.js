"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

import Button from '@/components/button'
import InputText from '@/components/input-text'
import { AuthContext } from '@/context/AuthContext'
import loginImage from '@/assets/login.png'

export default function Home() {
  const { push } = useRouter()
  const { register, handleSubmit } = useForm()
  const { login } = useContext(AuthContext)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [buttonText, setButtonText] = useState("Entrar")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    const resp = await login(data.email, data.senha)
    
    if (resp?.error) {
      toast.error(resp.error)
      setLoading(false)
      setButtonText("Entrar")
      return
    }

    push("/monitoramento")
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  useEffect(() => {
    if (loading) {
      const loadingTexts = ["Carregando.", "Carregando..", "Carregando..."]
      let index = 0

      const interval = setInterval(() => {
        setButtonText(loadingTexts[index])
        index = (index + 1) % loadingTexts.length
      }, 500)

      return () => clearInterval(interval)
    }
  }, [loading])

  return (
    <div className="relative h-screen w-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src={loginImage}
          alt="Login Background"
          fill
          style={{ objectFit: 'cover' }}
          onLoad={handleImageLoad}
        />
      </div>
      <div className={`bg-black p-8 rounded-lg shadow-lg max-w-sm w-full z-10 backdrop-filter backdrop-blur-md bg-opacity-20 ${imageLoaded ? '' : 'hidden'}`}>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          <span className="text-cyan-500">DaVinci</span>{" "}
          <span>Ocean</span>
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <InputText label="Email" register={register} name="email" />
          <InputText label="Senha" register={register} name="senha" type="password" />
          <Link href="/cadastro" className="text-white font-medium no-underline hover:text-cyan-500">Cadastre-se</Link>
          <Button type="submit">{buttonText}</Button>         
        </form>
      </div>
    </div>
  )
}
