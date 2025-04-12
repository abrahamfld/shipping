import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const GET = async (
  req: NextRequest,
  context: { params: Record<string, string> }
) => {
  const trackingNumber = context.params.trackingNumber;

  try {
    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
      collection: 'shipments',
      where: {
        trackingNumber: {
          equals: trackingNumber,
        },
      },
    });

    if (result.totalDocs === 0) {
      return NextResponse.json(
        { success: false, message: 'Shipment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      shipment: result.docs[0],
    });
  } catch (error: any) {
    console.error('Error fetching shipment:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch shipment',
        error: error.message,
      },
      { status: 500 }
    );
  }
};
