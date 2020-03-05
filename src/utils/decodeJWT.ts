//open token --> find id --> get user with find_id --> back middeleware
import jwt from "jsonwebtoken";
import User from "../entities/User";

//don't have User, return undefined
const decodeJWT = async (token: string): Promise<User|undefined> =>{
    try {
        const decoded: any = jwt.verify(token,process.env.JWT_TOKEN||"");
        const {id} = decoded;
        const user = await User.findOne({id});
        return user;
    }catch (error) {
        return undefined;
    }
};

export default decodeJWT;
