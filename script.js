;(function(){
    const upBtn = document.querySelector('.up');
    const downBtn = document.querySelector('.down');
    const leftBtn = document.querySelector('.left');
    const rightBtn = document.querySelector('.right');
    class Random{
        static get(inicio, final){
            return Math.floor(Math.random() * final)+ inicio
        }
    }
 
    class Food{
        constructor(x,y){
            this.x = x
            this.y = y
            this.width = 15
            this.height = 15
        }

        draw(){
            ctx.fillStyle = 'red'
            ctx.fillRect(this.x,this.y,this.width,this.height)
        }


        static generate(){
            return new Food(Random.get(0,500),Random.get(0,300))
        }
    }

    class Square{
        constructor(x,y){
            this.x = x
            this.y = y
            this.width = 15
            this.height = 15
            this.back = null
        }

        draw(){
            ctx.fillStyle = 'black'
            ctx.fillRect(this.x,this.y,this.width,this.height)
            if(this.hasBack()){
                this.back.draw()
            }
        }
        add(){
            if(this.hasBack()){
                return this.back.add()
            }
            this.back = new Square(this.x,this.y)
        }
        hasBack(){
            return this.back !== null
        }
        copy(){
            if(this.hasBack()){
                this.back.copy()
                this.back.x = this.x
                this.back.y = this.y
            }
        }
        right(){
            this.copy()
            this.x += 10
        }
        left(){
            this.copy()
            this.x -= 10
        }
        up(){
            this.copy()
            this.y -= 10
        }
        down(){
            this.copy()
            this.y += 10
        }

        hit(head,second=false){
            if(this === head && !this.hasBack()) return false
            if(this === head) return this.back.hit(head,true)

            if(second && !this.hasBack()) return false
            if(second) return this.back.hit(head)


            if(this.hasBack()){
                return squareHit(this,head) || this.back.hit(head)
            }

            return squareHit(this,head)

            
        }
        hitBorder(){
            return this.x > 490|| this.x<0 || this.y > 290 || this.y< 0
        }
    }   

    class Snake{
        constructor(){
            this.head = new Square(100,0)
            this.draw()
            this.direction = 'right'
            this.head.add()
            this.head.add()
            this.head.add()
            this.head.add()
        }

        draw(){
            this.head.draw()
        }


        // Mover snake
        right(){
            if(this.direction == 'left') return
            this.direction = 'right'
        }
        left(){
            if(this.direction == 'right') return
            this.direction = 'left'
        }
        up(){
            if(this.direction == 'down') return
            this.direction = 'up'
        }
        down(){
            if(this.direction == 'up') return
            this.direction = 'down'
        }
        move(){
            if(this.direction == 'up') this.head.up()
            if(this.direction == 'down') this.head.down()
            if(this.direction == 'right') this.head.right()
            if(this.direction == 'left') this.head.left()
        }

        eat(){
            puntos ++
            this.head.add()
        }

        dead(){
            return this.head.hit(this.head) || this.head.hitBorder()
        }
    }

    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    let puntos = 0 
    const snake = new Snake()
    let foods = []
    
    window.addEventListener('keydown', function(e){
        e.preventDefault()
        if(e.key == 'ArrowDown') return snake.down();
        if(e.key == 'ArrowRight') return snake.right();
        if(e.key == 'ArrowUp') return snake.up();
        if(e.key =='ArrowLeft') return snake.left();
        return false
    })

    upBtn.addEventListener('click', () => {
        snake.up()
        // Agrega aquí la lógica para mover tu elemento hacia arriba.
    });

    downBtn.addEventListener('click', () => {
        snake.down()

        // Agrega aquí la lógica para mover tu elemento hacia abajo.
    });

    leftBtn.addEventListener('click', () => {
        snake.left()

        // Agrega aquí la lógica para mover tu elemento hacia la izquierda.
    });

    rightBtn.addEventListener('click', () => {
        snake.right()

        // Agrega aquí la lógica para mover tu elemento hacia la derecha.
    });

    const animation = setInterval(() => {
        snake.move()
        ctx.clearRect(0,0,canvas.width,canvas.height)
        snake.draw()
        drawFood()

        if(snake.dead()){
            console.log('se acabo')
            window.clearInterval(animation)
        }
    }, 1000 / 10);

    // Intervalo para poner comida
    setInterval(() => {
        const food = Food.generate()
        foods.push(food)
        setTimeout(function(){
            removeFromFoods(food)
        },10000)
    }, 4000);

    // Dibujar comida
    function drawFood(){
        for(const i in foods){
            const food = foods[i] 
            if(typeof food !== "undefined"){
                food.draw()
                if(hit(food,snake.head)){
                    snake.eat()
                    removeFromFoods(food)
                }
            }
        }
    }

    // Remover comida
    function removeFromFoods(food){
        foods = foods.filter(function(f){
            return food !== f
        })
    }

    // Verificar si un cuadrado choca con otro
    function squareHit(square_1,square_2){
        return square_1.x == square_2.x &&   square_1.y == square_2.y
    }


    function hit(a, b){
            var hit = false
            if(b.x + b.width >= a.x && b.x < a.x +a.width) {
                if(b.y + b.height >= a.y && b.y < a.y + a.height)
                hit = true
            } if(b.x <= a.x && b.x + b.width >= a.x + a.width) { 
                if(b.y <= a.y && b.y + b.height >= a.y + a.height)
                hit = true 
            } if(a.x <= b.x && a.x + a.width >= b.x + b.width) {
                if(a.y <= b.y && a.y +a.height >= b.y + b.height)
                hit = true
            }
            return hit;
        }
})()