import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function escapeSql(value: any): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  }
  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  return String(value);
}

async function exportTable(modelName: string, dbTableName: string, columns: string[]): Promise<string> {
  const records = await (prisma as any)[modelName].findMany();
  if (records.length === 0) return '';

  let sql = `-- Data for ${dbTableName}\n`;
  for (const record of records) {
    const values = columns.map(col => {
      // Handle camelCase to snake_case mappings if any, but since Prisma model fields might be camelCase:
      // Let's find the field name on the record.
      // We will look up both camelCase and snake_case keys in record.
      const camelKey = col.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      const value = record[camelKey] !== undefined ? record[camelKey] : record[col];
      return escapeSql(value);
    });
    sql += `INSERT INTO "${dbTableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')});\n`;
  }
  return sql + '\n';
}

async function main() {
  let sqlDump = '-- Generated Data Migration SQL\n\n';

  // Order is important due to foreign keys!
  const tables = [
    { model: 'user', table: 'users', cols: ['id', 'phone', 'email', 'name', 'password_hash', 'role', 'is_active', 'created_at', 'updated_at'] },
    { model: 'address', table: 'addresses', cols: ['id', 'user_id', 'type', 'address_line1', 'address_line2', 'landmark', 'city', 'district', 'state', 'pincode', 'lat', 'lng', 'is_default', 'created_at', 'updated_at'] },
    { model: 'warehouse', table: 'warehouses', cols: ['id', 'name', 'address_line1', 'city', 'state', 'pincode', 'is_active', 'created_at', 'updated_at'] },
    { model: 'deliverySlot', table: 'delivery_slots', cols: ['id', 'warehouse_id', 'pincodes', 'delivery_date', 'start_time', 'end_time', 'max_orders', 'current_orders', 'is_active', 'created_at', 'updated_at'] },
    { model: 'category', table: 'categories', cols: ['id', 'name', 'slug', 'parent_id', 'image', 'tax_rate', 'product_type', 'is_active', 'sort_order', 'created_at', 'updated_at'] },
    { model: 'product', table: 'products', cols: ['id', 'name', 'slug', 'description', 'category_id', 'brand', 'hsn_code', 'gst_percent', 'mrp', 'selling_price', 'unit', 'image_urls', 'product_type', 'requires_prescription', 'is_perishable', 'shelf_life_days', 'storage_condition', 'manufacturer', 'country_of_origin', 'is_active', 'created_by', 'created_at', 'updated_at'] },
    { model: 'productVariant', table: 'product_variants', cols: ['id', 'product_id', 'sku', 'size', 'price_override', 'is_default', 'created_at', 'updated_at'] },
    { model: 'inventory', table: 'inventory', cols: ['id', 'product_variant_id', 'warehouse_id', 'batch_no', 'expiry_date', 'quantity', 'updated_at'] },
    { model: 'pincodeServiceability', table: 'pincode_serviceability', cols: ['id', 'pincode', 'warehouse_id', 'delivery_charge', 'estimated_delivery_days', 'is_cod_available', 'is_active'] },
    { model: 'prescription', table: 'prescriptions', cols: ['id', 'user_id', 'image_url', 'doctor_name', 'issue_date', 'status', 'admin_remarks', 'reviewed_by', 'uploaded_at', 'reviewed_at'] },
    { model: 'cart', table: 'carts', cols: ['id', 'user_id', 'created_at', 'updated_at'] },
    { model: 'cartItem', table: 'cart_items', cols: ['id', 'cart_id', 'product_variant_id', 'quantity', 'added_at'] },
    { model: 'coupon', table: 'coupons', cols: ['id', 'code', 'discount_type', 'discount_value', 'min_order_value', 'max_discount', 'applies_to', 'category_id', 'product_id', 'valid_from', 'valid_to', 'usage_limit', 'per_user_limit', 'is_active', 'created_at', 'updated_at'] },
    { model: 'order', table: 'orders', cols: ['id', 'user_id', 'address_id', 'order_number', 'status', 'sub_total', 'discount_amount', 'tax_amount', 'delivery_charge', 'total', 'payment_method', 'payment_status', 'prescription_id', 'coupon_id', 'delivery_slot_id', 'notes', 'created_at', 'updated_at'] },
    { model: 'couponUsage', table: 'coupon_usages', cols: ['id', 'coupon_id', 'user_id', 'order_id', 'used_at'] },
    { model: 'orderItem', table: 'order_items', cols: ['id', 'order_id', 'product_variant_id', 'product_name', 'brand', 'size', 'hsn_code', 'gst_percent', 'quantity', 'unit_price', 'total_price', 'created_at', 'updated_at'] },
    { model: 'orderStatusHistory', table: 'order_status_history', cols: ['id', 'order_id', 'from_status', 'to_status', 'changed_by', 'comment', 'created_at'] },
    { model: 'payment', table: 'payments', cols: ['id', 'order_id', 'amount', 'method', 'transaction_id', 'gateway', 'status', 'gateway_response', 'created_at', 'updated_at'] },
    { model: 'productReview', table: 'product_reviews', cols: ['id', 'user_id', 'product_id', 'order_item_id', 'rating', 'review_text', 'is_approved', 'created_at'] },
    { model: 'storeSetting', table: 'store_settings', cols: ['key', 'value', 'updated_at'] }
  ];

  for (const t of tables) {
    try {
      sqlDump += await exportTable(t.model, t.table, t.cols);
    } catch (e) {
      console.error(`Failed to export model ${t.model}:`, e);
    }
  }

  const outputPath = path.join(__dirname, 'data.sql');
  fs.writeFileSync(outputPath, sqlDump, 'utf-8');
  console.log(`Successfully exported data to ${outputPath}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
