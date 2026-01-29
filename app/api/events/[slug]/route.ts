import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// Type definition for route parameters
interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET handler to fetch event details by slug
 * @param req - NextRequest object
 * @param params - Route parameters containing slug
 * @returns JSON response with event data or error message
 */
export async function GET(
  req: NextRequest,
  { params }: {params: Promise<{slug:String}>}
): Promise<NextResponse> {
  try {
    // Validate slug parameter
    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter" },
        { status: 400 }
      );
    }

    // Trim and validate slug is not empty after trimming
    const trimmedSlug = slug.trim();
    if (!trimmedSlug) {
      return NextResponse.json(
        { message: "Slug cannot be empty" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event = await Event.findOne({ slug: trimmedSlug });

    // Return 404 if event not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug "${trimmedSlug}" not found` },
        { status: 404 }
      );
    }

    // Return event data with 200 status
    return NextResponse.json(
      {
        message: "Event retrieved successfully",
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event:", error);

    // Handle database connection errors
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { message: "Database connection error" },
        { status: 500 }
      );
    }

    // Handle other unexpected errors
    return NextResponse.json(
      {
        message: "Failed to fetch event",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
