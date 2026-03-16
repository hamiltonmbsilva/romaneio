import axios from "axios"

export async function geocodeEndereco(endereco:string){

 const url = "https://nominatim.openstreetmap.org/search"

 const response = await axios.get(url,{
  params:{
   q:endereco,
   format:"json",
   limit:1
  },
  headers:{
   "User-Agent":"romaneio-app"
  }
 })

 if(response.data.length === 0){
  return null
 }

 const data = response.data[0]

 return {
  latitude: Number(data.lat),
  longitude: Number(data.lon)
 }

}