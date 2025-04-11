import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const GET = async (req: NextRequest) => {
  try {
    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
      collection: 'shipments',
      depth: 1,
    });

    return NextResponse.json({
      success: true,
      shipments: result.docs,
    });
  } catch (error: any) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch shipments',
        error: error.message,
      },
      { status: 500 }
    );
  }
};
