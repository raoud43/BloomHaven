document.addEventListener("DOMContentLoaded", function () {
  let navbar = document.querySelector(".navbar");
  let menuBar = document.querySelector("#menu-bar");
  let closeBtn = document.querySelector("#close");
  let themeToggler = document.querySelector("#theme-toggler");

  if (menuBar) {
    menuBar.onclick = () => {
      navbar.classList.toggle("active");
      document.body.style.overflow = navbar.classList.contains("active") ? "hidden" : "";
    };
  }

  if (closeBtn) {
    closeBtn.onclick = () => {
      navbar.classList.remove("active");
      document.body.style.overflow = "";
    };
  }

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navbar && navbar.classList.contains('active') && 
        !navbar.contains(e.target) && 
        !menuBar.contains(e.target) && 
        !closeBtn.contains(e.target)) {
      navbar.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking on a link
  document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
      if (navbar) {
        navbar.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  window.onscroll = () => {
    if (navbar) {
      navbar.classList.remove("active");
      document.body.style.overflow = "";
    }

    if (window.scrollY > 100) {
      document.querySelector("header").classList.add("active");
    } else {
      document.querySelector("header").classList.remove("active");
    }
  };

  if (themeToggler) {
    themeToggler.onclick = () => {
      themeToggler.classList.toggle("fa-sun");
      if (themeToggler.classList.contains("fa-sun")) {
        document.querySelector("body").classList.add("active");
      } else {
        document.querySelector("body").classList.remove("active");
      }
    };
  }

  // Small image click handlers
  document.querySelectorAll(".small-image-1").forEach((images) => {
    images.onclick = () => {
      let bigImage = document.querySelector(".big-image-1");
      if (bigImage) {
        bigImage.src = images.getAttribute("src");
      }
    };
  });

  document.querySelectorAll(".small-image-2").forEach((images) => {
    images.onclick = () => {
      let bigImage = document.querySelector(".big-image-2");
      if (bigImage) {
        bigImage.src = images.getAttribute("src");
      }
    };
  });

  document.querySelectorAll(".small-image-3").forEach((images) => {
    images.onclick = () => {
      let bigImage = document.querySelector(".big-image-3");
      if (bigImage) {
        bigImage.src = images.getAttribute("src");
      }
    };
  });

  // Countdown timer
  let countDate = new Date("aug 1, 2021 00:00:00").getTime();

  function countDown() {
    let now = new Date().getTime();
    let gap = countDate - now;

    let seconds = 1000;
    let minutes = seconds * 60;
    let hours = minutes * 60;
    let days = hours * 24;

    let d = Math.floor(gap / days);
    let h = Math.floor((gap % days) / hours);
    let m = Math.floor((gap % hours) / minutes);
    let s = Math.floor((gap % minutes) / seconds);

    let daysEl = document.getElementById("days");
    let hoursEl = document.getElementById("hours");
    let minutesEl = document.getElementById("minutes");
    let secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.innerText = d;
    if (hoursEl) hoursEl.innerText = h;
    if (minutesEl) minutesEl.innerText = m;
    if (secondsEl) secondsEl.innerText = s;
  }

  setInterval(countDown, 1000);

  // Initialize Swiper sliders
  if (document.querySelector(".product-slider")) {
    new Swiper(".product-slider", {
      slidesPerView: 3,
      loop: true,
      spaceBetween: 10,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        550: { slidesPerView: 2 },
        800: { slidesPerView: 3 },
        1000: { slidesPerView: 3 },
      },
    });
  }

  if (document.querySelector(".review-slider")) {
    new Swiper(".review-slider", {
      slidesPerView: 3,
      loop: true,
      spaceBetween: 10,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        550: { slidesPerView: 2 },
        800: { slidesPerView: 3 },
        1000: { slidesPerView: 3 },
      },
    });
  }

  // Add event listener for checkout button
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      // Store the current page URL before navigating to checkout
      localStorage.setItem("previousPage", window.location.href);

      // Get cart items from localStorage
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

      // Get product details for items in the cart
      const productBoxes = document.querySelectorAll(".products .box");
      const cartData = [];

      cartItems.forEach((productId) => {
        const productBox = Array.from(productBoxes).find(
          (box) => box.getAttribute("data-product-id") === productId
        );
        if (productBox) {
          const name = productBox.querySelector(".content h3").textContent;
          const price = productBox.querySelector(".content .price").textContent.split("SAR")[0].trim();
          const image = productBox.querySelector(".image img").src;

          cartData.push({
            id: productId,
            name: name,
            price: price,
            image: image,
          });
        }
      });

      // Save cart data to localStorage
      localStorage.setItem("checkoutData", JSON.stringify(cartData));

      // Navigate to checkout page
      window.location.href = "checkout.html";
    });
  }

  // Initialize checkout page if we're on it
  if (document.querySelector(".payment-methods")) {
    // Retrieve checkout data from localStorage
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData")) || [];

    // Calculate order summary using checkout data
    function calculateOrderSummary() {
      let subtotal = 0;
      const checkoutItemsContainer = document.createElement("div");
      checkoutItemsContainer.className = "checkout-items mb-4";

      const orderSummaryCard = document.querySelector(".card-body");
      if (!orderSummaryCard) return;

      const existingItems = orderSummaryCard.querySelector(".checkout-items");
      if (existingItems) {
        existingItems.remove();
      }

      orderSummaryCard.insertBefore(checkoutItemsContainer, orderSummaryCard.firstChild);

      // Display each item in the checkout data
      checkoutData.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "checkout-item d-flex justify-content-between align-items-center mb-2";
        itemDiv.innerHTML = `
          <div class="d-flex align-items-center">
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
            <div>
              <h6 class="mb-0">${item.name}</h6>
              <small class="text-muted">${item.price} SAR</small>
            </div>
          </div>
        `;
        checkoutItemsContainer.appendChild(itemDiv);

        // Add to subtotal
        subtotal += parseFloat(item.price);
      });

      const deliveryFee = 20.0;
      const taxRate = 0.15; // 15% VAT
      const tax = subtotal * taxRate;
      const total = subtotal + deliveryFee + tax;

      // Update summary display
      const subtotalElement = document.querySelector(".subtotal");
      const taxElement = document.querySelector(".tax");
      const totalElement = document.querySelector(".total");

      if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)} SAR`;
      if (taxElement) taxElement.textContent = `${tax.toFixed(2)} SAR`;
      if (totalElement) totalElement.textContent = `${total.toFixed(2)} SAR`;
    }

    calculateOrderSummary();

    // Handle back button click
    const backButton = document.getElementById("backButton");
    if (backButton) {
      backButton.addEventListener("click", function() {
        const previousPage = localStorage.getItem("previousPage");
        if (previousPage) {
          window.location.href = previousPage;
        } else {
          window.location.href = "index.html"; // Fallback to home page
        }
      });
    }

    // Get the confirm order button and remove the inline onclick
    const confirmOrderBtn = document.querySelector("button.btn-primary");
    confirmOrderBtn.removeAttribute("onclick");

    // Add event listener for order confirmation
    confirmOrderBtn.addEventListener("click", processOrder);

    // Setup payment method radio buttons
    const paymentRadios = document.querySelectorAll(
      'input[name="paymentMethod"]'
    );
    const creditCardDetails = document.querySelector(".payment-details");

    paymentRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.id === "creditCard") {
          creditCardDetails.style.display = "block";
        } else {
          creditCardDetails.style.display = "none";
        }
      });
    });
  }
});

// Search and Filter functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get all necessary elements
  const searchInput = document.getElementById("searchInput");
  const sortProducts = document.getElementById("sort-products");
  const priceRange = document.getElementById("price-range");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productBoxes = document.querySelectorAll(".products .box");
  const noResults = document.getElementById("no-results");
  const boxContainer = document.querySelector(".products .box-container");

  // Initialize filters
  let currentFilter = "all";
  let currentSort = "featured";
  let currentPriceRange = "all";

  // Add event listeners for search
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      updateProducts();
    });
  }

  // Add event listeners for sorting
  if (sortProducts) {
    sortProducts.addEventListener("change", function () {
      currentSort = this.value;
      updateProducts();
    });
  }

  // Add event listeners for price range
  if (priceRange) {
    priceRange.addEventListener("change", function () {
      currentPriceRange = this.value;
      updateProducts();
    });
  }

  // Add event listeners for filter buttons
  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        currentFilter = this.getAttribute("data-filter");
        updateProducts();
      });
    });
  }

  function updateProducts() {
    if (!productBoxes.length) return;

    const searchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";
    let visibleProducts = 0;

    productBoxes.forEach((box) => {
      const productName = box
        .querySelector(".content h3")
        .textContent.toLowerCase();
      const priceElement = box.querySelector(".content .price");
      const priceText = priceElement.textContent.split("SAR")[0].trim();
      const price = parseFloat(priceText);

      const matchesSearch = productName.includes(searchTerm);
      const matchesFilter =
        currentFilter === "all" || box.classList.contains(currentFilter);
      const matchesPrice = checkPriceRange(price, currentPriceRange);

      if (matchesSearch && matchesFilter && matchesPrice) {
        box.style.display = "";
        visibleProducts++;
      } else {
        box.style.display = "none";
      }
    });

    if (noResults) {
      noResults.style.display = visibleProducts === 0 ? "block" : "none";
    }

    if (visibleProducts > 0) {
      sortVisibleProducts(currentSort);
    }
  }

  function checkPriceRange(price, range) {
    if (range === "all") return true;

    const ranges = {
      "0-50": (price) => price <= 50,
      "50-100": (price) => price > 50 && price <= 100,
      "100+": (price) => price > 100,
    };

    return ranges[range] ? ranges[range](price) : true;
  }

  function sortVisibleProducts(sortType) {
    if (!boxContainer) return;

    const boxes = Array.from(productBoxes).filter(
      (box) => box.style.display !== "none"
    );

    boxes.sort((a, b) => {
      const priceA = parseFloat(
        a.querySelector(".content .price").textContent.split("SAR")[0].trim()
      );
      const priceB = parseFloat(
        b.querySelector(".content .price").textContent.split("SAR")[0].trim()
      );
      const nameA = a.querySelector(".content h3").textContent.toLowerCase();
      const nameB = b.querySelector(".content h3").textContent.toLowerCase();

      switch (sortType) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "name":
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

    boxes.forEach((box) => boxContainer.appendChild(box));
  }

  // Initialize wishlist functionality
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  updateCounters(); // Initialize counter on page load

  // Add event listeners for wishlist buttons
  document.querySelectorAll(".wishlist-toggle").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const productBox = this.closest(".box");
      const productId = productBox.getAttribute("data-product-id");
      if (productId) {
        toggleWishlist(productId);
      }
    });
  });

  // Add event listener for wishlist button in header
  const wishlistBtn = document.querySelector("#wishlist-btn");
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const wishlistModal = document.querySelector(".wishlist-modal");
      if (wishlistModal) {
        wishlistModal.style.display = "flex";
        updateWishlistDisplay();
      }
    });
  }

  // Add event listener for close wishlist modal
  const closeWishlist = document.querySelector(".close-wishlist");
  if (closeWishlist) {
    closeWishlist.addEventListener("click", function () {
      const wishlistModal = document.querySelector(".wishlist-modal");
      if (wishlistModal) {
        wishlistModal.style.display = "none";
      }
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", function (e) {
    const wishlistModal = document.querySelector(".wishlist-modal");
    if (e.target === wishlistModal) {
      wishlistModal.style.display = "none";
    }
  });

  function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    const heartIcon = document.querySelector(
      `.box[data-product-id="${productId}"] .wishlist-toggle`
    );
    const productBox = document.querySelector(`.box[data-product-id="${productId}"]`);

    if (index === -1) {
      wishlist.push(productId);
      
      // Store product details in localStorage
      if (productBox) {
        const name = productBox.querySelector(".content h3").textContent;
        const price = productBox.querySelector(".content .price").textContent.trim();
        const image = productBox.querySelector(".image img").src;
        
        // Get existing wishlist items or initialize empty array
        let wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
        
        // Add new item to wishlist items
        wishlistItems.push({
          id: productId,
          name: name,
          price: price,
          image: image
        });
        
        // Save updated wishlist items
        localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
      }
      
      showNotification("Added to wishlist");
      if (heartIcon) heartIcon.classList.add("active");
    } else {
      wishlist.splice(index, 1);
      
      // Remove product details from localStorage
      let wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
      wishlistItems = wishlistItems.filter(item => item.id !== productId);
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
      
      showNotification("Removed from wishlist");
      if (heartIcon) heartIcon.classList.remove("active");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateCounters();
    updateWishlistDisplay();
  }

  function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";

    // Add appropriate icon based on message
    let icon = "";
    if (message.includes("wishlist")) {
      icon = '<i class="fas fa-heart"></i>';
    } else if (message.includes("cart")) {
      icon = '<i class="fas fa-shopping-cart"></i>';
    } else if (message.includes("share")) {
      icon = '<i class="fas fa-share-alt"></i>';
    }

    notification.innerHTML = `${icon} ${message}`;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = "slideDown 0.5s ease-out";
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 3000);
  }

  function updateWishlistDisplay() {
    const wishlistItems = document.querySelector(".wishlist-items");
    const emptyWishlist = document.querySelector(".empty-wishlist");

    if (!wishlistItems || !emptyWishlist) return;

    if (wishlist.length === 0) {
      wishlistItems.style.display = "none";
      emptyWishlist.style.display = "block";
      return;
    }

    wishlistItems.style.display = "grid";
    emptyWishlist.style.display = "none";
    wishlistItems.innerHTML = "";

    const wishlistProducts = Array.from(productBoxes).filter((box) =>
      wishlist.includes(box.getAttribute("data-product-id"))
    );

    wishlistProducts.forEach((box) => {
      const productId = box.getAttribute("data-product-id");
      const name = box.querySelector(".content h3").textContent;
      const priceElement = box.querySelector(".content .price");
      const priceText = priceElement.textContent.trim();
      
      // Extract current price and old price
      let currentPrice = priceText;
      let oldPrice = "";
      
      // Check if price contains both current and old price
      if (priceText.includes("SAR") && priceText.includes("SAR", priceText.indexOf("SAR") + 3)) {
        // Split by SAR to get current price and old price
        const priceParts = priceText.split("SAR");
        
        // Format current price with SAR
        currentPrice = priceParts[0].trim() + " SAR";
        
        // Format old price with SAR if it exists
        if (priceParts.length > 1) {
          oldPrice = priceParts[1].trim() + " SAR";
        }
      } else {
        // If no old price, ensure current price has SAR
        if (!currentPrice.includes("SAR")) {
          currentPrice = `${currentPrice} SAR`;
        }
      }
      
      const image = box.querySelector(".image img").src;

      const itemElement = document.createElement("div");
      itemElement.className = "wishlist-item";
      itemElement.setAttribute("data-product-id", productId);
      itemElement.innerHTML = `
                <img src="${image}" alt="${name}">
                <h3>${name}</h3>
                <div class="price">
                    ${oldPrice ? `<span class="old-price">${oldPrice}</span>` : ''}
                    <span class="current-price">${currentPrice}</span>
                </div>
                <div class="wishlist-buttons">
                    <button class="remove-wishlist" data-product-id="${productId}">
                        <i class="fas fa-times"></i> Remove
                    </button>
                </div>
            `;
      wishlistItems.appendChild(itemElement);

      // Add event listener for remove button
      const removeButton = itemElement.querySelector(".remove-wishlist");
      removeButton.addEventListener("click", function () {
        const productId = this.getAttribute("data-product-id");
        toggleWishlist(productId);
      });
    });
  }

  function updateCounters() {
    const wishlistCounter = document.querySelector(".wishlist-counter");
    if (wishlistCounter) {
      wishlistCounter.textContent = wishlist.length;
      wishlistCounter.classList.toggle("active", wishlist.length > 0);
    }
  }

  // Initialize cart functionality
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartCounter(); // Initialize counter on page load

  // Add event listeners for cart buttons
  document.querySelectorAll(".cart-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const productBox = this.closest(".box");
      const productId = productBox.getAttribute("data-product-id");
      if (productId) {
        toggleCart(productId);
      }
    });
  });

  // Add event listener for cart button in header
  const cartBtn = document.querySelector("#cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const cartModal = document.querySelector(".cart-modal");
      if (cartModal) {
        cartModal.style.display = "flex";
        updateCartDisplay();
      }
    });
  }

  // Add event listener for close cart modal
  const closeCart = document.querySelector(".close-cart");
  if (closeCart) {
    closeCart.addEventListener("click", function () {
      const cartModal = document.querySelector(".cart-modal");
      if (cartModal) {
        cartModal.style.display = "none";
      }
    });
  }

  // Close cart modal when clicking outside
  window.addEventListener("click", function (e) {
    const cartModal = document.querySelector(".cart-modal");
    if (e.target === cartModal) {
      cartModal.style.display = "none";
    }
  });

  function toggleCart(productId) {
    const index = cart.indexOf(productId);
    const cartIcon = document.querySelector(
      `.box[data-product-id="${productId}"] .cart-btn`
    );

    if (index === -1) {
      cart.push(productId);
      showNotification("Added to cart");
      if (cartIcon) cartIcon.classList.add("active");
    } else {
      cart.splice(index, 1);
      showNotification("Removed from cart");
      if (cartIcon) cartIcon.classList.remove("active");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCounters();
    updateCartDisplay();
  }

  function updateCartCounter() {
    const cartCounter = document.querySelector(".cart-counter");
    if (cartCounter) {
      cartCounter.textContent = cart.length;
      cartCounter.classList.toggle("active", cart.length > 0);
      cartCounter.style.display = cart.length > 0 ? "flex" : "none";
    }
  }

  function updateCartDisplay() {
    const cartItems = document.querySelector(".cart-items");
    const emptyCart = document.querySelector(".empty-cart");
    const cartFooter = document.querySelector(".cart-footer");
    const totalPriceElement = document.querySelector(".total-price");
    const discountAmountElement = document.querySelector(".discount-amount");

    if (
      !cartItems ||
      !emptyCart ||
      !cartFooter ||
      !totalPriceElement ||
      !discountAmountElement
    )
      return;

    if (cart.length === 0) {
      cartItems.style.display = "none";
      emptyCart.style.display = "block";
      cartFooter.style.display = "none";
      updateCartCounter();
      return;
    }

    cartItems.style.display = "grid";
    emptyCart.style.display = "none";
    cartFooter.style.display = "flex";
    cartItems.innerHTML = "";

    let totalPrice = 0;
    let totalDiscount = 0;
    const cartProducts = Array.from(productBoxes).filter((box) =>
      cart.includes(box.getAttribute("data-product-id"))
    );

    cartProducts.forEach((box) => {
      const productId = box.getAttribute("data-product-id");
      const name = box.querySelector(".content h3").textContent;
      const priceElement = box.querySelector(".content .price");
      const price = priceElement.textContent.split("SAR")[0].trim();
      const originalPrice =
        priceElement
          .querySelector("span")
          ?.textContent.split("SAR")[0]
          .trim() || price;
      const image = box.querySelector(".image img").src;

      // Extract numeric price values
      const priceValue = parseFloat(price);
      const originalPriceValue = parseFloat(originalPrice);
      const discount = originalPriceValue - priceValue;

      totalPrice += priceValue;
      totalDiscount += discount;

      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.setAttribute("data-product-id", productId);
      itemElement.innerHTML = `
            <img src="${image}" alt="${name}">
            <div class="content">
                <h3>${name}</h3>
                <div class="price-container">
                    <span class="original-price">${originalPriceValue.toFixed(
                      2
                    )} SAR</span>
                    <span class="price">${priceValue.toFixed(2)} SAR</span>
                </div>
                ${
                  discount > 0
                    ? `<div class="discount">Save ${discount.toFixed(
                        2
                      )} SAR</div>`
                    : ""
                }
            </div>
            <button class="remove-cart" data-product-id="${productId}">
                <i class="fas fa-times"></i> Remove
            </button>
        `;
      cartItems.appendChild(itemElement);

      // Add event listener for remove button
      const removeButton = itemElement.querySelector(".remove-cart");
      removeButton.addEventListener("click", function () {
        const productId =
          this.closest(".cart-item").getAttribute("data-product-id");
        if (productId) {
          removeFromCart(productId);
        }
      });
    });

    // Update total price and discount
    totalPriceElement.textContent = `${totalPrice.toFixed(2)} SAR`;
    if (totalDiscount > 0) {
      discountAmountElement.textContent = `You saved: ${totalDiscount.toFixed(
        2
      )} SAR`;
      discountAmountElement.style.display = "block";
    } else {
      discountAmountElement.style.display = "none";
    }

    updateCartCounter();
  }

  function removeFromCart(productId) {
    const index = cart.indexOf(productId);
    if (index !== -1) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCounter();
      updateCartDisplay();
      showNotification("Removed from cart");
    }
  }

  // Initial update to ensure everything is displayed correctly
  updateCartCounter();
  updateCounters();
});

// Menu functionality
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const menuBar = document.querySelector("#menu-bar");
  const toggler = document.querySelector("#toggler");
  const closeBtn = document.querySelector("#close");

  if (menuBar) {
    menuBar.addEventListener("click", function () {
      navbar.classList.toggle("active");
    });
  }

  if (toggler) {
    toggler.addEventListener("change", function () {
      navbar.classList.toggle("active");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      navbar.classList.remove("active");
      if (toggler) {
        toggler.checked = false;
      }
    });
  }

  window.addEventListener("scroll", function () {
    navbar.classList.remove("active");
    if (toggler) {
      toggler.checked = false;
    }

    if (window.scrollY > 100) {
      document.querySelector("header").classList.add("active");
    } else {
      document.querySelector("header").classList.remove("active");
    }
  });
});

// Initialize counters
let cart = [];
let wishlist = [];

// Update counters function
function updateCounters() {
  const wishlistCounter = document.querySelector(".wishlist-counter");
  if (wishlistCounter) {
    wishlistCounter.textContent = wishlist.length;
    wishlistCounter.classList.toggle("active", wishlist.length > 0);
  }

  // Update cart counter
  const cartCounter = document.querySelector(".cart-counter");
  if (cartCounter) {
    cartCounter.textContent = cart.length;
    cartCounter.style.display = cart.length > 0 ? "flex" : "none";
  }
}

// Initialize counters when page loads
document.addEventListener("DOMContentLoaded", function () {
  updateCounters();
});

// Add to cart function
function addToCart(productId) {
  // Check if product is already in cart
  const index = cart.indexOf(productId);
  if (index === -1) {
    cart.push(productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
    updateCartDisplay();
    showNotification("Added to cart");
    
    // Remove from wishlist if it exists there
    const wishlistIndex = wishlist.indexOf(productId);
    if (wishlistIndex !== -1) {
      wishlist.splice(wishlistIndex, 1);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      updateCounters();
      updateWishlistDisplay();
    }
  }
}

// Personal Information Form Handling
document.addEventListener("DOMContentLoaded", function () {
  const infoForm = document.querySelector(".info-form");
  if (!infoForm) return;

  // Load saved information if exists
  const savedInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  if (savedInfo) {
    Object.keys(savedInfo).forEach((key) => {
      const input = document.getElementById(key);
      if (input) input.value = savedInfo[key];
    });
  }

  // Handle form submission
  infoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      postal: document.getElementById("postal").value,
    };

    // Save to localStorage
    localStorage.setItem("userInfo", JSON.stringify(formData));

    // Show success message
    showNotification("Information saved successfully!");
  });
});

// Add keyframe animations for notification
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

function shareProduct(name, price, image) {
  const shareData = {
    title: "Check out this beautiful flower from BloomHaven!",
    text: `${name} - ${price} SAR\n\n🌸 Beautiful flowers for every occasion 🌸\nVisit BloomHaven for more amazing flowers!`,
    url: window.location.href,
  };

  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => showNotification("Product shared successfully!"))
      .catch((error) => {
        console.error("Error sharing:", error);
        showNotification("Error sharing product");
      });
  } else {
    const text = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => showNotification("Product link copied to clipboard!"))
        .catch(() => showNotification("Could not copy link"));
    } else {
      showNotification("Sharing not supported in this browser");
    }
  }
}

// Update the products box container to include share button
document.querySelectorAll(".products .box-container .box").forEach((box) => {
  const icons = box.querySelector(".icons");
  if (!icons.querySelector(".share-btn")) {
    const name = box.querySelector(".content h3").textContent;
    const price = box.querySelector(".content .price").textContent;
    const image = box.querySelector(".image img").src;

    const shareBtn = document.createElement("a");
    shareBtn.className = "share-btn";
    shareBtn.innerHTML = '<i class="fas fa-share"></i>';
    shareBtn.href = "#";
    shareBtn.onclick = (e) => {
      e.preventDefault();
      shareProduct(name, price, image);
    };
    icons.appendChild(shareBtn);
  }
});

function updateWishlistCounter() {
  const wishlistCounter = document.querySelector(".wishlist-counter");
  if (wishlistCounter) {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlistCounter.textContent = wishlistItems.length;
  }
}

// Update counters when page loads
document.addEventListener("DOMContentLoaded", function () {
  updateCartCounter();
  updateWishlistCounter();
});

// Update counters when cart/wishlist changes
window.addEventListener("storage", function (e) {
  if (e.key === "cart") {
    updateCartCounter();
  }
  if (e.key === "wishlist") {
    updateWishlistCounter();
  }
});

function processOrder() {
  // Validate required shipping information
  const requiredFields = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    city: document.getElementById('city').value,
    address: document.getElementById('address').value
  };

  // Check if any required field is empty
  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value.trim()) {
      alert(`Please fill in your ${field}`);
      document.getElementById(field).focus();
      return;
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(requiredFields.email)) {
    alert('Please enter a valid email address');
    document.getElementById('email').focus();
    return;
  }

  // Validate phone number (basic validation)
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(requiredFields.phone)) {
    alert('Please enter a valid phone number');
    document.getElementById('phone').focus();
    return;
  }

  // Get selected payment method
  const selectedPayment = document.querySelector(
    'input[name="paymentMethod"]:checked'
  );

  if (!selectedPayment) {
    alert("Please select a payment method");
    return;
  }

  // Get cart items from localStorage
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  if (cartItems.length === 0) {
    alert("Your cart is empty");
    return;
  }

  // If credit card is selected, validate card details
  if (selectedPayment.id === "creditCard") {
    const cardNumber = document.querySelector(
      'input[placeholder="Card Number"]'
    ).value;
    const expiry = document.querySelector('input[placeholder="MM/YY"]').value;
    const cvv = document.querySelector('input[placeholder="CVV"]').value;

    if (!cardNumber || !expiry || !cvv) {
      alert("Please enter all credit card details");
      return;
    }

    // Validate card number (basic validation)
    const cardNumberRegex = /^[\d\s-]{13,19}$/;
    if (!cardNumberRegex.test(cardNumber.replace(/\s/g, ''))) {
      alert("Please enter a valid card number");
      return;
    }

    // Validate expiry date (MM/YY format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiry)) {
      alert("Please enter a valid expiry date (MM/YY)");
      return;
    }

    // Validate CVV (3-4 digits)
    const cvvRegex = /^[0-9]{3,4}$/;
    if (!cvvRegex.test(cvv)) {
      alert("Please enter a valid CVV");
      return;
    }
  }

  // Create order object
  const order = {
    id: Date.now(),
    paymentMethod: selectedPayment.id,
    items: cartItems,
    date: new Date().toISOString(),
    status: "pending",
    total: document.querySelector(".total").textContent,
    shippingInfo: requiredFields
  };

  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Clear cart and checkout data
  localStorage.removeItem("cart");
  localStorage.removeItem("checkoutData");

  // Show success message
  alert("Your order has been confirmed successfully!");

  // Redirect to track order page
  setTimeout(() => {
    window.location.href = "track-order.html";
  }, 1500);
}