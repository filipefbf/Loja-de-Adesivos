let cart = [];
let modalQt = 1;
let modalKey = 0;


const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);


//listagem das adesivos

adesivoJson.map((item, index)=> {
    let adesivoItem = c('.models .adesivo-item').cloneNode(true);

    adesivoItem.setAttribute('data-key', index);
    adesivoItem.querySelector(".adesivo-item--img img").src = item.img;
    adesivoItem.querySelector(".adesivo-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;
    adesivoItem.querySelector(".adesivo-item--name").innerHTML = item.name;
    adesivoItem.querySelector(".adesivo-item--desc").innerHTML = item.description;
    adesivoItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.adesivo-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.adesivoBig img').src = adesivoJson[key].img;
        c('.adesivoInfo h1').innerHTML = adesivoJson[key].name;
        c('.adesivoInfo .adesivoInfo--desc').innerHTML = adesivoJson[key].description;
        c('.adesivoInfo--actualPrice').innerHTML = `R$ ${adesivoJson[key].price.toFixed(2)}`;
        c('.adesivoInfo--size.selected').classList.remove('selected');
        cs('.adesivoInfo--size').forEach((size, sizeIndex) => {   
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = adesivoJson[key].sizes[sizeIndex];      
        });

        c('.adesivoInfo--qt').innerHTML = modalQt;

        c('.adesivoWindowArea').style.opacity = 0;
        c('.adesivoWindowArea').style.display = 'flex';
        setTimeout(()=> {
            c('.adesivoWindowArea').style.opacity = 1;
        });
        
    });

    c('.adesivo-area').append(adesivoItem); 
    
});

//eventos do modal
function closeModal() { 
    c('.adesivoWindowArea').style.opacity = 0;
    setTimeout(() =>{
        c('.adesivoWindowArea').style.display = 'none';    
    },500)
}

cs('.adesivoInfo--cancelButton, .adesivoInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

c('.adesivoInfo--qtmenos').addEventListener('click', () =>{
    if(modalQt >1){
        modalQt--;
    }    
    c('.adesivoInfo--qt').innerHTML = modalQt;
})

c('.adesivoInfo--qtmais').addEventListener('click', () =>{
    modalQt++;
    c('.adesivoInfo--qt').innerHTML = modalQt;
})

cs('.adesivoInfo--size').forEach((size, sizeIndex)=>{   
    size.addEventListener('click', (e)=>{
        c('.adesivoInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');  
    } );       
});

c('.adesivoInfo--addButton').addEventListener('click', ()=> {
    let size = parseInt(c('.adesivoInfo--size.selected').getAttribute('data-key'));

    let identifier = adesivoJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>  item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
    
        cart.push({
            identifier,
            id:adesivoJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if (cart.length > 0) {
        c('aside').style.left = '0';
    } 
});
c('.menu-closer').addEventListener('click', () =>{
    c('aside').style.left = '100vw';
})

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;


    if(cart.length > 0 ) {
        c('aside').classList.add('show');
        c('.cart').innerHTML ='';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {

            let adesivoItem = adesivoJson.find((item) =>  item.id == cart[i].id);            
            subtotal += adesivoItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let adesivoSizeName;
            switch(cart[i].size) {
                case 0:
                    adesivoSizeName = 'P';
                    break;
                case 1:
                    adesivoSizeName = 'M';
                    break;
                case 2:
                    adesivoSizeName = 'G';
                    break;
            }

            let adesivoName = `${adesivoItem.name} (${adesivoSizeName})`;

            cartItem.querySelector('img').src = adesivoItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = adesivoName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i,1);
                }
               updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
               cart[i].qt++;
               updateCart(); 
            })

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}