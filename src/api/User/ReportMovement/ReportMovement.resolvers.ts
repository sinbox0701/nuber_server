import {Resolvers} from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import {ReportMovementMutationArgs, ReportMovementResponse} from "../../../types/graph";
import User from "../../../entities/User";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
    Mutation:{
        ReportMovement: privateResolver(async (_,args:ReportMovementMutationArgs,{req, pubSub}):
        Promise<ReportMovementResponse>=>{
            const user:User = req.user;
            const notNull:any = cleanNullArgs(args);
            try {
                await User.update({id:user.id},{...notNull});
                const updatedUser = await User.findOne({id:user.id});
                pubSub.publish("driverUpdate",{DriverSubscription:updatedUser});
                //payload에 적은 key값은 graphql의 type subscription 안에 적은 내용과 같아야 함
                return {
                    ok:true,
                    error:null
                };
            }catch (error) {
                return {
                    ok:false,
                    error:error.message
                };
            }

        })
    }
};

export default resolvers;
