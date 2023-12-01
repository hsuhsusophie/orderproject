let orderData = [];
const orderList = document.querySelector(".js-orderList");

function init() {
  getOrderList();
}
init();

function getOrderList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token
        }
      }
    )
    .then(function (response) {
      orderData = response.data.orders;

      let str = "";

      orderData.forEach(function (item) {
        //組產品字串
        let productStr = "";
        item.products.forEach(function (productItem) {
          productStr += `<p>${productItem.title}x${productItem.quantity}</p>`;
        });

        //組時間字串 將createdAt的值*1000轉毫秒單位
        const timeStamp = new Date(item.createdAt * 1000);
        const thisTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth()}/${timeStamp.getDate()}`;

        //判斷訂單處理狀態
        let orderStatus = "";
        if (item.paid == false) {
          orderStatus = "未處理";
        } else {
          orderStatus = "已處理";
        }

        str += `<tr>
            <td>${item.id}</td>
            <td>
              <p>${item.user.name}</p>
              <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
              ${productStr}
            </td>
            <td>${thisTime}</td>
            <td class="orderStatus " >
              <a href="#" class="js-orderStatus"  data-status="${item.paid}" data-id="${item.id}">${orderStatus}</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn js-orderDel" data-id="${item.id}" value="刪除">
            </td>
        </tr>`;
      });
      orderList.innerHTML = str;
      renderC3();
    });
}

//更改訂單狀態
orderList.addEventListener("click", function (e) {
  e.preventDefault();

  const changeOrderStatus = e.target.getAttribute("class");
  let id = e.target.getAttribute("data-id");

  // console.log(changeOrderStatus);
  if (changeOrderStatus == "js-orderStatus") {
    let status = e.target.getAttribute("data-status");
    changeOrderListStatus(status, id);
    return;
  }

  if (changeOrderStatus == "delSingleOrder-Btn js-orderDel") {
    // act=confirm("你確定要刪除這筆資料？");
    if (confirm("你確定要刪除這筆資料？")) {
      deleteOrderList(id);
    }

    return;
  }
});

function changeOrderListStatus(status, id) {
  let newStatus;
  if (status == true) {
    newStatus = false;
  } else {
    newStatus = true;
  }

  axios
    .put(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        data: {
          id: id,
          paid: newStatus
        }
      },
      {
        headers: {
          Authorization: token
        }
      }
    )
    .then(function (response) {
      alert("訂單狀態已修改");
      getOrderList();
    });
}

//刪除訂單
function deleteOrderList(id) {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,
      {
        headers: {
          Authorization: token
        }
      }
    )
    .then(function (response) {
      alert("該筆訂單資料已刪除！");
      getOrderList();
    });
}

//圖表

function renderC3() {
  let total = {};

  orderData.forEach(function (item) {
    item.products.forEach(function (productItem) {
      if (total[productItem.category] == undefined) {
        total[productItem.category] = productItem.price * productItem.quantity;
      } else {
        total[productItem.category] += productItem.price * productItem.quantity;
      }
    });
  });
  console.log(total);
  //做出資料關聯
  let categoryAry = Object.keys(total);
  console.log(categoryAry);

  let newData = [];
  categoryAry.forEach(function (item) {
    let ary = [];
    ary.push(item);
    ary.push(total[item]);
    newData.push(ary);
  });

  // C3.js
  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns: newData
    }
  });
}

//清除所有訂單資料
const delAllOrder = document.querySelector(".discardAllBtn");
delAllOrder.addEventListener("click", function (e) {
  e.preventDefault();
  
  const discardAllBtn = e.target.getAttribute("class");

  if (discardAllBtn == "discardAllBtn")
    if (confirm("你確定要刪除全部訂單資料？")) {
      delAllOrderList();
    }
  return;
});

function delAllOrderList() {
  
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token
        }
      }
    )
    .then(function (response) {
      alert("所有訂單資料已刪除！");
      getOrderList();
    });
}


