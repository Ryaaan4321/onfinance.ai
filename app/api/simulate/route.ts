import { runSimulation } from "@/lib/simulationEngine";
import {badRequest, created,notFound,serverError} from '@/lib/apiResponse'
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    try{
        const {scenarioId}=await req.json();
        if(!scenarioId){
            return badRequest("scenarioId is required")
        }
        const result=await runSimulation(scenarioId);
        return created(result);
    }catch(e){
        serverError(e);
    }
}