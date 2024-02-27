const { faker, el } = require('@faker-js/faker');
const mysql = require('mysql2');
const path=require("path");
const express=require("express");
const { traceDeprecation } = require('process');
const app=express();
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

let port=3000;
app.listen(port,()=>{
  console.log("listening to the port "+port);
});
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

let getRandomUser=()=>{
    return [
      faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
       faker.internet.password(),
    ];
};
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'pass123'
  });
  // let q="insert into user (id,username,email,password) values ?";
  // let users=[];
  // for(let i=0;i<100;i++)
  // {
  //   users.push(getRandomUser());
  // }
  // console.log(users);
  // try{
  //   connection.query(q,[users],(err,result)=>{
  //       if(err)
  //       {
  //           throw err;
  //       }
  //       else{
  //           console.log(result);
  //       }
  //   });
  // }
  // catch(err){
  //   console.log(err);
  // }
  
  // connection.end();

  app.get("/",(req,res)=>{
  let q="select count(*) from user";
    try{
        connection.query(q,(err,result)=>{
            if(err)
            {
                throw err;
               res.send("an error occured");
            }
            else{
                console.log(result);
                let count=result[0]["count(*)"];
                res.render("home.ejs",{count});
            }
        });
      }
      catch(err){
        console.log(err);
      }
  });

  app.get("/user",(req,res)=>{
    let q="select * from user";
    try{
        connection.query(q,(err,result)=>{
            if(err)
            {
                throw err;
               res.send("an error occured");
            }
            else{
                console.log(result);
               
               res.render("users.ejs",{result});
            }
        });
      }
      catch(err){
        console.log(err);
      }
  })

 
app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`;
  try{
    connection.query(q,(err,user)=>{
      if(err)
      {
        res.send("an error occured");
        throw err;
      }
      else{
        res.render("edit.ejs",{user});
      }
    })
  }
  catch(err)
  {
    console.log("the error arised is "+err);
  }
  
  
 
});

app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {password:formPassword,username:formUsername}=req.body;
  let q=`select * from user where id='${id}'`;
  try{
    connection.query(q,(err,user)=>{
      if(err)
      {
        res.send("an error occured");
        throw err;
      }
      else{
       if(user[0].password!=formPassword)
       {
        res.send("WRONG PASSWORD");
       }
       else{
        let query=`update user set username='${formUsername}' where id='${id}'`;
        connection.query(query,(err,result)=>{
          if(err) throw err;
          else{
            // res.send(result);
            res.redirect("/user");
          }
        })
       }
     
      }
      
    })
  }
  catch(err)
  {
    console.log("the error arised is "+err);
  }
})

app.post("/user",(req,res)=>{
 res.render("new user.ejs");
})
app.post("/user/newuser",(req,res)=>{
  let {id,username,email,password}=req.body;
  let q=`insert into user (id,username,email,password) values ('${id}','${username}','${email}','${password}')`;
  
  connection.query(q,(err,result)=>{
    if(err)
    {
      throw err;
    }
    else{
      res.redirect("/user");
      // res.send(result);
    }
  })
})
app.delete("/user/:id/delete",(req,res)=>{
  let {id}=req.params;
  let q=`delete from user where id='${id}'`;
  connection.query(q,(err,result)=>{
    if(err)
    {
      throw err;
    }
    else{
      res.redirect("/user");
    }
  })
})