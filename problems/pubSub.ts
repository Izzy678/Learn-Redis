import { Redis } from "ioredis";
import { REDIS_URL } from "../config/config";

const publisherClient = new Redis(REDIS_URL);
const suscriberClient = new Redis(REDIS_URL);
const CHANNEL_NAME = "my channel";

suscriberClient.subscribe(CHANNEL_NAME, (error) => {
  if (error) {
    console.log(
      `failed to subscribe to ${CHANNEL_NAME},with error:${error.message}`
    );
  }
});

suscriberClient.on('message',(channelName,message)=>{
  console.log(`${new Date()}: Got message: ${message} from channel ${channelName}`);
})

setInterval(()=>{
    publisherClient.publish(CHANNEL_NAME, "hi hello");
},2000)