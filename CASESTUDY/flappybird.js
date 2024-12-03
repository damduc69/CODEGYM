var canvas = document.getElementById("gamezone");
      var context = canvas.getContext("2d");
      var scoreshow = document.getElementById("score");
      var time=0;
      var currentTime=0;
      let SPEED = 5;

      var birdimg = new Image();
      var hinhnenchinh = new Image();
      var ongtren = new Image();
      var ongduoi = new Image();

      birdimg.src = "bird.png";
      hinhnenchinh.src = "nenchinh.png";
      ongtren.src = "ongtren.png";
      ongduoi.src = "ongduoi.png";

      // Khởi tạo các biến cần thiết
      var score = 0;
      var khoangcachhaiong = 140; // Khoảng cách giữa ống trên và ống dưới
      var khoangcachdenongduoi;

      // Tạo object bird
      var bird = {
        x: 100, // Tọa độ x ban đầu
        y: canvas.height / 2, // Tọa độ y ban đầu
        gravity: 3, // Tốc độ rơi
        jump: 60 // Tốc độ nhảy
      };

      function CreateOng() {
        var ong = {
          x: canvas.width, // Ống bắt đầu ngoài môn hình
          y: 0
        };
        return ong;
      }
      // Mảng ống
      var ong = [];
      ong.push(CreateOng());

      // Chờ tất cả hình ảnh tải xong trước khi chạy game
      hinhnenchinh.onload = function () {
        run();
      };

      function run() {
        // Vẽ nền
        context.drawImage(hinhnenchinh, 0, 0);
        context.drawImage(birdimg, bird.x, bird.y);

        for (var i = 0; i < ong.length; i++) {
          khoangcachdenongduoi = ongtren.height + khoangcachhaiong;

          // Vẽ ống
          context.drawImage(ongtren, ong[i].x, ong[i].y);
          context.drawImage(
            ongduoi,
            ong[i].x,
            ong[i].y + khoangcachdenongduoi
          );

         
          // Di chuyển ống
          ong[i].x -= SPEED
          ;

          // Tăng điểm khi bird vượt qua ống
          if (ong[i].x + ongtren.width < bird.x && !ong[i].passed) {
            score++;
            ong[i].passed = true; // Đánh dấu ống này đã được tính điểm
          }

          // Thêm ống mới
          if (ong[i].x == canvas.width / 2) {
            ong.push({
              x: canvas.width,
              y: Math.floor(Math.random() * ongtren.height) - ongtren.height,
              passed: false
            });
          }

          // Xóa ống cũ khi ra khỏi màn hình
          if (ong[i].x + ongtren.width < 0) {
            ong.splice(i, 1);
            ong.push(CreateOng());
          }
        
          

          // Xử lý va chạm
          if (
            bird.y + birdimg.height >= canvas.height || // Rơi chạm đất
            (bird.x + birdimg.width >= ong[i].x &&
              bird.x <= ong[i].x + ongtren.width &&
              (bird.y <= ong[i].y + ongtren.height ||
                bird.y + birdimg.height >=
                  ong[i].y + khoangcachdenongduoi))
          ) {
            alert("Game Over! Your score: " + score);
            document.location.reload();
            return;
          }
        }

        // Hiển thị điểm
        scoreshow.innerHTML = "Score: " + score;

        // Chim rơi xuống
        bird.y += bird.gravity;
        time=Date.now()-currentTime;
        currentTime=Date.now();
        if(time>=15000){
          time=0;
          SPEED++;
        }
        
        // Lặp lại hàm `run` để tạo chuyển động
        requestAnimationFrame(run);
      }

      // Chim nhảy lên khi nhấn phím
      document.addEventListener("keydown", function () {
        bird.y -= bird.jump;
      });