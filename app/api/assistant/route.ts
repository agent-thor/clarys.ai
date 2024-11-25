import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const encoder = new TextEncoder();
    const chunks = [
        "Streaming started. ",
        "Here's the first part of the message... ",
        "and now a bit more. ",
        "Continuing to build the response, ",
        "like how ChatGPT streams. ",
        "Almost done! ",
        "Just a little more content here. ",
        "And finally, the end of the response."
    ];

    const stream = new ReadableStream({
        start(controller) {
            let i = 0;
            const interval = setInterval(() => {
                if (i < chunks.length) {
                    controller.enqueue(encoder.encode(chunks[i]));
                    i++;
                } else {
                    clearInterval(interval);
                    controller.close();
                }
            }, 500); // Sends each chunk every 500ms
        },
    });
    
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
    });
}
