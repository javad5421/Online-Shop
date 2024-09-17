//filter html elements
const priceRangeMin = document.querySelectorAll('price-range-min');
const priceRangeMax = document.querySelectorAll('price-range-max');



/**
 * parant node of all products in page 
 * @type {HTMLElement}
 */
const product_holder = document.getElementById('product_holder');

/**
 * array of html buttons that use for apply filter
 * @type {NodeListOf<HTMLElement>}
 */
const applyFilterButtons = document.querySelectorAll('.btn-applyfilter');

/** 
 * contain all recent filtered products 
 * @type {Array} 
*/
let products;

/**
 * update products base on new filters
 * @param {string} queryString include all filter parameters such as color or category
 */
async function updateFilter(queryString){
    //********* */
    //make url object sutable for getting product
    const url = `/filter?${queryString}`;
    try {
        const response = await fetch(url);
        products = response?.json();
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('An error occurred while submitting the form');
    }
    
    //add all filterd products to page
    products.forEach(p => {
        const col_lg_4 = document.createElement('div');
        col_lg_4.classList.add("col-lg-4");
        product_holder.appendChild(col_lg_4);

        const product_box = document.createElement('div');
        product_box.classList.add('product-box');
        col_lg_4.appendChild(product_box);

        //start product-timer
        const product_timer = document.createElement('div');
        product_timer.classList.add("product-timer");
        product_box.appendChild(product_timer);

        if (p.discount){
            const timer_lable = document.createElement('div');
            timer_lable.classList.add("timer-label");
            const span = document.createElement('span');
            span.innerHTML = `${p.discount} تخفیف`;
            timer_lable.appendChild(span);

            product_timer.appendChild(timer_lable);
        }

        const product_header_btn = document.createElement('div');
        product_header_btn.classList.add("product-header-btn");
        product_header_btn.innerHTML = `<a href="" class="" data-bs-toggle="tooltip" data-bs-placement="top"
                                                    data-bs-title="مقایسه"><i class="bi bi-shuffle"></i></a>
                                                <a href="" class="" data-bs-toggle="tooltip" data-bs-placement="top"
                                                    data-bs-title="افزودن به علاقه مندی ها"><i class="bi bi-heart"></i></a>
                                                <a href="" class="" data-bs-toggle="tooltip" data-bs-placement="top"
                                                    data-bs-title="مشاهده سریع"><i class="bi bi-eye"></i></a>`;

        product_timer.appendChild(product_header_btn);
        //end product-timer

        //start product-image
        const product_image = document.createElement('div');
        product_image.classList.add('product-image');
        product_box.appendChild(product_image);

        if(p.images.length > 1){
            product_image.innerHTML = `<img src="${p.images[0]}" loading="lazy" alt=""
                                                class="img-fluid one-image">
                                                <img src="${p.images[1]}" loading="lazy" alt=""
                                                class="img-fluid two-image">`;
        } else {
            product_image.innerHTML = `<img src="${p.images[0]}" loading="lazy" alt=""
                                                class="img-fluid one-image">
                                                <img src="${p.images[0]}" loading="lazy" alt=""
                                                class="img-fluid two-image">`;
        }
        //end product-image

        //start product-title
        const product_title = document.createElement('div');
        product_title.classList.add('product-title');
        product_box.appendChild(product_title);
        product_title.innerHTML = `<div class="title">
                                                <p class="text-overflow-1">${p.persian_title}</p>
                                                <span class="text-muted text-overflow-1">${p.english_title}</span>
                                            </div>
                                            <div class="rating">
                                                <div class="number"><span class="text-muted font-12">${p.rate}</span></div>
                                                <div class="icon"><i class="bi bi-star-fill"></i></div>
                                            </div>`;
        //end product-title                            
        
        //start product action
        const product_action = document.createElement('div');
        product_action.classList.add('product-action');
        product_box.appendChild(product_action);

        const newPrice = p.price * (100 - p.discount) / 100;
        newPrice = newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const oldPrice = p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        product_action.innerHTML = `<div class="price">
                                                <p class="new-price">${newPrice} تومان</p>
                                                <p class="old-price">${oldPrice} تومان</p>
                                            </div>
                                            <div class="link">
                                                <a href="" class="btn border-0 rounded-3 main-color-one-bg">
                                                    <i class="bi bi-basket text-white"></i>
                                                    <span class="text-white">خرید محصول</span>
                                                </a>
                                            </div>`;
    })
    //******** */
    //populate products

}

//add event to applyfilter buttons
applyFilterButtons.forEach(btn => {
    btn.addEventListener('click', function(e){
        //get all filter options values
        
    })
})
