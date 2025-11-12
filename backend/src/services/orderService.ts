import { Order, OrderInput } from '../types/order';
import { db } from '../database/db';

export class OrderService {
  async createOrder(orderInput: OrderInput): Promise<Order> {
    const self = this;
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(
          `INSERT INTO orders (order_number, customer_name, type, status) 
           VALUES (?, ?, ?, ?)`,
          [orderInput.order_number, orderInput.customer_name || null, (orderInput as any).type || 'order', orderInput.status || 'unfulfilled'],
          function(err) {
            if (err) {
              reject(err);
              return;
            }

            const orderId = this.lastID;

            // Insert features
            const features = orderInput.features || {};
            const featureStmt = db.prepare(
              `INSERT INTO order_features (order_id, feature_type, feature_value) 
               VALUES (?, ?, ?)`
            );

            for (const [type, value] of Object.entries(features)) {
              if (value) {
                featureStmt.run([orderId, type, value]);
              }
            }
            featureStmt.finalize();

            // Insert options
            const options = orderInput.options || {};
            const optionStmt = db.prepare(
              `INSERT INTO order_options (order_id, option_name, option_value) 
               VALUES (?, ?, ?)`
            );

            for (const [name, value] of Object.entries(options)) {
              if (value) {
                optionStmt.run([orderId, name, value]);
              }
            }
            optionStmt.finalize();

            // Fetch the complete order
            self.getOrderById(orderId)
              .then(resolve)
              .catch(reject);
          }
        );
      });
    });
  }

  async getOrderById(id: number): Promise<Order> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM orders WHERE id = ?`,
        [id],
        (err, row: any) => {
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            reject(new Error('Order not found'));
            return;
          }

          this.getOrderWithDetails(row.id)
            .then(resolve)
            .catch(reject);
        }
      );
    });
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM orders WHERE order_number = ?`,
        [orderNumber],
        (err, row: any) => {
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            resolve(null);
            return;
          }

          this.getOrderWithDetails(row.id)
            .then(resolve)
            .catch(reject);
        }
      );
    });
  }

  async getAllOrders(): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM orders ORDER BY created_at DESC`,
        [],
        (err, rows: any[]) => {
          if (err) {
            reject(err);
            return;
          }

          Promise.all(rows.map(row => this.getOrderWithDetails(row.id)))
            .then(resolve)
            .catch(reject);
        }
      );
    });
  }

  private async getOrderWithDetails(orderId: number): Promise<Order> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM orders WHERE id = ?`,
        [orderId],
        (err, orderRow: any) => {
          if (err) {
            reject(err);
            return;
          }

          const order: Order = {
            id: orderRow.id,
            order_number: orderRow.order_number,
            customer_name: orderRow.customer_name,
            status: orderRow.status,
            created_at: orderRow.created_at,
            updated_at: orderRow.updated_at,
            features: [],
            options: []
          };

          // Get features
          db.all(
            `SELECT * FROM order_features WHERE order_id = ?`,
            [orderId],
            (err, featureRows: any[]) => {
              if (err) {
                reject(err);
                return;
              }

              order.features = featureRows.map(row => ({
                id: row.id,
                order_id: row.order_id,
                feature_type: row.feature_type as any,
                feature_value: row.feature_value
              }));

              // Get options
              db.all(
                `SELECT * FROM order_options WHERE order_id = ?`,
                [orderId],
                (err, optionRows: any[]) => {
                  if (err) {
                    reject(err);
                    return;
                  }

                  order.options = optionRows.map(row => ({
                    id: row.id,
                    order_id: row.order_id,
                    option_name: row.option_name,
                    option_value: row.option_value
                  }));

                  resolve(order);
                }
              );
            }
          );
        }
      );
    });
  }
}

export const orderService = new OrderService();

