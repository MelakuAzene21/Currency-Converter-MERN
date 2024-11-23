const express=require('express');
const axios=require('axios')
const cors = require('cors')

const app=express();
const rateLimit=require('express-rate-limit');
require("dotenv").config();
const appLimiter=rateLimit({
    windowMs:15*60*1000 ,  //15 minutes
    max:100,
})
const API_URL =" https://v6.exchangerate-api.com/v6/";
const API_KEY=process.env.EXCHANGE_RATE_API_KEY;

//cors with front end
const corsOption={
    origin: ["https://currency-converter-mern-melekus-websites.onrender.com"]
}
app.use(cors(corsOption))
app.use(express.json())
app.use(appLimiter)

app.post('/api/convert',async(req,res)=>{
//get the user data


try {
    const { from, to, amount } = req.body
   
    const url=`${API_URL}/${API_KEY}/pair/${from}/${to}/${amount}` ;
console.log(url);

const response=await axios.get(url);
if(response.data && response.data.result==="success"){
    res.json({
        base:from,
        target:to,
        conversionRate:response.data.conversion_rate,
        convertedAmount:response.data.conversion_result
    })
}else{
    res.json({message:"Error Converting Curruncy",details:response.data})
}


} catch (error) {
  
}
})

const PORT=process.env.PORT||5000;


app.listen(PORT,console.log(`Server is Runing on port ${PORT}`)
)