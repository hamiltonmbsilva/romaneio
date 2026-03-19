import { PrismaClient } from "@prisma/client"
import axios from "axios"

const prisma = new PrismaClient()

async function geocodeEndereco(endereco: string) {

 const url = "https://nominatim.openstreetmap.org/search"

 const response = await axios.get(url, {
  params: {
   q: endereco,
   format: "json",
   limit: 1
  },
  headers: {
   "User-Agent": "romaneio-app"
  }
 })

 if (response.data.length === 0) {
  return null
 }

 return {
  latitude: Number(response.data[0].lat),
  longitude: Number(response.data[0].lon)
 }

}

async function atualizarClientes() {

 const clientes = await prisma.cliente.findMany({
  where: {
   latitude: null
  }
 })

 console.log(`Total para processar: ${clientes.length}`)

 for (const cliente of clientes) {

  try {

   const enderecoCompleto = `
   ${cliente.endereco},
   ${cliente.bairro},
   ${cliente.cidade},
   ${cliente.estado},
   Brasil
   `
   .replace(/\n/g, " ")
   .replace(/\s+/g, " ")
   .trim()

   console.log("Buscando:", enderecoCompleto)

   const coords = await geocodeEndereco(enderecoCompleto)

   if (!coords) {
    console.log("❌ Não encontrado")
    continue
   }

   await prisma.cliente.update({
    where: { id: cliente.id },
    data: {
     latitude: coords.latitude,
     longitude: coords.longitude
    }
   })

   console.log("✅ Atualizado:", cliente.nomeFantasia)

   // ⚠️ RESPEITAR API
   await new Promise(resolve => setTimeout(resolve, 3000))

  } catch (error: any) {

   if (error.response?.status === 429) {
    console.log("⏳ Bloqueado pela API, aguardando...")
    await new Promise(resolve => setTimeout(resolve, 5000))
    continue
   }

   console.error("Erro:", cliente.id, error.message)
  }
 }

 console.log("🚀 Finalizado")
}