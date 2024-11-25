import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(reg: Request) {
    const encoder = new TextEncoder();
    const words = [
        "Streaming", 
        "started.", 
        "Here's", 
        "the", 
        "first", 
        "part", 
        "of", 
        "the", 
        "message...", 
        "and", 
        "now", 
        "a", 
        "bit", 
        "more.", 
        "Almost", 
        "done!"
    ];

    const stream = new ReadableStream({
        start(controller) {
            let i = 0;
            const interval = setInterval(() => {
                if (i < words.length) {
                    const chunk = '0:"' + words[i] + '"'; 
                    controller.enqueue(encoder.encode(`${chunk}\n`)); // Send each word as JSON
                    i++;
                } else {
                    clearInterval(interval);
                    controller.close();
                }
            }, 500); // Sends a chunk every 500ms
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
    });
}
