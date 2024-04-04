import { Redis } from "ioredis";
import { REDIS_URL } from "../config/config";

const client = new Redis(REDIS_URL);

async function flushall() {
  await client.flushall();
}

async function RateLimiter(
  userId: string,
  maxRequest: number,
  windowSizeInSecond: number
) {
  const key = `rateLimit: ${userId}`;
  const current = await client
    .multi()
    .incr(key)
    .expire(key, windowSizeInSecond)
    .exec();

    if(!current||current.length===0){
        return false;
    }
    for(let i=0; i<current.length; i++){
        if(current[i][0]){
            console.log(`redis error:${current[i][0]}`);
            return false;
        }
    }
    const requestCount = current[0][1] as number
    if(requestCount>maxRequest){
     return false;
    }
    return true;
}
async function doSomeWork() {
    const succeded = await RateLimiter("some-user-Id",5,5);
    if(!succeded){
        throw new Error("Rate Limit exceeded");
    }
    return "success"
}

for (let i = 0; i < 10; i++) {
  doSomeWork()
    .then(() => {
      console.log(`Request ${i} succeded`);
    })
    .catch((error) => {
      console.log(`Request ${i} failed with error: ${error.message}`);
    });
}
