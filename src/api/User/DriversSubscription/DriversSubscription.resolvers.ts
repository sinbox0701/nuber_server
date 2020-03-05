import {withFilter} from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
    Subscription:{
        DriversSubscription:{
            //withFilter --> payload를 받아 이 payload가 사용자에게 전달될지 선택가능
            subscribe: withFilter((_,__,{pubSub}) => pubSub.asyncIterator("driverUpdate"),
                (payload, _, {context}) => {
                    const user:User = context.currentUser;
                    const {DriversSubscription:{lastLat:driverLastLat, lastLng:driverLastLng}} = payload;
                    const {lastLat:userLastLat, lastLng:userLastLng}= user;
                    return (
                        driverLastLat >= userLastLat - 0.05 &&
                        driverLastLat <= userLastLat + 0.05 &&
                        driverLastLng >= userLastLng - 0.05 &&
                        driverLastLng <= userLastLng + 0.05
                    );
                }
            )
        }
    }
};

export default resolvers
