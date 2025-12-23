import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN!,
    },
});

// Whitelist allowed file types
const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
    try {
        const { fileName, fileType, fileSize } = await req.json();

        // Validation
        if (!fileName || !fileType) {
            return NextResponse.json(
                { error: "Missing file info" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!ALLOWED_FILE_TYPES.includes(fileType)) {
            return NextResponse.json(
                { error: "File type not allowed" },
                { status: 400 }
            );
        }

        // Validate file size (optional, if passed from client)
        if (fileSize && fileSize > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File too large" },
                { status: 400 }
            );
        }

        // Sanitize filename - remove special characters
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `vehicles/${crypto.randomUUID()}-${sanitizedFileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            ContentType: fileType,
            // Optional: Add metadata
            Metadata: {
                'uploaded-at': new Date().toISOString(),
            },
        });

        const uploadUrl = await getSignedUrl(s3, command, {
            expiresIn: 300, // 5 minutes - more reasonable than 60s
        });

        return NextResponse.json({
            uploadUrl,
            key,
        });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json(
            { error: "Failed to generate upload URL" },
            { status: 500 }
        );
    }
}