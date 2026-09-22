import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerEmail',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'productId', title: 'Product ID', type: 'string' }),
            defineField({ name: 'name', title: 'Product Name', type: 'string' }),
            defineField({ name: 'price', title: 'Price', type: 'number' }),
            defineField({ name: 'quantity', title: 'Quantity', type: 'number' }),
            defineField({ name: 'image', title: 'Image URL', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'total',
      title: 'Total (PKR)',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Cash on Delivery', value: 'cod' },
          { title: 'Bank Transfer', value: 'bank' },
        ],
      },
      initialValue: 'cod',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      status: 'status',
      total: 'total',
    },
    prepare({ title, status, total }) {
      return {
        title: title || 'Unknown customer',
        subtitle: `${status?.toUpperCase()} — Rs. ${total?.toLocaleString() ?? 0}`,
      };
    },
  },
});
