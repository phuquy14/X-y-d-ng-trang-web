/**
 * TEA STATION - ULTRA PRO JAVASCRIPT
 * Môn học: Xây dựng trang web - FPT Polytechnic
 * Full features: Dark Mode, Shopping Cart, Category Filter, Table Search,
 * Interactive Map (Leaflet), Lightbox, Slideshow, Chatbot AI & Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. DARK / LIGHT THEME TOGGLE CONTROLLER
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const savedTheme = localStorage.getItem('teastation_theme') || 'light';

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeIcon) themeIcon.className = 'fas fa-sun';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('teastation_theme', isDark ? 'dark' : 'light');
      if (themeIcon) {
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
      }
      showToast(isDark ? '🌙 Đã kích hoạt Chế độ Tối (Dark Mode)' : '☀️ Đã chuyển sang Chế độ Sáng (Light Mode)');
    });
  }

  /* ==========================================================================
     2. SIDEBAR NAVIGATION CONTROLLER
     ========================================================================== */
  const navBtn = document.getElementById('nav-btn');
  const sidebar = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarLinks = document.querySelectorAll('.sidebar-links a');

  function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (navBtn) navBtn.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

  /* ==========================================================================
     3. SHOPPING CART SYSTEM (GIỎ HÀNG THÔNG MINH)
     ========================================================================== */
  let cart = JSON.parse(localStorage.getItem('teastation_cart')) || [];
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartBadge = document.getElementById('cart-badge');
  const cartItemsBody = document.getElementById('cart-items-body');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const checkoutBtn = document.getElementById('checkout-btn');

  function saveCart() {
    localStorage.setItem('teastation_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.style.transform = 'scale(1.3)';
      setTimeout(() => cartBadge.style.transform = 'scale(1)', 200);
    }

    if (!cartItemsBody) return;

    if (cart.length === 0) {
      cartItemsBody.innerHTML = `
        <div class="cart-empty-state">
          <i class="fas fa-shopping-basket"></i>
          <p>Giỏ hàng của bạn đang trống</p>
          <a href="#products" class="btn btn-primary" style="margin-top:10px; padding:8px 20px; font-size:0.8rem;" onclick="closeCartDrawer()">Khám phá trà</a>
        </div>
      `;
      if (cartTotalPrice) cartTotalPrice.textContent = '$0.00';
      return;
    }

    let total = 0;
    cartItemsBody.innerHTML = '';

    cart.forEach((item, index) => {
      const itemSubtotal = item.price * item.quantity;
      total += itemSubtotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h5>${item.name}</h5>
          <span class="cart-item-price">$${item.price.toFixed(2)}</span>
        </div>
        <div class="cart-item-actions">
          <button class="cart-qty-btn" data-action="decrease" data-index="${index}">-</button>
          <span style="font-weight:600; font-size:0.9rem;">${item.quantity}</span>
          <button class="cart-qty-btn" data-action="increase" data-index="${index}">+</button>
          <button class="cart-item-remove" data-action="remove" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
        </div>
      `;
      cartItemsBody.appendChild(itemEl);
    });

    if (cartTotalPrice) cartTotalPrice.textContent = `$${total.toFixed(2)}`;
  }

  function openCartDrawer() {
    if (cartDrawer) {
      cartDrawer.classList.add('active');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  window.closeCartDrawer = function() {
    if (cartDrawer) cartDrawer.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);

  // Thêm vào giỏ hàng
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.product-card');
      const name = card.querySelector('h4').textContent.trim();
      const priceText = card.querySelector('.product-price').textContent.replace('$', '').trim();
      const price = parseFloat(priceText) || 0;
      const image = card.querySelector('img').src;

      const existingIndex = cart.findIndex(item => item.name === name);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ name, price, image, quantity: 1 });
      }

      saveCart();
      showToast(`Đã thêm "${name}" vào giỏ hàng!`);
    });
  });

  // Tăng/giảm/xóa trong giỏ hàng
  if (cartItemsBody) {
    cartItemsBody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.dataset.action;
      const index = parseInt(btn.dataset.index, 10);

      if (action === 'increase') {
        cart[index].quantity += 1;
      } else if (action === 'decrease') {
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
      } else if (action === 'remove') {
        cart.splice(index, 1);
      }
      saveCart();
    });
  }

  // Nút thanh toán
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống! Hãy chọn món trà yêu thích nhé.');
        return;
      }
      const total = cartTotalPrice ? cartTotalPrice.textContent : '$0.00';
      showToast(`Đặt hàng thành công với tổng thanh toán ${total}! Cảm ơn quý khách.`);
      cart = [];
      saveCart();
      setTimeout(closeCartDrawer, 1200);
    });
  }

  // Khởi tạo UI giỏ hàng
  updateCartUI();

  /* ==========================================================================
     4. PRODUCT SLIDESHOW / CAROUSEL (Y4: SLIDESHOW)
     ========================================================================== */
  const slider = document.getElementById('products-slider');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');
  let currentSlideIndex = 0;
  let autoSlideInterval;

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    return 2;
  }

  function updateSlider() {
    if (!slider) return;
    const cards = slider.querySelectorAll('.product-card:not([style*="display: none"])');
    const totalCards = cards.length;
    if (totalCards === 0) return;

    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, totalCards - cardsPerView);

    if (currentSlideIndex > maxIndex) {
      currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
      currentSlideIndex = maxIndex;
    }

    const cardWidth = cards[0].offsetWidth + 26;
    slider.style.transform = `translateX(-${currentSlideIndex * cardWidth}px)`;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSlideIndex++;
      updateSlider();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlideIndex--;
      updateSlider();
      resetAutoSlide();
    });
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      currentSlideIndex++;
      updateSlider();
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  if (slider) {
    startAutoSlide();
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', startAutoSlide);
  }

  window.addEventListener('resize', updateSlider);

  /* ==========================================================================
     5. BỘ LỌC DANH MỤC TRÀ (CATEGORY FILTERING)
     ========================================================================== */
  const filterPills = document.querySelectorAll('.filter-pill');
  if (filterPills.length > 0 && slider) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const category = pill.dataset.filter;
        const cards = slider.querySelectorAll('.product-card');

        cards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });

        currentSlideIndex = 0;
        updateSlider();
      });
    });
  }

  /* ==========================================================================
     6. TÌM KIẾM DỮ LIỆU BẢNG MENU (TABLE LIVE SEARCH)
     ========================================================================== */
  const tableSearchInput = document.getElementById('table-search-input');
  if (tableSearchInput) {
    tableSearchInput.addEventListener('keyup', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = document.querySelectorAll('.tea-table tbody tr');

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  /* ==========================================================================
     7. LIGHTBOX MODAL (Y4: LIGHTBOX)
     ========================================================================== */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

  function openLightbox(imgSrc, captionText) {
    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = captionText || 'Tea Station';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  lightboxTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card') || btn.closest('.service-card');
      const img = card ? card.querySelector('img') : null;
      const title = card ? (card.querySelector('h4') || card.querySelector('h3')) : null;
      if (img) {
        openLightbox(img.src, title ? title.textContent : '');
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ==========================================================================
     8. INTERACTIVE MAP SYSTEM (GOOGLE MAPS & LEAFLET PRO TẠI HÀ NỘI)
     Vị trí: 54 Tràng Tiền, Hoàn Kiếm, Hà Nội, Việt Nam
     ========================================================================== */
  const btnTabGgmap = document.getElementById('btn-tab-ggmap');
  const btnTabLeaflet = document.getElementById('btn-tab-leaflet');
  const googleMapView = document.getElementById('google-map-view');
  const leafletMapView = document.getElementById('leaflet-map-view');
  let leafletMapInstance = null;

  function initLeafletMap() {
    const mapElement = document.getElementById('leaflet-map');
    if (!mapElement || typeof L === 'undefined' || leafletMapInstance) return;

    // Toạ độ 54 Tràng Tiền, Hoàn Kiếm, Hà Nội
    const hanoiCoords = [21.0285, 105.8542];
    leafletMapInstance = L.map('leaflet-map', {
      scrollWheelZoom: false
    }).setView(hanoiCoords, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMapInstance);

    // Marker ghim vị trí chuẩn theo mẫu PDF trang 5
    const teaIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="background-color:#698236;color:#fff;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 15px rgba(0,0,0,0.35);border:2px solid #fff;"><i class="fas fa-mug-hot" style="font-size:16px;"></i></div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const marker = L.marker(hanoiCoords, { icon: teaIcon }).addTo(leafletMapInstance);
    // Popup có chữ "Here we are" theo đúng hình trang 5 trong Assignment.pdf
    marker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans', sans-serif; padding:4px; text-align:center;">
        <span style="background:#698236; color:#fff; font-size:11px; font-weight:700; padding:2px 8px; border-radius:10px; display:inline-block; margin-bottom:4px;">Here we are</span>
        <h4 style="margin:2px 0; color:#232724; font-size:13px; font-weight:800;">TEA STATION HÀ NỘI</h4>
        <p style="margin:0; font-size:11px; color:#666;">54 Tràng Tiền, Hoàn Kiếm, Hà Nội</p>
      </div>
    `).openPopup();
  }

  // Chuyển sang Google Maps
  if (btnTabGgmap && googleMapView && leafletMapView) {
    btnTabGgmap.addEventListener('click', () => {
      btnTabGgmap.classList.add('active');
      if (btnTabLeaflet) btnTabLeaflet.classList.remove('active');
      googleMapView.classList.add('active');
      leafletMapView.classList.remove('active');
      showToast('Đang hiển thị bản đồ Google Maps Hà Nội');
    });
  }

  // Chuyển sang Leaflet Map
  if (btnTabLeaflet && googleMapView && leafletMapView) {
    btnTabLeaflet.addEventListener('click', () => {
      btnTabLeaflet.classList.add('active');
      if (btnTabGgmap) btnTabGgmap.classList.remove('active');
      leafletMapView.classList.add('active');
      googleMapView.classList.remove('active');
      
      initLeafletMap();
      if (leafletMapInstance) {
        setTimeout(() => {
          leafletMapInstance.invalidateSize();
        }, 150);
      }
      showToast('Đang hiển thị bản đồ nghệ thuật Leaflet Hà Nội');
    });
  }

  // Khởi tạo sẵn Leaflet Map trong nền
  setTimeout(initLeafletMap, 1000);

  /* ==========================================================================
     9. AI CHATBOT ASSISTANT PRO (CÓ TYPING EFFECT & NHIỀU KỊCH BẢN)
     ========================================================================== */
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const chatWidget = document.getElementById('chat-widget');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatBody = document.getElementById('chat-body');
  const quickReplies = document.querySelectorAll('.quick-reply-btn');

  function toggleChat() {
    chatWidget.classList.toggle('active');
    if (chatWidget.classList.contains('active')) {
      chatInput.focus();
    }
  }

  if (chatToggleBtn) chatToggleBtn.addEventListener('click', toggleChat);
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', toggleChat);

  function appendMessage(text, sender = 'bot') {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showBotTyping(callback) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot typing-indicator';
    typingDiv.innerHTML = '<span style="font-style:italic; opacity:0.75;">Đang soạn câu trả lời...</span>';
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      typingDiv.remove();
      callback();
    }, 700);
  }

  function handleUserMessage(msgText) {
    const text = msgText.trim();
    if (!text) return;

    appendMessage(text, 'user');
    if (chatInput) chatInput.value = '';

    showBotTyping(() => {
      const lower = text.toLowerCase();
      if (lower.includes('menu') || lower.includes('giá') || lower.includes('món')) {
        appendMessage('Tea Station có hơn 100 hương vị trà đặc sắc: Black Long Tea ($9.99), Green Tea Jasmine ($4.99), Citrus Herbal ($6.99) và Royal Milk Tea ($5.99). Bạn có thể bấm "Thêm vào giỏ" để đặt hàng ngay!');
      } else if (lower.includes('giờ') || lower.includes('mở cửa') || lower.includes('open')) {
        appendMessage('Tea Station mở cửa đón khách từ 08:00 đến 22:00 tất cả các ngày trong tuần (kể cả Thứ Bảy, Chủ Nhật và ngày Lễ).');
      } else if (lower.includes('địa chỉ') || lower.includes('ở đâu') || lower.includes('hà nội') || lower.includes('tràng tiền')) {
        appendMessage('Tea Station tọa lạc tại: 54 Tràng Tiền, Hoàn Kiếm, Hà Nội. Bạn có thể xem bản đồ Google Maps tương tác ngay phía dưới chân trang để nhận chỉ đường chi tiết!');
      } else if (lower.includes('giao hàng') || lower.includes('ship') || lower.includes('delivery')) {
        appendMessage('Chúng tôi có dịch vụ Home Delivery Service giao tận nhà khu vực nội thành Hà Nội trong 30 phút, đảm bảo trà vẫn giữ nguyên hương vị thơm ngát chuẩn vị.');
      } else if (lower.includes('stress') || lower.includes('mệt') || lower.includes('ngủ')) {
        appendMessage('Bạn đang căng thẳng hoặc khó ngủ? Hãy thử ngay tách "Green Tea Jasmine" hoặc "Chamomile Herbal Tea" để xoa dịu thần kinh và thư giãn sâu nhé!');
      } else {
        appendMessage('Cảm ơn bạn đã trò chuyện cùng Tea Station! Đội ngũ tư vấn sẽ hỗ trợ chi tiết thêm cho bạn qua hotline: +84 24 3987 6543.');
      }
    });
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', () => handleUserMessage(chatInput.value));
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUserMessage(chatInput.value);
    });
  }

  quickReplies.forEach(btn => {
    btn.addEventListener('click', () => handleUserMessage(btn.textContent));
  });

  /* ==========================================================================
     10. BACK TO TOP CONTROLLER
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     11. FORM LIÊN HỆ & TOAST THÔNG BÁO
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const toastNotice = document.getElementById('toast-notice');

  window.showToast = function(message) {
    if (!toastNotice) return;
    toastNotice.querySelector('.toast-text').textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3500);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const msgInput = document.getElementById('contact-message');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
        alert('Vui lòng điền đầy đủ Họ tên, Email và Lời nhắn.');
        return;
      }

      showToast(`Cảm ơn bạn ${nameInput.value}! Tin nhắn của bạn đã được gửi thành công đến Tea Station.`);
      contactForm.reset();
    });
  }

});
