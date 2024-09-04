import express from 'express';
import bodyparser from 'body-parser';
import homePageRouter from './routes/homePage.js';
import admin_router from './routes/adminRouter.js';
import productRouter from './routes/productsRouter.js';
import errorHandler from './src/middlewares/globalErrorHandler.js';
import env from 'dotenv';

env.config();

const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use("/",homePageRouter);
app.use(errorHandler);
app.use('/admin', admin_router);
app.use('/products', productRouter);

app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}`);
});
