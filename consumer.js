//for all env variables imports
require("dotenv").config();

//setting up kafka
const kafka=require("./kafka"); 

//creating a consumer
const consumer = kafka.consumer({ groupId: process.env.TOPIC, retries: Number.MAX_VALUE  });

// import library to serialize Events Data
var serialize = require('serialize-javascript');


async function consumeEvent (redis)
{
    try {
        //connection a producer
        await consumer.connect();

        //subcribing the topic to consume data
        await consumer.subscribe({ topic: process.env.TOPIC});

        //consuming data
        await consumer.run({
          eachBatchAutoResolve: false,
          eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
              for (let message of batch.messages) {
                  if (!isRunning() || isStale())
                  {
                    break;
                  } 

                  console.log(`Consumed event from topic ${batch.topic}: value = ${message.value}`);
                  let _value = JSON.parse(message.value.toString());

                  //push event to redis queue
                  await redis.client.RPUSH(process.env.GRAPHQLREDISQUEUE,serialize({obj:_value}));
                  console.log("Event pushed to queue...");

                  //committing offset
                  resolveOffset(message.offset);
                  await heartbeat();
                  console.log("Offset Committed...");
                  console.log("Heartbeat Signaled...");
              }
          }
        });

        process.on('SIGINT', () => {
          console.log('\nDisconnecting consumer and shutting down Graphql backend ...');
          consumer.disconnect();
          process.exit(0);
        });
    } 
    catch (error) {
        console.error('Error listening message', error)
    }
}

module.exports = {consumeEvent};