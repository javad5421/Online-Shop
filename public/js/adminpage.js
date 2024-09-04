//global objects
let details = {};
let selectedImages = [];
let billboard_images =[];

//color objects
const colors = [];

// populate this categories nested menu
async function getNestedCategories(){
    const response = await fetch("/admin/getnestedcategories");
    const nestedCategory = await response.json();
    return nestedCategory;
}

//populate category selection dropdowns

function populateDropdowns(selectElement, items){
    selectElement.innerhtml = '<option value=""> select </option>';
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        selectElement.appendChild(option);
    });
}

//#region details table
function preventReload(event){
    event.preventDefault();
    alert("prevented");
}

function populateTable(table, data){
    if(isObjectEmpty(data)){
        table.innerHTML = "";
        return;
    }

    table.innerHTML = "";
    
    Object.keys(data).forEach((key, index) => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${key}</td>
            <td>${data[key]}</td>
            <td>
                <button type="button" class="" data-bs-toggle="collapse" data-bs-target="#collapse${key}" aria-expanded="false" aria-controls="collapse${key}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                </button>
                <div class="collapse" id="collapse${key}">
                    <div class="card card-body">
                        <div class="col-md-3">
                            <label for="${key}-key">عنوان</label>
                            <input name="key" type="text" class="form-control" id="${key}-key" value="${key}">
                        </div>
                        <div class="col-md-8">
                            <label for="${key}-value">توضیحات</label>
                            <input name="value" type="text" class="form-control" id="${key}-value" value="${data[key]}">
                        </div>
                        <button type="button" class="btn btn-danger edit-button" value="${key}">Edit</button>
                    </div>
                </div>
                <button type="button" class="delete-button" value="${key}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                </button>
            </td>`;
    
        table.appendChild(newRow);
    });

    const edit_buttons = document.querySelectorAll(".edit-button");
    const delete_buttons = document.querySelectorAll(".delete-button");
    edit_buttons.forEach(btn => {
        btn.addEventListener("click", handleEditTable);
    })

    delete_buttons.forEach(btn => {
        btn.addEventListener("click", handleDeleteTableRow);
    })
}

function handleEditTable(event) {
    event.preventDefault();

    const key = this.getAttribute("value");
    
    const inputKey = document.querySelector(`input[name="key"][id="${key}-key"]`).value;
    const inputValue = document.querySelector(`input[name="value"][id="${key}-value"]`).value;

    if (!inputKey || !inputValue) {
        console.error("Input elements not found for the given key:", key);
        return;
    }
    
    if(inputKey === key){
        details[key] = inputValue;
    }
    else{
        details[inputKey] = inputValue;
        delete details[key];
    }

    this.classList.toggle('collapse');
    //rerender table
    const tableBody = document.getElementById('product-details-table');
    populateTable(tableBody, details);
}

function handleDeleteTableRow(event){

    const key = this.value;
   
    if(details.hasOwnProperty(key)){
        delete details[key];
        console.log(`Key ${key} deleted.`);
    } else {
        console.warn(`Key ${key} not found in details.`);
    }
    
    //rerender table
    const tableBody = document.getElementById('product-details-table');
    populateTable(tableBody, details);
}

function isObjectEmpty(object){
    return Object.keys(object).length === 0;
}
//#endregion

//color handling

//shows new colors in page
function addColor(color, name){
    const newColor = {name: name, color: color};
    colors.push(newColor);

    const colorHolder = document.getElementById("appended-colors");
    colorHolder.innerHTML = "";
    colors.forEach(c => {
        const newColorRow = document.createElement('div');
        newColorRow.classList.add('col-md-3');
        newColorRow.innerHTML = `<div class="product-meta-color-items mt-0">
                        <label class="btn-light mb-0 px-2 py-1">
                            <span style="background-color: ${c.color};"></span>
                            ${c.name}
                            <button class="btn-close ms-2 " type="button" name="removeitem" ></button>
                        </label>
                    </div>`;

        newColorRow.querySelector('.btn-close').addEventListener('click', function (e) {
            e.preventDefault();

            const index = colors.findIndex(color => color.color == color);
            colors.splice(index, 1);
            newColorRow.remove();
        })
        colorHolder.appendChild(newColorRow);
    });
}

const addColorBtn = document.getElementById("add-new-color-button");
addColorBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const name = document.getElementById('color-name').value;
    const color = document.getElementById("color-hex").value;
    addColor(color, name);
})

//image handling
function updateImagePreview (imagePreview) {
    imagePreview.innerHTML = "";
    console.log(imagePreview);
    selectedImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const containerDiv = document.createElement("div");
            containerDiv.classList.add("col-md-3", "d-flex", "flex-column", "align-items-center", "g-2", "m-3");
            const img = document.createElement('img');
            img.setAttribute('alt', "image");
            img.classList.add("img-thumbnail", "m-2");
            img.style.width = "200px";
            img.style.height = "200px";
            img.src = e.target.result;
            containerDiv.appendChild(img);
            

            //delete button 
            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('type', 'button');
            deleteButton.classList.add("btn-close");
            deleteButton.addEventListener('click', function (e) {
                console.log(selectedImages.length);
                selectedImages.splice(index, 1);
                console.log(selectedImages.length);
                console.log(imagePreview);
                updateImagePreview(imagePreview);
            });
            containerDiv.appendChild(deleteButton);
            imagePreview.appendChild(containerDiv);
            
        }
        
        reader.readAsDataURL(file);
    })
}

//add new billboard
//handle billboard
function updateBillboard_images(image_preview) {
    image_preview.innerhtml = "";
    billboard_images.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const containerDiv = document.createElement("div");
            containerDiv.classList.add("col-md-3", "d-flex", "flex-column", "align-items-center", "g-2", "m-3");
            const img = document.createElement('img');
            img.classList.add("img-fluid", "m-2");
            img.src = e.target.result;
            containerDiv.appendChild(img);

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('type', 'button');
            deleteButton.classList.add("btn-close");
            deleteButton.addEventListener("click", function (e) {
                billboard_images.splice(index,1);
                updateBillboard_images(image_preview);
            })
            containerDiv.appendChild(deleteButton);
            image_preview.appendChild(containerDiv);
        }
        reader.readAsDataURL(file);
    })
}

async function init(){

    //handle category selection
    const nestedCategories = await getNestedCategories();
    const level1 = document.getElementById("category_level1");
    const level2 = document.getElementById("category_level2");
    const level3 = document.getElementById("category_level3");
    level2.disabled = true;
    level3.disabled = true;

    populateDropdowns(level1, nestedCategories);

    level1.addEventListener("change", function() {
        const selectedOptionID = parseInt(this.value);

        if (isNaN(selectedOptionID)) {
            level2.disabled = true;
            level3.disabled = true;
            level2.innerHTML = '<option value="">Select Level 2 Category</option>';
            level3.innerHTML = '<option value="">Select Level 3 Category</option>';
            return;   
        }

        level2.innerHTML = '<option value="">Select </option>';
        level3.innerHTML = '<option value="">Select </option>';

        const selectedCategory = nestedCategories.find(item => item.id == selectedOptionID);
        if (selectedCategory && selectedCategory.children.length > 0 ) {
            populateDropdowns(level2, selectedCategory.children);
            level2.disabled = false;
            level3.disabled = true;
            level3.innerHTML = '<option value="">Select Level 3 Category</option>';
        }
    });

    level2.addEventListener("change", function () {
        const selectedOptionID = parseInt(this.value);
        
        if(isNaN(selectedOptionID)){
            level3.disabled = true;
            level3.innerHTML = '<option value="">Select Level 3 Category</option>';
            return;
        }

        level3.innerHTML = '<option value="">Select </option>';

        const parentCategory = nestedCategories.find(category => category.id === parseInt(level1.value));
        const selectedCategory = parentCategory.children.find(cat => cat.id === parseInt(level2.value));

        if (selectedCategory && selectedCategory.children.length > 0) {
            populateDropdowns(level3, selectedCategory.children);
            level3.disabled = false;
        }else {
            level3.disabled = true;
            level3.innerHTML = '<option value="">Select Level 3 Category</option>';
        }
    });

    //handle detail selection
    const tableBody = document.getElementById('product-details-table');
    populateTable(tableBody, details);

    const addButton = document.getElementById("add-new-detail");
    addButton.addEventListener("click", function (event) {
        event.preventDefault();
        const inputKey = document.querySelector('input[name="detail-title"]');
        const inputValue = document.querySelector('input[name="detail-description"]');
        if (inputKey.value && inputValue.value) {
            details[inputKey.value.trim()] = inputValue.value.trim();
            populateTable(tableBody, details);

            //empty input values
            inputKey.value = "";
            inputValue.value = "";
        } else {
            console.error("Both key and value must be provided.");
        }
    })


    //handle product images
    const image_preview = document.getElementById("images-preview");
    const image_input = document.getElementById("image-input");
    
    image_input.addEventListener('change', function (e) {
        Array.from(image_input.files).forEach(file => {
            if (!selectedImages.includes(file.fileName)) {
                selectedImages.push(file);
            }
        })
        console.log(selectedImages);
        updateImagePreview(image_preview);
    })

    const billboardImageInput = document.getElementById("billboard-images");
    const billboardImagesPreview = document.getElementById("billboard-preview");
    billboardImageInput.addEventListener('change', function (e) {
        Array.from(billboardImageInput.files).forEach(file => {
            if (!billboard_images.includes(file.fileName)){
                billboard_images.push(file);
            }
        })
        updateBillboard_images(billboardImagesPreview);
    })

    //handle color selection
}


document.addEventListener("DOMContentLoaded", init);



//finnaly send this fucking form to server
const productForm = document.getElementById('addproduct-form');
productForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    alert("Form submission initiated");
    await sendAddProductForm(productForm);
});

const billboardForm = document.getElementById("addbillboard-form");
billboardForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    alert("Billboard Form submission initiated");
    await sendBillboeardForm(billboardForm);
})

async function sendAddProductForm(form) {
    alert('Send form function called');

    // Get and modify form data
    const formData = new FormData(form);

    selectedImages.forEach((file) => {
        formData.append("images", file);
    });

    formData.append("details", JSON.stringify(details));

    //append colors to formdata
    formData.append('colors', JSON.stringify(colors));
    
    try {
        const response = await fetch("/admin/addproduct", {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('An error occurred while submitting the form');
    }
}

async function sendBillboeardForm(form){
    const formdata = new FormData(form);
    billboard_images.forEach(billboard => {
        formdata.append("image", billboard);
    })
    console.log(formdata);
    try {
        const response = await fetch('/admin/addbillboard', {
            method: 'POST',
            body: formdata
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('An error occurred while submitting the form');
    }
}

