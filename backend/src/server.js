import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Nexform API rodando! ✅' })
})

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})