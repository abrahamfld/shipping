import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type { NextRequest as ReqType } from 'next/server';

type Context = {
  params: {
    trackingNumber: string;
  };
};

export async function GET(req: ReqType, { params }: Context) {
  const trackingNumber = params.trackingNumber;

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
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching shipment:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch shipment',
        error: message,
      },
      { status: 500 }
    );
  }
}
