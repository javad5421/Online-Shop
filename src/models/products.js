import { pool } from "../../config/db.js";

async function insertInProducts(name, price, quantity, description, persian_title,
     english_title, discount, datetime, category, details) {
    try {
        const query = 'INSERT INTO products (name,price,quantity,description,details,category,discount,discount_expire_date,persian_title,english_title) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *';
        const result = await pool.query(query, [name, price, quantity, description, details, category, discount, datetime, persian_title, english_title]);
        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return 'not good';
        }
    } catch (error) {
        console.log(error.message + error.stack);
    }
}

async function insertInImages(images, product_id) {
    const query = 'INSERT INTO product_images (product_id, image_url) VALUES ($1,$2)';
    try {
        const promises = images.map(img => pool.query(query, [product_id, img]));
        await Promise.all(promises);
    } catch (error) {
        console.log(error.message + error.stack);
    }

}

async function insertInProductColors(product_id, colorName, colorHex, count){
    const query = 'INSERT INTO product_colors (product_id, color_name, color_hex, count) values ($1, $2, $3, $4)';
    const values = [product_id, colorName, colorHex, count];
    try {
        await pool.query(query, values);  
    } catch (error) {
        console.log(error.message + error.stack);
    }
}

async function getDiscounted(count) {
    try {
        const products = await pool.query(
            "SELECT * FROM products WHERE discount > 0 ORDER BY discount DESC LIMIT $1",
            [count]
        );

        if (products.rows.length === 0) {
            console.log("nothing returned from discounted products!!!");
        } else {
            //id of all selected product
            const productids = [];
            products.rows.forEach((product) => {
                productids.push(product.id);
            });


            const reviews = await pool.query(
                "SELECT product_id, AVG(rate) as rating FROM reviews WHERE PRODUCT_ID = ANY($1) GROUP BY product_id",
                [productids]
            );

            //convert reviews to map
            const reviewMap = new Map();
            reviews.rows.forEach((review) => {
                reviewMap.set(review.product_id, review.rating);
            });

            //get images for this product from database
            const images = await pool.query('SELECT product_id,image_url FROM product_images WHERE product_id = ANY($1)', [productids]);

            const imagesMap = new Map();

            if (images.rows.length === 0) {
                console.log("nothing returned from images table");
            } else {
                //convert images to map object
                images.rows.forEach(({ product_id, image_url }) => {
                    if (!imagesMap.has(product_id)) {
                        imagesMap.set(product_id, []);
                    }

                    imagesMap.get(product_id).push(image_url);
                })
            }
            const completeProduct = products.rows.map((product) => {
                return {
                    ...product,
                    rate: reviewMap.get(product.id) || 0,
                    images: imagesMap.get(product.id) || []
                };
            });

            return completeProduct;
        }
    } catch (error) {
        console.log(error.message + " stack: " + error.stack);
        throw error;
    }
}
//lacks reviews to append to the final object
async function getProducts(hasDetail = false, hasImage = false, hasRate = false, hasColor = false, count = 0, product_id = -1, category_id = []) {
    let query;
    let queryParams = [];   
    query = 'SELECT * FROM products';

    if (product_id != -1){
        query += ' WHERE id = $1';
        queryParams.push(product_id);
    }

    if (category_id.length != []) {
        //console.log('categoryID' ,category_id);

        if (queryParams.length === 0){
            query += ' WHERE category = ANY($1:int[])';
            queryParams.push(category_id);
        } else {
            query += ' AND category = ANY($2:int[])';
            queryParams.push(category_id);
        }
    }

    query += ' ORDER BY discount DESC';

    if(count > 0){
        query += ` LIMIT $${queryParams.length + 1}`;
        
        queryParams.push(parseInt(count));
    }

    let products = null;
    try {
        const response = await pool.query(query, queryParams);
        if (response.rows.length === 0) {
            console.log("nothing returned from product in modules/products.js/getProducts");
            return;
        } else {
            products = response.rows;
        }
    } catch (error) {
        console.log(error.message + " stack: " + error.stack);
        throw error;
    }

    const productIds = products.map(p => p.id);
    const imageMap = new Map();
    const rateMap = new Map();
    const colorMap = new Map();
    let completeProduct = products;

    if (hasImage) {
        let product_images;
        try {
            const result = await pool.query('SELECT * FROM product_images WHERE product_id = ANY($1)', [productIds]);
            if (result.rows.length === 0) {
                console.log('there is nothing in images table');
                return;
            }
            else {
                product_images = result.rows;
            }
        } catch (error) {
            console.log(error.message + " stack: " + error.stack);
            throw error;
        }

        product_images.forEach(({ product_id, image_url }) => {
            if (!imageMap.has(product_id)) {
                imageMap.set(product_id, []);
            }

            imageMap.get(product_id).push(image_url);
        })

        completeProduct = completeProduct.map(p => {
            return {
                ...p,
                images: imageMap.get(p.id) || null,
            };
        })
    }

    if (hasRate) {
        let rate;
        try {
            const result = await pool.query('SELECT product_id ,AVG(rate) AS rating FROM reviews WHERE product_id = ANY($1) GROUP BY product_id', [productIds]);
            rate = result.rows
        } catch (error) {
            console.log(error.message + " stack: " + error.stack);
            throw error;
        }

        rate.forEach(({ product_id, rating }) => {
            rateMap.set(product_id, rating);
        })

        completeProduct = completeProduct.map(p => {
            return {
                ...p,
                rate: rateMap.get(p.id) || 0,
            };
        })
    }

    if (hasDetail) {
        completeProduct = completeProduct.map(p => {
            let detailsArray;
            if (p.details) {
                detailsArray = Object.keys(p.details).map(key => {
                    return { key: key, value: p.details[key] };
                })
            }

            return {
                ...p,
                details: detailsArray || 'nothing'
            };
        })
    }

    if (hasColor){
        let colors;
        try {
            const result = await pool.query('SELECT product_id, color_name, color_hex,count FROM product_colors WHERE product_id = ANY($1)', [productIds]);
            colors = result.rows;
        } catch (error) {
            console.log(error.message + " stack: " + error.stack);
            throw error;
        }

        colors.forEach(color => {

            if (!colorMap.has(color.product_id)){
                colorMap.set(color.product_id, []);
            }

            colorMap.get(color.product_id).push({name: color.color_name, hex: color.color_hex, count: color.count});
        })

        completeProduct = completeProduct.map(p => {
            return {
                ...p,
                colors: colorMap.get(p.id)
            }
        });
    }

    return completeProduct;
}

export { getDiscounted, insertInProducts, insertInImages, getProducts, insertInProductColors };
