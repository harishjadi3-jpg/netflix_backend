import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
const app = express()
const PORT = process.env.PORT || 3000

dotenv.config()

app.use(express.json())
app.use(cors({
  origin: "*"
}));


mongoose.connect(process.env.MONGO_URL)
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
const useData=new mongoose.model("user",usersDataSchema);

app.post('/details', async (req, res) => {
  try {
    const { userName,mail,password } = req.body;

    if (!userName || !mail || !password) {
      return res.status(400).send("Missing fields");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      userName,
      mail,
      password: hashedPassword
    });
    await user.save();
    res.send("Saved to DB");
  } catch (err) {
    console.error("Save error:", err.message);
    res.status(500).send("DB error");
  }
});

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
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
