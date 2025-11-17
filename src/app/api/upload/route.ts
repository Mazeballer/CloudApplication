import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json(
            { error: "No file uploaded" },
            { status: 400 }
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `vehicle-${Date.now()}-${file.name}`;

    // Upload to bucket
    const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
        });

    if (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Image upload failed" },
            { status: 500 }
        );
    }

    // Get the PUBLIC URL
    const { data: publicUrl } = supabase.storage
        .from("product-images")
        .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl.publicUrl });
}
