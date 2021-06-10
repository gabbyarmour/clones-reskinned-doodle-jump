/*****************************************************
Title: Doodle Jump
Author: Ania Kubow
Date: 2020
Code version: 1.0
Availability: https://github.com/kubowania/Doodle-Jump
******************************************************/

// Note: The following code has been adapted/mostly copied from Ania Kubow's Doodle Jump.
// Note2: I reskinned Doodle jump with my own Assets.


document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid') // picks grid class from style.css
    const doodler = document.createElement('div') // div for doodler, doodler not created yet
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint // from 150, would be below so nothing would happen - was changed to 250 for demo
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId // global to be overwritten
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0

    // Create the doodler
    function createDoodler() {
        grid.appendChild(doodler) // place doodler into grid - div
        doodler.classList.add('doodler') // styles doodler -- doesn't need the .
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px' // can style in javascript
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    // Platform Class -- creates new plat
    // need to be in an array to work in project
    class Platform {
        constructor(newPlatBottom) {
            this.left = Math.random() * 315 // returns number from 0 - 315
            this.bottom = newPlatBottom
            this.visual = document.createElement('div') // for each plat

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    // Create the platforms
    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 600 / platformCount  // space between platforms
            let newPlatBottom = 100 + i * platGap // using loop to increment gap space
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform) // place platforms into an array, create movement
            console.log(platforms) // creates a visual, adds to console log, think addmessage in arcmap
        }
    }

    // Move the platforms
    // only move when doodler is in certain position
    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4 // bottom minus 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                // arrays - adding more platforms
                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score ++
                    console.log(platforms)
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)

                }
            })
        }
    }

    // Move the Doodler
    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
           doodlerBottomSpace += 20 // adding 20 px
           doodler.style.bottom = doodlerBottomSpace + 'px'
           if (doodlerBottomSpace > startPoint + 200) {
               fall()
           }
       }, 30) // timer id
    }
    
    // The Doodler falls
    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                (doodlerBottomSpace >= platform.bottom) &&
                (doodlerBottomSpace <= platform.bottom + 15) && 
                ((doodlerLeftSpace + 60) >= platform.left) &&
                (doodlerLeftSpace <= (platform.left + 85)) && 
                !isJumping
                ) {
                    console.log('landed')
                    startPoint = doodlerBottomSpace
                    jump()
                }

            })

            
        }, 30) // timer id

    }

    // Game Over - for devs
    function gameOver() {
        console.log('game over')
        isGameOver = true
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    // Controls
    function control(e) {
        if (e.key === "ArrowLeft") {
            // move left
            moveLeft()
        } else if (e.key === "ArrowRight") {
            // move right
            moveRight()
        } else if (e.key === "ArrowUp") {
            // move straight
            moveStraight
        }
    }

    // Move Left Function
    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()
        },30)
    }

    // Move Right Function
    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(function () {
            if (doodlerLeftSpace <= 340) {
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveLeft()
        },30)
    }

    // Move Straight 
    function moveStraight() {
        isGoingRight = false
        isGoingLeft = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    // When to start game...
    function start() {
        // !isGameOver means not isGameOver, isGameOver == false
        if (!isGameOver) { 
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }

    // Attach a button to start game
    start() // later
})