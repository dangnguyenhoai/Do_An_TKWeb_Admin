//=================================================================== Hoai
// Xử lí ẩn hiện khi ấn vào nút menu button trên tất cả loại màn hình
document.addEventListener('DOMContentLoaded', function () {
    const menu = document.getElementById('menu')
    const menuButton = document.getElementById('menu-button')
    const mainContent = document.getElementById('main-content')
    menuButton.addEventListener('click', function () {
        const isWideScreen = window.innerWidth >= 768

                if (isWideScreen) {
                    menu.classList.toggle('hide')
                } else {
                    menu.classList.toggle('show')
                }

                mainContent.classList.toggle('full-width')

    })
})

// Tắt menu khi ấn ngoài menu ở màn hình nhỏ
document.addEventListener('click', function (e) {
    const menu = document.getElementById('menu')
    const menuButton = document.getElementById('menu-button')
    if(!menu.contains(e.target) && !menuButton.contains(e.target)){
        menu.classList.remove('show')
    }
    
})


// Xử lí menu ẩn hiện khi thay đổi size màn hình
window.addEventListener('resize', function () {
    const menu = document.getElementById('menu')
    const mainContent = document.getElementById('main-content')
    const isWideScreen = window.innerWidth >= 768

    if (isWideScreen) {
        // Xoá class mobile nếu còn
        menu.classList.remove('show')

        // Nếu menu đang không bị ẩn thủ công, thì khôi phục layout mặc định
        if (!menu.classList.contains('hide')) {
            mainContent.classList.remove('full-width')
        }
    } else {
        // Khi thu nhỏ lại về mobile, bỏ class hide nếu có
        menu.classList.remove('hide')
        mainContent.classList.remove('full-width') // về trạng thái mặc định
    }
})


// Chart

//Report chart
const ctx = document.getElementById('reportsChart').getContext('2d')

const gradient = ctx.createLinearGradient(0, 0, 600, 0)
gradient.addColorStop(0, 'rgba(255, 200, 100, 1)') // Cam nhạt
gradient.addColorStop(0.5, 'rgba(255, 140, 0, 1)')    
gradient.addColorStop(1, 'rgba(255, 80, 0, 1)')  // Cam đỏ (gần đỏ)


  new Chart(ctx, {
    // Dữ liệu
    type: 'line',
    data: {
      labels: ['10g', '11g', '12g', '13g', '14g', '15g', '16g', '17g', '18g', '19g'],
      datasets: [{
        label: 'Doanh thu',
        data: [600, 450, 650, 550, 900, 600, 400, 700, 550, 850],
        borderColor: gradient,
        fill: false,// màu bên dưới đường
        tension: 0.4,//làm mượt đường cong
        pointRadius: 0,//vẽ chấm tròn
        borderWidth: 3
      }]
    },
    //Cấu trúc biểu đồ
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }  // Ẩn chú thích biểu đồ
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => value + 'K',// Gắn chữ 'K' sau giá trị
            // stepSize: 20 //quy định khoảng cách giữa các giá trị trên trục Y (trục tung).
          },
          beginAtZero: false  // Trục Y bắt đầu từ 0
        }
      }
    }
  })


// Customer source chart

const ctxPie  = document.getElementById('customerSourceChart').getContext('2d')

new Chart(ctxPie,{
    type: 'doughnut',
    data: {
        labels: ['Offline', 'Online'],
        datasets:   [
            {
                label: 'Doanh thu',
                data: [3500,2500],
                backgroundColor: [
                    'rgba(255, 200, 100, 1)',
                    'rgba(255, 80, 0, 1)'
                ],
                // borderColor: [
                //     'rgba(54, 162, 235, 1)',
                //     'rgba(75, 192, 192, 1)'
                // ],
                // borderWidth: 1
            }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
})


document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("#menu .nav-link");
    links.forEach(link => {
        link.addEventListener("click", function (e) {
            const text = this.innerText.trim();

            // Nếu là Đăng xuất thì cho phép chuyển trang
            if (text.includes("Đăng xuất")) return;

            e.preventDefault(); // Chỉ chặn nếu không phải đăng xuất

            // Đánh dấu active
            links.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            let url = "";
            if (text.includes("Người dùng")) url = "Other/user/user_Index.html";
            else if (text.includes("Sản phẩm")) url = "Other/product/admin_products.html";
            else if (text.includes("Đặt hàng")) url = "Other/order/orders.html";
            else if (text.includes("Trang chủ")) window.location.reload();

            fetch(url)
                .then(res => res.text())
                .then(data => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, "text/html");

                    // 1. Gắn lại các <style> inline (giải quyết lỗi của admin_products.html)
                    doc.querySelectorAll("style").forEach(style => {
                        const newStyle = document.createElement("style");
                        newStyle.textContent = style.textContent;
                        document.head.appendChild(newStyle);
                    });

                    // 2. Gắn lại CSS link nếu có
                    doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                        if (!document.querySelector(`link[href="${link.href}"]`)) {
                            const newLink = document.createElement("link");
                            newLink.rel = "stylesheet";
                            newLink.href = link.href;
                            document.head.appendChild(newLink);
                        }
                    });

                    // 3. Chèn nội dung vào dynamic-content
                    let newContent = doc.querySelector(".main-content")?.innerHTML || doc.body.innerHTML;
                    document.getElementById("dynamic-content").innerHTML = newContent || "<p>Không thể tải nội dung.</p>";

                    // 4. Gắn lại script
                    doc.querySelectorAll("script").forEach(script => {
                        const newScript = document.createElement("script");
                        if (script.src) {
                            newScript.src = script.src;
                        } else {
                            newScript.textContent = script.textContent;
                        }
                        document.body.appendChild(newScript);
                    });
                });
        });
    });
});



