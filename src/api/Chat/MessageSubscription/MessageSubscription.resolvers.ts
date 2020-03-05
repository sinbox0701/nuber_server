import {withFilter} from "graphql-yoga";
import User from "../../../entities/User";
import Chat from "../../../entities/Chat";

const resolvers = {
    Subscription:{
        MessageSubscription:{
            //withFilter --> payload를 받아 이 payload가 사용자에게 전달될지 선택가능
            subscribe: withFilter((_,__,{pubSub}) => pubSub.asyncIterator("newChatMessage"),
                async (payload, _, {context}) => {
                    const user:User = context.currentUser;
                    const {MessageSubscription:{chatId}} = payload;
                    try {
                        const chat = await Chat.findOne({id:chatId});
                        if(chat){
                            return chat.driverId === user.id || chat.passengerId === user.id;
                        }else {
                            return false;
                        }
                    }catch (error) {
                        return false;
                    }
                    const {lastLat:userLastLat, lastLng:userLastLng}= user;

                }
            )
        }
    }
};

export default resolvers;
