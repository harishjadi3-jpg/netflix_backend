import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bcrypt from 'bcrypt'
import dotenv from 'dotent'
const app = express()
const port = 3000

dotenv.config()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected Successfully");
    }).catch(() => {
      console.log("error");
    });
const usersDataSchema = new mongoose.Schema({
  userName:String,
  mail:String,
  password:String,
})
const userData=new mongoose.model("user",usersDataSchema);

app.post('/details', async (req, res) => {
  try{
    console.log(req.body)
    const hashedPassword=await bcrypt.hash(req.body.password,10);
    req.body.password=hashedPassword;
    const user = new userData(req.body);
    await user.save();
    console.log("Data Saved"+req.body.userName);
    console.log("Data Saved"+req.body.mail);
    console.log("Data Saved"+req.body.password);
    res.send("Saved to DB");
  }catch(err){
    res.status(500).send(err);
  }
})

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post('/login',async(req,res)=>{
  try{
    let r=await userData.findOne({mail:req.body.mail})
    console.log(r);
    let isMatch=await bcrypt.compare(req.body.password,r.password);
    console.log("This is password from backend  "+r.password);
    res.send(isMatch);
  }catch(err){
    res.status(500).send("Error while checking")
}
})
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})
