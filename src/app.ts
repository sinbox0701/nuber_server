import {GraphQLServer, PubSub} from "graphql-yoga";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";
import {NextFunction, Response} from "express";

class App{
    public app: GraphQLServer;
    public pubSub: any;
    constructor() {
        this.pubSub = new PubSub();//demo --> changed Redies or Mamcached later
        this.pubSub.ee.setMaxListeners(99);//resolve memory leak in pubsub
        this.app = new GraphQLServer({
            schema,
            context: req => { // go to all resolvers
                const {connection:{context = null} = {}} = req;
                return {
                    req: req.request,
                    pubSub: this.pubSub,
                    context
                };
            }
        });
        this.middlewares();
    }
    private middlewares = () : void => {
        this.app.express.use(cors());
        this.app.express.use(logger("dev"));
        this.app.express.use(helmet());
        this.app.express.use(this.jwt);
    };

    //request, response, argument를 미들웨어의 인자로 받을 수 있음
    private jwt = async(req, res:Response, next:NextFunction): Promise<void> =>{
        const token = req.get("X-JWT");
        if(token){
            const user = await decodeJWT(token);
            if(user){
                req.user = user; // request connect new user property
            }else {
                req.user=undefined;
            }
        }
        next();
    };
}

export default new App().app;
