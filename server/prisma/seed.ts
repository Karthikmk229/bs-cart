import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with Stitch mock details...');

  // 0. Clear existing data in correct order
  console.log('Cleaning existing data...');
  await prisma.refreshToken.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.pincodeServiceability.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.deliverySlot.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Admin & Customer Users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@freshmed.in',
      phone: '9876543210',
      name: 'FreshMed Admin',
      passwordHash,
      role: 'admin',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@gmail.com',
      phone: '9999999999',
      name: 'Thor',
      passwordHash,
      role: 'customer',
    },
  });

  console.log('Created users:', { adminId: admin.id, customerId: customer.id });

  // 2. Create Warehouses
  const chennaiWh = await prisma.warehouse.create({
    data: {
      id: 'chennai-wh-1',
      name: 'Chennai Central Warehouse',
      addressLine1: '12, Poonamallee High Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
    },
  });

  const tenkasiWh = await prisma.warehouse.create({
    data: {
      id: 'tenkasi-wh-1',
      name: 'Tenkasi Hub Warehouse',
      addressLine1: '45, Kourtallam Road',
      city: 'Tenkasi',
      state: 'Tamil Nadu',
      pincode: '627402',
    },
  });

  console.log('Created warehouses:', [chennaiWh.name, tenkasiWh.name]);

  // 3. Create Pincode Serviceability
  // 600001 (Chennai)
  await prisma.pincodeServiceability.create({
    data: {
      pincode: '600001',
      warehouseId: chennaiWh.id,
      deliveryCharge: 30,
      estimatedDeliveryDays: 1,
      isCodAvailable: true,
    },
  });

  // 627402 (Asgardsamudram - Thor's Home)
  await prisma.pincodeServiceability.create({
    data: {
      pincode: '627402',
      warehouseId: tenkasiWh.id,
      deliveryCharge: 0, // FREE delivery as shown in checkout
      estimatedDeliveryDays: 1,
      isCodAvailable: true,
    },
  });

  // 627808 (Tenkasi - Karthik's Work)
  await prisma.pincodeServiceability.create({
    data: {
      pincode: '627808',
      warehouseId: tenkasiWh.id,
      deliveryCharge: 30,
      estimatedDeliveryDays: 1,
      isCodAvailable: true,
    },
  });

  console.log('Created pincode serviceability for 600001, 627402, 627808');

  // 4. Create Addresses for customer
  const addressHome = await prisma.address.create({
    data: {
      userId: customer.id,
      type: 'home',
      addressLine1: 'No. 42, Odin Salai',
      addressLine2: 'Loki LIC Building',
      landmark: 'Near Bifrost',
      city: 'Asgardsamudram',
      district: 'Tenkasi',
      state: 'Tamil Nadu',
      pincode: '627402',
      isDefault: true,
    },
  });

  const addressWork = await prisma.address.create({
    data: {
      userId: customer.id,
      type: 'work',
      addressLine1: 'No. 10, Bharathiyar Street',
      addressLine2: 'Near Town Hall',
      city: 'Tenkasi',
      district: 'Tenkasi',
      state: 'Tamil Nadu',
      pincode: '627808',
      isDefault: false,
    },
  });

  console.log('Created saved addresses for Thor');

  // 5. Create Categories
  const categoriesToSeed = [
    { slug: 'fruits', name: 'Fruits', taxRate: 5, type: 'grocery' },
    { slug: 'vegetables', name: 'Fresh Vegetables', taxRate: 5, type: 'grocery' },
    { slug: 'dairy', name: 'Dairy', taxRate: 5, type: 'grocery' },
    { slug: 'staples', name: 'Staples', taxRate: 5, type: 'grocery' },
    { slug: 'medicines', name: 'Medicines', taxRate: 12, type: 'medical' },
    { slug: 'personalcare', name: 'Personal Care', taxRate: 18, type: 'grocery' },
  ];

  const categoriesMap: { [slug: string]: string } = {};

  for (const cat of categoriesToSeed) {
    const createdCat = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        taxRate: cat.taxRate,
        productType: cat.type,
      },
    });
    categoriesMap[cat.slug] = createdCat.id;
  }

  console.log('Created categories:', Object.keys(categoriesMap));

  // 6. Create Products
  const productsToSeed = [
    // Fruits
    {
      name: 'Fresh Shimla Apple (Organic)',
      slug: 'fresh-shimla-apple-organic',
      brand: 'Nilgiris Harvest',
      mrp: 200,
      sellingPrice: 180,
      unit: '1kg',
      imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=600',
      category: 'fruits',
      requiresPrescription: false,
      productType: 'grocery',
    },
    // Vegetables
    {
      name: 'Onion',
      slug: 'onion',
      brand: 'Local Farms',
      mrp: 80,
      sellingPrice: 72,
      unit: '250g',
      imageUrl: 'https://images.unsplash.com/photo-1508747705-3de1b76db3a8?auto=format&fit=crop&q=80&w=600',
      category: 'vegetables',
      requiresPrescription: false,
      productType: 'grocery',
    },
    {
      name: 'Fresh Green Broccoli',
      slug: 'fresh-green-broccoli',
      brand: 'Ooty Farms',
      mrp: 95,
      sellingPrice: 85,
      unit: '500g',
      imageUrl: 'https://images.unsplash.com/photo-1584008272863-146c006770cf?auto=format&fit=crop&q=80&w=600',
      category: 'vegetables',
      requiresPrescription: false,
      productType: 'grocery',
    },
    {
      name: 'Local Hybrid Carrot',
      slug: 'local-hybrid-carrot',
      brand: 'Bio-Fresh',
      mrp: 80,
      sellingPrice: 70,
      unit: '1kg',
      imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=600',
      category: 'vegetables',
      requiresPrescription: false,
      productType: 'grocery',
    },
    // Dairy
    {
      name: 'Fresh Organic Milk',
      slug: 'fresh-organic-milk',
      brand: 'Aavin',
      mrp: 60,
      sellingPrice: 50,
      unit: '500ml',
      imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=600',
      category: 'dairy',
      requiresPrescription: false,
      productType: 'grocery',
    },
    // Staples
    {
      name: 'Organic Brown Rice',
      slug: 'organic-brown-rice',
      brand: 'Bio-Fresh',
      mrp: 60,
      sellingPrice: 54,
      unit: '1kg',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
      category: 'staples',
      requiresPrescription: false,
      productType: 'grocery',
    },
    {
      name: 'Aachi Idly Podi',
      slug: 'aachi-idly-podi',
      brand: 'Aachi',
      mrp: 160,
      sellingPrice: 20,
      unit: '500g',
      imageUrl: 'https://images.unsplash.com/photo-1584008272863-146c006770cf?auto=format&fit=crop&q=80&w=600',
      category: 'staples',
      requiresPrescription: false,
      productType: 'grocery',
    },
    // Medicines
    {
      name: 'Vitamin C Gummies',
      slug: 'vitamin-c-gummies',
      brand: 'Himalaya',
      mrp: 120,
      sellingPrice: 108,
      unit: '30 Tablets',
      imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600',
      category: 'medicines',
      requiresPrescription: false,
      productType: 'medical',
    },
    {
      name: 'Multi-Vitamin Complex (Gold)',
      slug: 'multi-vitamin-complex-gold',
      brand: 'Cipla',
      mrp: 499,
      sellingPrice: 499,
      unit: '60 Capsules',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
      category: 'medicines',
      requiresPrescription: true,
      productType: 'medical',
    },
    {
      name: 'Paracetamol 500mg Tablet',
      slug: 'paracetamol-500mg-tablet',
      brand: 'Cipla',
      mrp: 20,
      sellingPrice: 15,
      unit: '10 Strip',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
      category: 'medicines',
      requiresPrescription: false,
      productType: 'medical',
    },
    // Personal Care
    {
      name: 'Nivea Face Wash',
      slug: 'nivea-face-wash',
      brand: 'Nivea',
      mrp: 250,
      sellingPrice: 199,
      unit: '150ml',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
      category: 'personalcare',
      requiresPrescription: false,
      productType: 'grocery',
    },
  ];

  const variantMap: { [productSlug: string]: string } = {};

  for (const item of productsToSeed) {
    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        description: `Premium quality ${item.name} from verified manufacturers. Aligns with standard medical and grocery parameters.`,
        categoryId: categoriesMap[item.category],
        brand: item.brand,
        hsnCode: '07099900',
        gstPercent: item.category === 'medicines' ? 12 : 5,
        mrp: item.mrp,
        sellingPrice: item.sellingPrice,
        unit: item.unit,
        imageUrls: JSON.stringify([item.imageUrl]),
        productType: item.productType,
        requiresPrescription: item.requiresPrescription,
        isPerishable: item.category === 'vegetables' || item.category === 'fruits' || item.category === 'dairy',
        shelfLifeDays: 5,
        storageCondition: 'ambient',
        manufacturer: item.brand,
        countryOfOrigin: 'India',
        createdBy: admin.id,
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: `${item.slug}-default`,
        size: item.unit,
        isDefault: true,
      },
    });

    variantMap[item.slug] = variant.id;

    // Create inventories in both warehouses
    const batchExpiry = new Date();
    batchExpiry.setFullYear(batchExpiry.getFullYear() + 1); // expires in 1 year

    for (const whId of [chennaiWh.id, tenkasiWh.id]) {
      await prisma.inventory.create({
        data: {
          productVariantId: variant.id,
          warehouseId: whId,
          batchNo: 'B-STITCH-001',
          expiryDate: batchExpiry,
          quantity: 200,
        },
      });
    }
  }

  console.log('Seeded products and variants successfully.');

  // 7. Seed Delivery Slots for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const slotTimes = [
    { start: '08:00 AM', end: '11:00 AM' },
    { start: '02:00 PM', end: '05:00 PM' },
    { start: '06:00 PM', end: '09:00 PM' },
  ];

  let selectedSlotId = '';

  for (const time of slotTimes) {
    const slot = await prisma.deliverySlot.create({
      data: {
        warehouseId: tenkasiWh.id,
        pincodes: JSON.stringify(['627402', '627808']),
        deliveryDate: today,
        startTime: time.start,
        endTime: time.end,
        maxOrders: 30,
        currentOrders: 0,
      },
    });
    if (time.start === '08:00 AM') {
      selectedSlotId = slot.id;
    }
  }

  console.log('Seeded delivery slots for Tenkasi warehouse.');

  // 8. Create Cart for Customer
  const cart = await prisma.cart.create({
    data: {
      userId: customer.id,
    },
  });

  // Seed cart items matching checkout mockup:
  // - Multi-Vitamin Complex (Gold) (Qty: 1)
  // - Fresh Shimla Apple (Organic) (Qty: 2)
  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productVariantId: variantMap['multi-vitamin-complex-gold'],
      quantity: 1,
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productVariantId: variantMap['fresh-shimla-apple-organic'],
      quantity: 2,
    },
  });

  console.log('Seeded customer cart items.');

  // 9. Seed a verified prescription for the user
  const prescription = await prisma.prescription.create({
    data: {
      userId: customer.id,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200',
      doctorName: 'Dr. Stephen Strange',
      issueDate: today,
      status: 'approved',
      adminRemarks: 'Verified by FreshMed Pharmacist',
      reviewedBy: admin.id,
      reviewedAt: new Date(),
    },
  });

  console.log('Seeded approved prescription for customer.');

  // 10. Seed a Historical Order for Customer
  const orderDate = new Date();
  orderDate.setDate(orderDate.getDate() - 2);

  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      addressId: addressHome.id,
      orderNumber: 'BS-9918',
      status: 'delivered',
      subTotal: 820.00,
      discountAmount: 80.00,
      taxAmount: 38.94,
      deliveryCharge: 0.00,
      total: 817.94,
      paymentMethod: 'upi',
      paymentStatus: 'success',
      prescriptionId: prescription.id,
      deliverySlotId: selectedSlotId,
      notes: 'Please leave near front gate.',
      createdAt: orderDate,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productVariantId: variantMap['multi-vitamin-complex-gold'],
      productName: 'Multi-Vitamin Complex (Gold)',
      brand: 'Cipla',
      size: '60 Capsules',
      hsnCode: '30049099',
      gstPercent: 12,
      quantity: 1,
      unitPrice: 499.00,
      totalPrice: 499.00,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productVariantId: variantMap['fresh-shimla-apple-organic'],
      productName: 'Fresh Shimla Apple (Organic)',
      brand: 'Nilgiris Harvest',
      size: '1kg',
      hsnCode: '08081000',
      gstPercent: 5,
      quantity: 2,
      unitPrice: 180.00,
      totalPrice: 360.00,
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: 817.94,
      method: 'upi',
      transactionId: 'TXN-PHNPE-8392193',
      gateway: 'razorpay',
      status: 'success',
      gatewayResponse: JSON.stringify({ status: 'captured' }),
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: order.id,
      fromStatus: 'pending',
      toStatus: 'delivered',
      changedBy: admin.id,
      comment: 'Delivered by delivery agent Arjun K.',
      createdAt: orderDate,
    },
  });

  console.log('Seeded historical order BS-9918.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
