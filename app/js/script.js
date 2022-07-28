var input = document.querySelector("input");
var results = document.getElementById("autocomplete-results");

var blockSetting = [
  { name: "suggestion", isShow: true, index: 0 },
  { name: "collection", isShow: true, index: 1 },
  { name: "product", isShow: true, index: 2 },
];

var keyWords = ["t", "to", "top"];

function debounce(func, timeout = 1000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function compare(a, b) {
  if (a.index > b.index) return 1;
  if (a.index < b.index) return -1;
  return 0;
}

function search(keyword = "t") {
  fetch(`./json${keyword}.json`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      results.style.display = "block";
      const searchResult = blockSetting
        .sort(compare)
        .reduce((curBlock, nextBlock) => {
          if (nextBlock.isShow) {
            const block = `<div class="block">
                          <div class="title">${nextBlock.name}s</div>
                          ${data[nextBlock.name].reduce((curItem, nextItem) => {
                            const isNotProduct = nextBlock.name !== "product";
                            if (isNotProduct) {
                              const value =
                                nextBlock.name === "suggestion"
                                  ? nextItem.term
                                  : nextItem.title;
                              return (
                                curItem + `<div class="item">${value}</div>`
                              );
                            } else {
                              return (
                                curItem +
                                `<div class="product">
                                    <img src=${nextItem.image} alt="product-image">
                                    <div class="info">
                                      <div class="name">${nextItem.title}</div>
                                      <div class="brand">${nextItem.brand}</div>
                                      <div class="price">${nextItem.Price}</div>
                                    </div>
                                  </div>`
                              );
                            }
                          }, "")}
                        </div>`;
            return curBlock + block;
          }
          return curBlock;
        }, "");

      results.innerHTML = searchResult;
    });
}

input.onkeyup = debounce(function (e) {
  if (keyWords.includes(e.target.value)) {
    search(e.target.value);
  } else {
    results.style.display = "none";
  }
});
