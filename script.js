// Cozyys Cart & Checkout Logic

document.addEventListener('DOMContentLoaded', () => {
    // Cart Data Structure
    let cart = [];

    // WhatsApp Store Phone Number (Ganti dengan nomor WhatsApp usahamu)
    const WA_PHONE_NUMBER = '62895809530001';

    // DOM Elements
    const cartBadge = document.getElementById('cart-badge');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const cartSummarySection = document.getElementById('cart-summary-section');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTotalQtyEl = document.getElementById('cart-total-qty');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const btnCheckoutWa = document.getElementById('btn-checkout-wa');

    // Add to Cart Buttons Listener
    const addCartButtons = document.querySelectorAll('.btn-add-cart');
    addCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseInt(button.getAttribute('data-price'));

            addToCart(id, name, price);

            // Toast / Visual Feedback Effect
            button.innerHTML = '<i class="bi bi-check2"></i> Ditambahkan!';
            button.classList.replace('btn-outline-warning', 'btn-success');
            button.classList.remove('text-dark');
            button.classList.add('text-white');

            setTimeout(() => {
                button.innerHTML = '<i class="bi bi-cart-plus me-1"></i> Tambah';
                button.classList.replace('btn-success', 'btn-outline-warning');
                button.classList.remove('text-white');
                button.classList.add('text-dark');
            }, 1200);
        });
    });

    // Function: Add item to cart
    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                qty: 1
            });
        }
        updateCartUI();
    }

    // Function: Change Qty
    window.changeQty = function(id, delta) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
        }
        updateCartUI();
    };

    // Function: Remove item
    window.removeItem = function(id) {
        cart = cart.filter(i => i.id !== id);
        updateCartUI();
    };

    // Function: Format Currency Rupiah
    function formatRupiah(number) {
        return 'Rp ' + number.toLocaleString('id-ID');
    }

    // Function: Update Cart UI
    function updateCartUI() {
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        // Update Badge
        cartBadge.textContent = totalQty;

        if (cart.length === 0) {
            emptyCartMsg.classList.remove('d-none');
            cartSummarySection.classList.add('d-none');
            cartItemsContainer.innerHTML = '';
            cartItemsContainer.appendChild(emptyCartMsg);
        } else {
            emptyCartMsg.classList.add('d-none');
            cartSummarySection.classList.remove('d-none');

            // Render Cart Items
            let itemsHTML = '';
            cart.forEach(item => {
                itemsHTML += `
                    <div class="card border-0 bg-light p-3 mb-2 rounded-3">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 class="fw-bold mb-0 text-dark">${item.name}</h6>
                                <small class="text-danger fw-bold">${formatRupiah(item.price)}</small>
                            </div>
                            <button class="btn btn-sm text-danger p-0" onclick="removeItem('${item.id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="small text-muted">Total: ${formatRupiah(item.price * item.qty)}</span>
                            <div class="input-group input-group-sm w-auto">
                                <button class="btn btn-outline-secondary btn-sm rounded-circle px-2 py-0" onclick="changeQty('${item.id}', -1)">-</button>
                                <span class="px-3 fw-bold align-self-center small">${item.qty}</span>
                                <button class="btn btn-outline-secondary btn-sm rounded-circle px-2 py-0" onclick="changeQty('${item.id}', 1)">+</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            cartItemsContainer.innerHTML = itemsHTML;
        }

        // Update Summary
        cartSubtotalEl.textContent = formatRupiah(totalPrice);
        cartTotalQtyEl.textContent = `${totalQty} pcs`;
        cartTotalPriceEl.textContent = formatRupiah(totalPrice);
    }

    // Function: Checkout to WhatsApp
    btnCheckoutWa.addEventListener('click', () => {
        const name = document.getElementById('customer-name').value.trim();
        const address = document.getElementById('customer-address').value.trim();
        const notes = document.getElementById('customer-notes').value.trim();

        if (cart.length === 0) {
            alert('Keranjang kamu masih kosong!');
            return;
        }

        if (!name || !address) {
            alert('Mohon isi Nama dan Alamat Pengiriman terlebih dahulu.');
            return;
        }

        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        // Build WhatsApp Message Format
        let message = `Halo Cozyys!  Saya mau pesan Mac & Cheese via Website:\n\n`;
        message += ` *Nama Pelanggan:* ${name}\n`;
        message += ` *Alamat Pengiriman:* ${address}\n`;
        if (notes) {
            message += ` *Catatan:* ${notes}\n`;
        }
        message += `\n🛒 *Rincian Pesanan:*\n`;

        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} x${item.qty} = ${formatRupiah(item.price * item.qty)}\n`;
        });

        message += `\n *Total Pembayaran:* ${formatRupiah(totalPrice)}\n\n`;
        message += `Mohon konfirmasi ketersediaan dan total ongkos kirimnya ya. Terima kasih!`;

        // Redirect to WhatsApp
        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${WA_PHONE_NUMBER}?text=${encodedMessage}`;

        window.open(waUrl, '_blank');
    });

    // Countdown Timer Promo
    function startTimer() {
        let duration = (2 * 3600) + (45 * 60) + 30; // 2 Jam 45 Menit 30 Detik
        const hoursEl = document.getElementById('timer-hours');
        const minutesEl = document.getElementById('timer-minutes');
        const secondsEl = document.getElementById('timer-seconds');

        setInterval(() => {
            if (duration <= 0) duration = (2 * 3600) + (45 * 60) + 30;
            duration--;

            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            const seconds = duration % 60;

            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        }, 1000);
    }

    startTimer();
});