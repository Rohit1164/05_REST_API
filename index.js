const express=require('express')
const fs=require('fs')
const demoData=require('./MOCK_DATA.json')
const PATH=8000;
const app=express()


app.use(express.urlencoded({extended:'false'}))


app.get("/user",(req, res)=>{
  const html=
  `<ul>
  ${demoData.map((data)=>`<li >${data.first_name}</li>`).join(' ')}
  </ul>`
  return res.send(html)
})

app.get("/api/user",(req, res)=>{
  // console.log(req.headers)
  res.setHeader('X-name','Rohit')
  return res.json(demoData)
})


app.get("/api/user/:id",(req, res)=>{
  const id=Number(req.params.id);
  const data=demoData.find((data)=>data.id===id)
  return res.json(data)
})

app.post("/api/user",(req, res)=>{
  const body=req.body;
  if (
    !body.first_name || 
    !body.last_name || 
    !body.gmail|| 
    !body.gender || 
    !body.job_title) {
    return res.status(201).json("All fields are requered")
  }
  demoData.push({id:demoData.length+1, ...body})
  fs.writeFile('./MOCK_DATA.json',JSON.stringify(demoData),(err,data)=>{
    return res.json({status:'success',id:demoData.length+1})
  })
  
})

app.patch("/api/user", (req, res) => {
  const { name, email } = req.body;
  if (name) demoData.name = name;
  if (email) demoData.email = email;

  // Return the updated demoData
  return res.json({
    message: "User information updated successfully",
    updatedUser: demoData
  });
});

app.delete("/api/user/:id", (req, res) => {
  const { id } = req.params;

  const userIndex = demoData.findIndex(user => user.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  demoData.splice(userIndex, 1);

  return res.json({ message: `User with id ${id} deleted successfully` });
});


app.listen(PATH,()=>console.log(`Server is running on http://localhost: ${PATH}`))