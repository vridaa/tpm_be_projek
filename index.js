import express from "express"
import cors from "cors"
import ProdukRoute from "./routes/ProdukRoute.js";
import UserRoute from "./routes/UserRoute.js";
import TransaksiRoute from "./routes/TransaksiRoute.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 
app.use("/auth", UserRoute);
app.use("/api", TransaksiRoute);
app.use(ProdukRoute);

app.listen(4000, function(){
    //()=> pengganti function
        console.log("server terhubung");
})