const fs = require("fs")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function importar(){

 const arquivo = fs.readFileSync("clientes.csv","latin1")

 const linhas = arquivo.split("\n")

 linhas.shift() // remove cabeçalho

 for(const linha of linhas){

  if(!linha) continue

  const colunas = linha.split(";")

  const cliente = {

   ativo: colunas[0] === "Ativo",

   nomeFantasia: colunas[1] || "Sem nome",

   telefone: colunas[2] || null,

   contato: colunas[3] || null,

   email: colunas[4] || null,

   cidade: colunas[5] || "Não informado",

   estado: colunas[6] || "Não informado",

   endereco: colunas[7] || "Não informado",

   cep: colunas[8] || "Não informado",

   bairro: colunas[9] || "Não informado",

   inscricaoEstadual: colunas[10] || null
  }

  await prisma.cliente.create({ data: cliente })

  console.log("Importado:", cliente.nomeFantasia)

 }

 console.log("Importação finalizada")

 process.exit()

}

importar()