import {Hono} from "hono"
import {v4 as uuidv4} from "uuid"
import { stream, streamText, streamSSE } from 'hono/streaming'

const app = new Hono()




let videos = []


app.get("/", (c)=>{
    return c.html("<h2>Welcome to Hono JS</h2>")
})


app.post("/addVideos", async (c)=>{
    const {videoTitle, videoDescription, channelName, duration} = await c.req.json()
    const newVideo = {
        id: uuidv4(),
        videoTitle,
        videoDescription,
        channelName,
        duration
    }
    videos.push(newVideo)
    console.log(videos);
    return c.json(newVideo)
})

// stream the data 
app.get("/allVideos",async (c) =>{
    return streamText(c, async(stream) =>{

        stream.onAbort(() => {
            console.log('Aborted!')
        })

        for(let video of videos){
            await stream.writeln(JSON.stringify(video))
        }
    })
})


export default app