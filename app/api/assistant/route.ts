import { NextResponse } from 'next/server';

export async function POST() {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(encoder.encode('Streaming started...\n'));
            let count = 1;
            const interval = setInterval(() => {
                controller.enqueue(encoder.encode(`Message ${count++}\n`));
                if (count > 15) {
                    clearInterval(interval);
                    controller.close();
                }
            }, 500);
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
    });
}
