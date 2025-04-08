const express = require('express');
const pool = require('../db');
pool.connect((err, connection) => {

});

const ordercon = {
    addOrderAndOrderDetail: async (req, res) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const { id_account, address_id, payment_status, order_status, order_details } = req.body;
            let total_price = 0;
            for (const detail of order_details) {
                total_price += parseInt(detail.qty * detail.price * (100 - detail.discount) / 100, 10);
            }
            total_price = parseInt(total_price * 1.1);
            const orderQuery = `
                INSERT INTO public.orders (id_account, total_price, address_id, payment_status, order_status, created_at)
                VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id_order;
            `;
            const orderValues = [id_account, total_price, address_id, payment_status, order_status];
            const orderResult = await client.query(orderQuery, orderValues);
            const id_order = orderResult.rows[0].id_order;
            const orderDetailQuery = `
                INSERT INTO public.order_details (id_order, id_book, quantity)
                VALUES ($1, $2, $3);
            `;
            for (const detail of order_details) {
                const detailValues = [id_order, detail.id_book, detail.qty];
                await client.query(orderDetailQuery, detailValues);
            }
            await client.query("COMMIT");
            res.status(200).json({ message: "Order added successfully", id_order, total_price });
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error adding order:", error);
            res.status(500).json({ error: "Internal Server Error" });
        } finally {
            client.release();
        }
    },
    getOrderByID: async (req, res) => {
        const client = await pool.connect();
        try {
            const { id_order } = req.params;

            // Truy vấn thông tin đơn hàng
            const orderQuery = `
                SELECT o.id_order, o.id_account, o.total_price, o.address_id, o.payment_status, o.order_status, o.created_at, 
                        a.full_name, a.phone_number, a.detailed_address, a.province, a.district, a.ward
                FROM public.orders o
                JOIN public.address a ON o.address_id = a.address_id
                WHERE o.id_order = $1;
            `;
            const orderValues = [id_order];
            const orderResult = await client.query(orderQuery, orderValues);
            // Nếu không tìm thấy đơn hàng, trả về lỗi 404
            if (orderResult.rowCount === 0) {
                return res.status(404).json({ error: "Order not found" });
            }
            const order = orderResult.rows[0];
            // Truy vấn chi tiết đơn hàng
            const orderDetailQuery = `
                SELECT od.id_book, b.book_name, b.author, b.price, b.discount, od.quantity, encode(b.image_data, 'base64') AS image_data, b.description
                FROM public.order_details od
                JOIN public.books b ON od.id_book = b.id_book
                WHERE od.id_order = $1;
            `;
            const orderDetailValues = [id_order];
            const orderDetailResult = await client.query(orderDetailQuery, orderDetailValues);
            // Trả về thông tin đơn hàng và chi tiết đơn hàng
            const order_details = orderDetailResult.rows;
            return res.status(200).json({ order, order_details });
        } catch (error) {
            console.error("Error getting order:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        } finally {
            client.release(); // Đảm bảo client được giải phóng dù có lỗi hay không
        }
    },
    getOrders: async (req, res) => {
        const client = await pool.connect();
        try {
            // Truy vấn thông tin tất cả đơn hàng
            const orderQuery = `
                SELECT o.id_order, o.id_account, o.total_price, o.address_id, o.payment_status, o.order_status, o.created_at, 
                       a.full_name, a.phone_number, a.detailed_address, a.province, a.district, a.ward
                FROM public.orders o
                JOIN public.address a ON o.address_id = a.address_id
            `;
            const orderResult = await client.query(orderQuery);

            // Nếu không tìm thấy đơn hàng, trả về lỗi 404
            if (orderResult.rowCount === 0) {
                return res.status(404).json({ error: "No orders found" });
            }

            // Lấy thông tin tất cả đơn hàng
            const orders = orderResult.rows;

            // Truy vấn chi tiết tất cả các đơn hàng
            const orderDetailQuery = `
                SELECT od.id_order, od.id_book, b.book_name, b.author, b.price, b.discount, od.quantity, encode(b.image_data, 'base64') AS image_data, b.description
                FROM public.order_details od
                JOIN public.books b ON od.id_book = b.id_book
            `;
            const orderDetailResult = await client.query(orderDetailQuery);

            // Group order details by order ID
            const orderDetailsGrouped = {};
            orderDetailResult.rows.forEach(detail => {
                if (!orderDetailsGrouped[detail.id_order]) {
                    orderDetailsGrouped[detail.id_order] = [];
                }
                orderDetailsGrouped[detail.id_order].push(detail);
            });

            // Add the details to each order
            const ordersWithDetails = orders.map(order => ({
                ...order,
                order_details: orderDetailsGrouped[order.id_order] || []
            }));

            // Trả về thông tin tất cả đơn hàng và chi tiết của chúng
            return res.status(200).json(ordersWithDetails);
        } catch (error) {
            console.error("Error getting orders:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        } finally {
            client.release(); // Đảm bảo client được giải phóng dù có lỗi hay không
        }
    },
    getTotalOrders: async (req, res) => {
        const client = await pool.connect();
        try {
            const result = await client.query(`SELECT COUNT(*) FROM public.orders`);
            const total = parseInt(result.rows[0].count, 10);
            res.status(200).json({ total });
        } catch (error) {
            console.error("Error getting total orders:", error);
            res.status(500).json({ error: "Internal Server Error" });
        } finally {
            client.release();
        }
    },
    getTotalSales: async (req, res) => {
        const client = await pool.connect();
        try {
            const result = await client.query(`SELECT SUM(total_price) AS total_sales FROM public.orders`);
            const total_sales = parseInt(result.rows[0].total_sales, 10);
            res.status(200).json({ total_sales });
        } catch (error) {
            console.error("Error getting total sales:", error);
            res.status(500).json({ error: "Internal Server Error" });
        } finally {
            client.release();
        }
    },        
    getPendingOrders: async (req, res) => {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT COUNT(*) AS total_pending_orders
                FROM public.orders
                WHERE payment_status = 'pending'
            `);  
            const total_pending_orders = parseInt(result.rows[0].total_pending_orders, 10);
            if (isNaN(total_pending_orders)) {
                return res.status(500).json({ error: "Invalid data returned from database" });
            }
    
            res.status(200).json({ total_pending_orders });
        } catch (error) {
            console.error("Error getting pending orders:", error);
            res.status(500).json({ error: "Internal Server Error" });
        } finally {
            client.release();
        }
    },
    
    getRecentTransactions: async (req, res) => {
        const client = await pool.connect();
        try {
            const sql = `
                SELECT 
                b.book_name as product,
                ad.detailed_address AS location,
                TO_CHAR(o.created_at, 'YYYY-MM-DD') AS date,
                od.quantity,
                o.total_price AS amount,
                o.payment_status as status
            FROM 
                orders o
            JOIN 
                order_details od ON o.id_order = od.id_order
 			JOIN
			 	books b ON b.id_book = od.id_book
			JOIN
				address ad ON ad.address_id = o. address_id
            ;
            `;
    
            const result = await client.query(sql);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            client.release();
        }
    },
    getOrderByAccountID: async (req, res) => {
        const client = await pool.connect();
        try {
            const { id_account } = req.params;
    
            // Kiểm tra đầu vào
            if (!id_account || isNaN(id_account)) {
                return res.status(400).json({ error: "Invalid account ID" });
            }
    
            // Truy vấn thông tin đơn hàng
            const orderQuery = `
                SELECT o.id_order, o.id_account, o.total_price, o.address_id, o.payment_status, o.order_status, o.created_at, 
                       a.full_name, a.phone_number, a.detailed_address, a.province, a.district, a.ward
                FROM public.orders o
                JOIN public.address a ON o.address_id = a.address_id
                WHERE o.id_account = $1;
            `;
            const orderResult = await client.query(orderQuery, [id_account]);
    
            if (orderResult.rowCount === 0) {
                return res.status(404).json({ error: "Order not found" });
            }
    
            // Lấy danh sách đơn hàng
            const orders = orderResult.rows;
            const result = [];
    
            // Lấy chi tiết cho từng đơn hàng
            for (const order of orders) {
                const orderDetailQuery = `
                    SELECT od.id_book, b.book_name, b.author, b.price, b.discount, od.quantity, 
                           encode(b.image_data, 'base64') AS image_data, b.description
                    FROM public.order_details od
                    JOIN public.books b ON od.id_book = b.id_book
                    WHERE od.id_order = $1;
                `;
                const orderDetailResult = await client.query(orderDetailQuery, [order.id_order]);
                const order_details = orderDetailResult.rows;
    
                result.push({ order, order_details });
            }
    
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error getting order:", error.message, error.stack);
            return res.status(500).json({ error: "Internal Server Error", message: error.message });
        } finally {
            client.release();
        }
    },
    updateOrderStatus: async (req, res) => {
        const client = await pool.connect();
        try {
            console.log('Received request for order:', req.params.id_order);
            console.log('Request body:', req.body);
            await client.query("BEGIN");
    
            const { id_order } = req.params;
            const { order_status, payment_status } = req.body;
    
            if (!order_status && !payment_status) {
                return res.status(400).json({
                    error: "At least one status (order_status or payment_status) must be provided"
                });
            }
    
            let updateQuery = "UPDATE public.orders SET ";
            const updateValues = [];
            let paramCount = 1;
    
            if (order_status) {
                updateQuery += `order_status = $${paramCount}`;
                updateValues.push(order_status);
                paramCount++;
            }
    
            if (payment_status) {
                updateQuery += `${order_status ? ', ' : ''}payment_status = $${paramCount}`;
                updateValues.push(payment_status);
                paramCount++;
            }
    
            updateQuery += ` WHERE id_order = $${paramCount}`;
            updateValues.push(id_order);
    
            console.log('Executing query:', updateQuery, updateValues);
            const result = await client.query(updateQuery, updateValues);
    
            if (result.rowCount === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({ error: "Order not found" });
            }
    
            await client.query("COMMIT");
    
            return res.status(200).json({
                message: "Order status updated successfully"
            });
    
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error updating order status:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        } finally {
            client.release();
        }
    }

};

module.exports = ordercon;