import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN!,
    },
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
        return NextResponse.json(
            { error: "Missing image key" },
            { status: 400 }
        );
    }

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
        });

        const url = await getSignedUrl(s3, command, {
            expiresIn: 300, // 5 minutes
        });

        return NextResponse.json({ url });
    } catch (err) {
        console.error("Failed to generate presigned GET:", err);
        return NextResponse.json(
            { error: "Failed to generate image URL" },
            { status: 500 }
        );
    }
}
