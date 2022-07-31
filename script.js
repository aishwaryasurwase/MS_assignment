let productsList = [];
const container = document.getElementById('container');
const detailsEl = document.getElementById('details');

const left_arrow = document.getElementById('left_arrow');
const right_arrow = document.getElementById('right_arrow');
const allGiftFor = document.getElementById('All');
const menGiftFor = document.getElementById('Men');
const womenGiftFor = document.getElementById('Women');
const kidsGiftFor = document.getElementById('Kids');
const elderlyGiftFor = document.getElementById('Elderly');
const teensGiftFor = document.getElementById('Teens');

const failedToFetch = document.getElementById('failedToFetch');
const carousel_1 = document.getElementById('carousel_1');
let currentPageInd = 0;

const filter = {
    category: 'Trending',
    giftFor: 'All',
    price:  1000
}

const renderProductList = (products) => {
    container.innerHTML = '';
    products.forEach((product) => {
        const itemEl = document.createElement('div');
        itemEl.id = `item_${product.id}`;
        itemEl.classList.add('item');

        const imageEl = document.createElement('img');
        imageEl.classList.add('item_image')
        imageEl.src = product.imageUrl;

        const itemName = document.createElement('div');
        itemName.id = `item_name_${itemName}`;
        itemName.textContent = product.name;

        const itemPrice = document.createElement('div');
        itemPrice.id = `item_price_${itemName}`;
        itemPrice.textContent = `$${product.price}`;

        itemEl.appendChild(imageEl);
        itemEl.appendChild(itemName);
        itemEl.appendChild(itemPrice)

        container.appendChild(itemEl)
    })
}

const getFilteredProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem('filteredProductList'));
    if(storedProducts.length < 10){
        left_arrow.disabled = true;
        right_arrow.disabled = true;
    }
    return storedProducts;
}

const nextImage = () => {
    const filteredProducts = getFilteredProducts();
    const updatedIndex = currentPageInd * 10 + 10;
    renderProductList(filteredProducts.slice(currentPageInd * 10, updatedIndex));
    currentPageInd += 1;
}

const previousImage = () => {
    const filteredProducts = getFilteredProducts();
    currentPageInd -= 1;
    if (currentPageInd == 1) {
        left_arrow.disabled = true;
    }
    const updatedIndex = currentPageInd * 10 - 10;
    renderProductList(filteredProducts.slice(updatedIndex, currentPageInd*10));
}

const filterHandler = () => {
    detailsEl.innerHTML = '';
    localStorage.setItem('startingIndex', 0);
    currentPageInd = 0;
    const filteredProducts = productsList.filter((product) => {
        return product.category === filter.category
            && (product.giftFor == filter.giftFor || filter.giftFor === 'All')
            && product.price <= filter.price
    });
    if (filteredProducts.length === 0) {
        const noProductAvailable = document.getElementById('noProductAvailable');
        noProductAvailable.style.display = 'block';
    } else {
        const noProductAvailable = document.getElementById('noProductAvailable');
        noProductAvailable.style.display = 'none';
    }
    localStorage.setItem('filteredProductList', JSON.stringify(filteredProducts));
    nextImage();
}

const removeActiveClass = () => {
    allGiftFor.classList.remove('active');
    menGiftFor.classList.remove('active');
    womenGiftFor.classList.remove('active');
    kidsGiftFor.classList.remove('active');
    elderlyGiftFor.classList.remove('active');
    teensGiftFor.classList.remove('active');
}

const clearAllFilters = () => {
    filter.category = 'Trending',
    filter.giftFor = 'All',
    filter.price = 1000;
    
    removeActiveClass();
    allGiftFor.classList.add('active');

    const slider = document.getElementsByClassName('slider')[0];
    slider.value = 1000;
    document.getElementsByTagName('select')[0].value = 'Trending';
    filterHandler();
}

const fetchProducts = () =>{
    fetch('./data.json').then((products) => {
        return products.json();
    }).then((products) => {
        failedToFetch.style.display = 'none';
        productsList = [...products];
        allGiftFor.classList.add('active');
        filterHandler();
    }).catch((err) => {
        console.log("Error in fetching data", err);
        failedToFetch.style.display = 'block';
        carousel_1.style.display = 'none';
    })
}

fetchProducts();


const categoryHandler = (event) => {
    const selectedCateogry = event.target.value;
    filter.category = selectedCateogry;
    filterHandler();
}

const giftForHandler = (event) => {
    const selectedGiftFor = event.target.parentNode.id;
    if (selectedGiftFor === 'All' || selectedGiftFor === 'Men'
        || selectedGiftFor === 'Women' || selectedGiftFor === 'Kids'
        || selectedGiftFor === 'Elderly' || selectedGiftFor === 'Teens'){

        const selectedGiftForEl = document.getElementById(selectedGiftFor);

        if (selectedGiftForEl.classList.contains('active')) {
            selectedGiftForEl.classList.remove('active');
            filter.giftFor = 'All';
            allGiftFor.classList.add('active');
        } else {
            removeActiveClass();
            selectedGiftForEl.classList.add('active');
            filter.giftFor = selectedGiftFor;
        }
        filterHandler();
    }
}

const priceHandler = (event) => {
    const selectedPrice = event.target.value;
    const maxPrice = document.getElementById('maxPrice');
    maxPrice.innerText = `$${selectedPrice}`;
    filter.price = +selectedPrice;
    filterHandler();
}

const productSelectHandler = (event) => {
    const elementId = event.target.parentNode.id;
    const id = elementId.split('item_')[1];
    detailsEl.innerHTML = '';
    if (!id) return;
    const productDetailsEl = document.createElement('div');
    productDetailsEl.classList.add('product_details');

    productDetailsEl.style.top = event.clientY - 50 + 'px';
    productDetailsEl.style.left = event.clientX - 50 + 'px';
    
    const product = productsList.filter((product) => product.id == id)[0];

    const imageEl = document.createElement('img');
    imageEl.classList.add('product_details_image')
    imageEl.src = product.imageUrl;

    const itemName = document.createElement('div');
    itemName.textContent = product.name;
    itemName.style.padding = '3px';

    const slashedPrice = document.createElement('div');
    slashedPrice.textContent = `$${product.slashedPrice}`;
    slashedPrice.style.textDecoration = 'line-through';
    slashedPrice.style.padding = '3px';

    const itemPrice = document.createElement('div');
    itemPrice.textContent = `$${product.price}`;
    itemPrice.style.padding = '3px';

    const itemDetail = document.createElement('div');
    itemDetail.textContent = `${product.detail}`;
    itemDetail.style.color = 'green';

    const moreDetails = document.createElement('div');
    moreDetails.classList.add('more_details');
    moreDetails.textContent = 'SEE MORE DETAILS  >';

    productDetailsEl.appendChild(imageEl);
    productDetailsEl.appendChild(itemName);
    productDetailsEl.appendChild(slashedPrice);
    productDetailsEl.appendChild(itemPrice);
    productDetailsEl.appendChild(itemDetail);
    productDetailsEl.appendChild(moreDetails);

    detailsEl.appendChild(productDetailsEl);
}

const redirectToAmazon = (event) => {
    if (event.target.parentNode.classList.contains('item')) {
        window.open('https://www.amazon.in/', '_blank');
    }
}
