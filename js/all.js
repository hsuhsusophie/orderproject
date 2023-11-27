const productList = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');
const cartList = document.querySelector('.shoppingCart-tableList');
let productData = [];
let cartData = [];
//初始化
function init() {
    getProductList();
    getCartList();
}
init();


//get產品列表
 function getProductList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
        .then(function (response) {
            productData = response.data.products;
            renderProductList();
        })
}


//函式 消除重複 有兩處以上 
function combineProductHTMLItem(item){
return `<li>
<li class="productCard">
<h4 class="productType">新品</h4>
<img src="${item.images}"
alt="">
<a href="#" class="js-addCart" id="addCardBtn" data-id="${item.id}">加入購物車</a>
<h3>${item.title}</h3>
<del class="originPrice">${item.origin_price}</del>
<p class="nowPrice">${item.price}</p>
</li>
</li>`
}

function renderProductList(){
    let str = "";
    productData.forEach(function (item) {
        str += combineProductHTMLItem(item);
    })
    productList.innerHTML = str;

}

//select product
productSelect.addEventListener('change', function (e) {
    // console.log(e.target.value);
    const category = e.target.value;
    if(category=="全部"){
        renderProductList();
        return;
    }
    let str = "";
    productData.forEach(function(item){
        if(item.category== category){
            str += combineProductHTMLItem(item);
        }
    })
    productList.innerHTML = str;

})


// 點擊加入購物車
productList.addEventListener("click",function(e){
    e.preventDefault();
   let addCartClass = e.target.getAttribute("class");
   if(addCartClass!=="js-addCart"){
    return;
   }

let productId = e.target.getAttribute("data-id");
console.log(productId);

let numCheck = 1;
cartData.forEach(function(item){
    if (item.product.id === productId){
        numCheck = item.quantity+=1;
    }
})
axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
        "data": {
          "productId": productId,
          "quantity": numCheck
        }
      }).then(function(response){
        alert("加入購物車");
        getCartList();
      })
})


//取得購物車列表
function getCartList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts
    `)
    .then(function (response) {
        //總金額
       document.querySelector(".js-total").textContent = response.data.finalTotal;
       cartData = response.data.carts;
       let str = "";
       cartData.forEach(function(item){
        str += ` <tr>
        <td>
            <div class="cardItem-title">
                <img src="${item.product.images}" alt="">
                <p>${item.product.title}</p>
            </div>
        </td>
        <td>${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>${item.product.price * item.quantity}</td>
        <td class="discardBtn">
            <a href="#" class="material-icons" data-id="${item.id}">
                clear
            </a>
        </td>
    </tr>`
       });
       cartList.innerHTML = str; 
    })
}


//刪除購物車
cartList.addEventListener('click',function(e){
e.preventDefault();
//刪除body內的x
const cartId = e.target.getAttribute("data-id");
if(cartId==null){
    alert("123")
    return;
}
console.log(cartId);
axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}
`)
.then(function(response){
    alert("刪除單筆購物車成功");
    getCartList();
})
})

//一鍵刪除全部購物車
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click",function(e){
    e.preventDefault();
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/
    `)
    .then(function(response){
        console.log(response)
            alert("刪除全部購物車成功");
            getCartList();
        })
        .catch(function(response){
            alert("購物車已清空，請勿重複點擊")

        })
    })
