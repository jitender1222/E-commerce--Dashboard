const express=require('express');
const cors=require('cors');
require('./db/config');
const product=require("./db/Product");

const user=require('./db/user');
const app=express();

app.use(express.json());
app.use(cors());

app.post('/register', async (req,res)=>{
    let use=new user(req.body);
    let result= await use.save();
    result=result.toObject();
    delete result.password; 
    res.send(result);
})
app.post('/login',async (req,res)=>{
    let userData=await user.findOne(req.body).select('-password');
    if(req.body){
        
    if(userData){
        res.send(user);
    }else{
        res.send({result:"no user data found"});
    }
    }else{
        res.send({result:"no user data found"});
    }
})

app.post('/add-product',async (req,res)=>{
    let acceptData=new product(req.body);
    let productData=await acceptData.save();
    res.send(productData);
}) 

app.get('/products',async (req,res)=>{
    let products=await product.find();
    if(products.length>0){
        res.send(products);
    }
    else{
        res.send({result:"no data found "});
    }
})
app.delete('/product/:id',async (req,res)=>{
    const result=await product.deleteOne({_id:req.params.id});
    res.send(result);
})


/////////////////////// for upadte of one product ////////////////////////////

app.get('/product/:id',async (req,res)=>{
    let result=await product.findOne({_id:req.params.id});
    if(result){
        res.send(result);
    }
    else{
        res.send({result:"No data found"});
    }
})

app.put('/product/:id',async (req,res)=>{
    let result=await product.updateOne(
        {_id:req.params.id},
        {
            $set:req.body
        }
    )
    res.send(result);
});

app.get("/search/:key", async (req,res)=>{
    let result=await product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {price:{$regex:req.params.key}},
            {category:{$regex:req.params.key}},
            {company:{$regex:req.params.key}}
        ]
    });
    res.send(result);
})

app.listen(5000);