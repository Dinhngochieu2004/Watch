const modelProduct = require('../models/products.model');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyChaT4xn-_8XwXlpQ1flnP9q0LweFQd8FQ');

async function askQuestion(question) {
    try {
        const products = await modelProduct.find({});

        // Chỉ lấy sản phẩm còn hàng và giới hạn 10 sản phẩm
        const availableProducts = products.filter((p) => p.stock > 0).slice(0, 10);

        const productData = availableProducts
            .map((product) => {
                const finalPrice =
                    product.discount > 0 ? product.price - (product.price * product.discount) / 100 : product.price;

                return `${product.nameProduct} | ${product.brand} | ${product.gender} | ${
                    product.dialDiameter
                }mm | ${finalPrice.toLocaleString('vi-VN')}đ${
                    product.discount > 0 ? ` (giảm ${product.discount}%)` : ''
                } | ${product.movement} | ${product.waterResistance}`;
            })
            .join('\n');

        const prompt = `
Bạn là nhân viên tư vấn đồng hồ. Trả lời NGẮN GỌN và TỰ NHIÊN.

SẢN PHẨM CÓ SẴN (Tên|Thương hiệu|Giới tính|Size|Giá|Máy|Chống nước):
${productData}

Khách hỏi: "${question}"

Trả lời ngắn gọn (2-3 câu), chỉ giới thiệu 1-2 sản phẩm phù hợp nhất:
        `;

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],

            generationConfig: {
                temperature: 0.5,
                topP: 0.7,
                maxOutputTokens: 300,
                stopSequences: ['\n\n'],
            },
        });

        const response = result.response.text();

        return response;
    } catch (error) {
        console.error('Lỗi AI Service:', error);

        return 'Xin lỗi, hệ thống AI đang gặp sự cố. Vui lòng liên hệ nhân viên tư vấn để được hỗ trợ.';
    }
}

module.exports = { askQuestion };
