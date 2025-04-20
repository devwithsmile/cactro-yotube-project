import express from 'express';
import videoRoutes from './routes/videoRoutes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const app = express();
app.use(express.json());

// Swagger setup
const swaggerDocument = JSON.parse(fs.readFileSync('./docs/swagger.json', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/video', videoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));