import { put } from '@vercel/blob';

export const config = {
    api: {
        bodyParser: { sizeLimit: '10mb' },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        const { image, location } = req.body;

        // 1. Convert the base64 image back into a real file format (a Buffer)
        const base64Data = image.replace(/^data:image\/png;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // 2. Create a unique filename using the current time
        const filename = `photo-${Date.now()}.png`;

        // 3. Upload the image directly to Vercel Blob Storage
        const blob = await put(filename, imageBuffer, {
            access: 'public',
            contentType: 'image/png'
        });

        // 4. Temporarily log the location data (Later, you can add a database here)
        console.log("Client Location:", location);
        console.log("Client Photo URL:", blob.url);

        // 5. Tell the frontend it worked!
        return res.status(200).json({ 
            message: 'Data saved successfully!', 
            imageUrl: blob.url 
        });

    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: 'Server error' });
    }
}