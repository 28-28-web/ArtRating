import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const { publicId, artId } = await request.json();

    if (!publicId || !artId) {
      return NextResponse.json(
        { error: "Missing publicId or artId" },
        { status: 400 }
      );
    }

    // Generate signed URL with 5 minutes expiry
    const timestamp = Math.round(new Date().getTime() / 1000) + 300; // 5 minutes from now
    
    // Add transformation for watermark and security
    const transformation = [
      { 
        overlay: {
          font_family: "Arial",
          font_size: 12,
          font_weight: "bold",
          text: `${artId}%20artrating.art`,
          opacity: 15
        },
        gravity: "center",
        angle: -45,
        crop: "scale"
      },
      { quality: "auto:good" },
      { fetch_format: "auto" },
      { secure: true }
    ];

    const signature = cloudinary.utils.api_sign_request(
      {
        public_id: publicId,
        timestamp: timestamp,
        transformation: transformation.join("/")
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    const signedUrl = cloudinary.url(publicId, {
      secure: true,
      timestamp: timestamp,
      transformation: transformation,
      signature: signature,
      sign_url: true
    });

    return NextResponse.json({
      url: signedUrl,
      expiresAt: new Date(timestamp * 1000).toISOString()
    });

  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}
