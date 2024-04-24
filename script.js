const menu = document.getElementById("menu");
const cartBtn = document.querySelector(".look-cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.querySelector(".checkout-btn");
const closeModalBtn = document.querySelector(".close-modal-btn");
const cartCounter = document.getElementById("count-items-cart");
const clientNameInput = document.getElementById("client-name");
const addressInput = document.getElementById("address");
const messageWarn = document.querySelector(".message-warn");

const cart = [];

//Abrir modal carrinho:
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex";
})

//Fechar modal carrinho:

//quando clica fora do modal:
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
})
//quando clica em fechar:
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
})

//pegar name e price do hamburguer
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-card-btn");
    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        
        //Adicionar ao carrinho:
        addToCart(name, price)

    }
})

//Function adicionar ao carrinho:
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name);
    if(existingItem){
       //Se o item existir, então aumenta apenas a quantidade em + 1;
       existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
 
}


//Atualiza carrinho:

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.style.display = "flex";
        cartItemElement.style.flexDirection = "column"
        cartItemElement.style.justifyContent = "space-between";
        cartItemElement.style.marginBottom = "8px"

        cartItemElement.innerHTML = `
            <div style= "display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <p style = "font-weight: bold;margin-bottom: 4px; ">${item.name}</p>
                    <p>(Quantidade: ${item.quantity})</p>
                    <p style = "margin-top: 4px">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}" style= "background-color:#F9F9F9; border: 0; color: #FF6392;" onMouseOver="this.style.color='#5AA9E6'" onMouseOut="this.style.color='#FF6392'">Remover</button>
            </div>
        `
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    })
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;
    return total;
}

//remover item do carrinho:
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
});

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index != -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

//verificando campo nome do cliente:
clientNameInput.addEventListener("input", function(event){
    let inputNameValue = event.target.value;

    if(inputNameValue != ""){
        messageWarn.style.display="none";
        clientNameInput.style.borderColor="#000000";
    }
});


//verificando campo endereço:
addressInput.addEventListener("input", function(event){
    let inputAddressValue = event.target.value;

    if(inputAddressValue != ""){
        messageWarn.style.display="none";
        addressInput.style.borderColor="#000000";
    }
});


//finalizar carrinho

checkoutBtn.addEventListener("click", function(){
    if(cart.length === 0){
        return;
    }

    if(clientNameInput.value === "" && addressInput.value === ""){
        messageWarn.style.display = "flex";
        clientNameInput.style.borderColor = "#FF0000";
        addressInput.style.borderColor = "#FF0000";
        return;
    }

    if(clientNameInput.value === ""){
        messageWarn.style.display = "flex";
        clientNameInput.style.borderColor = "#FF0000";
        return;
    }

    if(addressInput.value === ""){
        messageWarn.style.display = "flex";
        addressInput.style.borderColor = "#FF0000";
        return;
    }

    //enviar o pedido para whatsapp:
    const cartItems = cart.map((item) => {
        return (
            `${item.name}\nQuantidade: ${item.quantity}\nPreço: R$ ${item.price.toFixed(2)}\n\n`
        )
    }).join("")

    const message = encodeURIComponent(cartItems);
    const purchaseValue = updateCartModal().toFixed(2);
    const phone = ""; //Atribua um número de telefone a essa variável da seguinte forma: código do país + DDD + número de telefone, exemplo: +5521000000000 (entre aspas por ser String).
    
    window.open(`https://wa.me/${phone}?text=${message}Total: ${purchaseValue} | Nome: ${clientNameInput.value} | Endereço: ${addressInput.value}`, "_blank");

    cart.length = 0;
    clearInput();
    updateCartModal();

})

//limpar inputs:
function clearInput(){
    clientNameInput.value = "";
    addressInput.value = "";
    return;
}
