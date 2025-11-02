'use client';

import { Button } from "@/components/ui/button";

const serverAddress = "against-footwear.gl.at.ply.gg";
const serverPort = "3841";

export default function Page() {
    const joinServer = () => {
        window.location.href = `minecraft://?addExternalServer=EYE SMP|${serverAddress}:${serverPort}`;
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
            <h1 className="text-4xl font-bold mb-4">Eye SMP</h1>
            <p className="text-muted-foreground text-center mb-6">
                Join the Eye SMP Minecraft server and start your adventure!
            </p>
            <Button
                size="lg"
                onClick={joinServer}
                className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
                Join Eye SMP
            </Button>
            <div className="mt-4 text-sm text-muted-foreground text-center">
                <p>Server Address: {serverAddress}</p>
                <p>Port: {serverPort}</p>
            </div>
        </main>
    );
}
