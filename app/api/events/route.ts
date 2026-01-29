import Event  from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import {v2 as cloudinary} from 'cloudinary';

export async function POST(req: NextRequest){
    try {
        await connectDB();

        const formData = await req.formData();
        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({message:'Invalid Data'}, {status:400})
        }

        const file = formData.get('image') as File;

        if(!file){
            return NextResponse.json({mesagge:'Image file is required'}, {status:400})
        }

        let tags = JSON.parse(formData.get('tags') as string); 
        let agenda = JSON.parse(formData.get('agenda') as string); 



        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        //Upload Image to Cloudinary and get image link in 'uploadedResult' 
        const uploadResult = await new Promise((resolve, reject)=>{
            cloudinary.uploader.upload_stream({resource_type:'image', folder:'DevEvents'}, (error, results) =>{
                if(error) return reject(error);
                resolve(results)
            }).end(buffer)
        }) 

        // store 'uploadedResult' link in event.image database
        event.image =( uploadResult as {secure_url:'string'}).secure_url;

        const createdEvent = await Event.create({
            ...event,
            tags:tags,
            agenda:agenda
        });


        return NextResponse.json({message:'Event Created', event:createdEvent}, {status:201})
        
    } catch (e) {
        console.log(e)
        return NextResponse.json({message:'Event Creation Failed', error: e instanceof Error ? e.message : "Unknown Error"}, {status:500})
    }
}


export async function GET() {
    try {
        await connectDB();

        const events = await Event.find()
        // .sort({createdAt:-1})

        return NextResponse.json({message:'Events Fetched:', events}, {status:200});

    } catch (e) {
        return NextResponse.json({message:'Event fetching failed', error: e instanceof Error ? e.message : "Unknown Error"}, {status:400});
    }
}