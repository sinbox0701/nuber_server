import {Resolvers} from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import {UpdateMyProfileMutationArgs, UpdateMyProfileResponse} from "../../../types/graph";
import User from "../../../entities/User";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
    Mutation: {
        UpdateMyProfile: privateResolver(async (_, args:UpdateMyProfileMutationArgs, {req})
            : Promise<UpdateMyProfileResponse> =>{
            const user: User = req.user;
            const notNull:any = cleanNullArgs(args);
            Object.keys(args).forEach(key => {
                if(args[key]!==null){
                    notNull[key] = args[key];
                }
            });
            try {
                if(notNull.password!==null){
                    user.password=notNull.password;
                    user.save();
                    delete notNull.password;
                }
                await User.update({id:user.id},{...notNull});
                return {
                    ok:true,
                    error:null
                };
            }catch (error) {
                return{
                  ok:true,
                  error:error.message
                };

            }
        })
    }
};

export default resolvers;
