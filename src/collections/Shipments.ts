import { CollectionConfig } from 'payload';

export const Shipments: CollectionConfig = {
  slug: 'shipments',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'trackingNumber',
  },
  fields: [
    {
      name: 'trackingNumber',
      label: 'Tracking Number',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ value, originalDoc }) => {
            if (originalDoc?.trackingNumber) return value;
            const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            return `SHIP-${randomCode}`;
          },
        ],
      },
    },
    {
      type: 'group',
      name: 'shipmentDetails',
      label: 'Shipment Details',
      fields: [
        {
          name: 'quantity',
          label: 'Quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'weight',
          label: 'Weight (kg)',
          type: 'text',
          required: true,
        },
        {
          name: 'serviceType',
          label: 'Service Type',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
        },
      ],
    },
    {
      type: 'group',
      name: 'destination',
      label: 'Destination',
      fields: [
        {
          name: 'receiverName',
          label: 'Receiver Name',
          type: 'text',
          required: true,
        },
        {
          name: 'receiverEmail',
          label: 'Receiver Email',
          type: 'email',
          required: true,
        },
        {
          name: 'receiverAddress',
          label: 'Receiver Address',
          type: 'textarea',
        },
        {
          name: 'expectedDeliveryDate',
          label: 'Expected Date of Delivery',
          type: 'date',
        },
      ],
    },
    {
      type: 'group',
      name: 'origin',
      label: 'Origin',
      fields: [
        {
          name: 'senderName',
          label: 'Sender Name',
          type: 'text',
          required: true,
        },
        {
          name: 'location',
          label: 'Location',
          type: 'text',
        },
        {
          name: 'shipmentDate',
          label: 'Shipment Date',
          type: 'date',
        },
      ],
    },
    {
      name: 'trackingHistory',
      label: 'Tracking History',
      type: 'array',
      fields: [
        {
          name: 'date',
          label: 'Date',
          type: 'date',
          
        },
        {
          name: 'location',
          label: 'Location',
          type: 'text',
         
        },
        {
          name: 'remark',
          label: 'Remark',
          type: 'textarea',
          
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          options: [
            { label: 'Shipment Created', value: 'shipment-created' },
            { label: 'Processing at Origin', value: 'processing-origin' },
            { label: 'In Transit', value: 'in-transit' },
            { label: 'Arrived at Destination Country', value: 'arrived-destination-country' },
            { label: 'Processing at Destination', value: 'processing-destination' },
            { label: 'Out for Delivery', value: 'out-for-delivery' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Failed Delivery Attempt', value: 'failed-delivery-attempt' },
            { label: 'Delayed', value: 'delayed' },
            { label: 'Held by Customs', value: 'held-by-customs' },
            { label: 'Awaiting Pickup', value: 'awaiting-pickup' },
            { label: 'Returned to Sender', value: 'returned-to-sender' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Lost', value: 'lost' },
            { label: 'Damaged', value: 'damaged' },
            { label: 'On HOld', value: 'on-hold' }
          ],
        }
        ,
      ],
    },
  ],
};
