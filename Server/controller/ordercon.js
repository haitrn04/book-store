const express = require('express');
const pool = require('../db');
pool.connect((err, connection) => {

});

const addresscon = {
    addOrderAndOrderDetail: async (req, res) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const { id_account, address_id, payment_status, order_status, order_details } = req.body;
            let total_price = 0;
            for (const detail of order_details) {
                total_price += parseInt(detail.qty * detail.price * (100 - detail.discount) / 100, 10);
            }
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
                SELECT od.id_book, b.book_name, b.author, b.price, b.discount, od.quantity, b.image_data, b.description
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
                SELECT od.id_order, od.id_book, b.book_name, b.author, b.price, b.discount, od.quantity, b.image_data, b.description
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
            return res.status(200).json({ orders: ordersWithDetails });
        } catch (error) {
            console.error("Error getting orders:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        } finally {
            client.release(); // Đảm bảo client được giải phóng dù có lỗi hay không
        }
    }
    

};

module.exports = addresscon;