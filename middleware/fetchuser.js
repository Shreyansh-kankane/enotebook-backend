import { verify } from 'jsonwebtoken';
const JWT_SECRET = 'helloAbhi';

const fetchuser=(req,res,next)=>{
    // get the user from the jwt token and add id to req object
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Please authenticate a valid token"})
    }
    try {
        const data=verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).send({error: "Internal server occur"})
    }  
};

export default fetchuser;