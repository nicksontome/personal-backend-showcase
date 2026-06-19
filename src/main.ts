import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './infrastructure/config/swagger'
import { authController, onboardingController, workoutController } from './infrastructure/ioc/container'
import { createRoutes } from './infrastructure/http/routes/index'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    note: 'In-memory database. Data resets when the server restarts.',
  })
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/', createRoutes(authController, onboardingController, workoutController))

app.listen(PORT, () => {
  console.log(`Showcase API running on port ${PORT}`)
  console.log(`API docs available at http://localhost:${PORT}/api-docs`)
})