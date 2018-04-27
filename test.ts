// tests go here; this will not be compiled when this package is used as a library

/*
basic.forever(() => {
    scrollbit.scrollText("{Heart}")
    scrollbit.scrollText("{SmallHeart}")
    scrollbit.scrollText("{Yes}")
    scrollbit.scrollText("{No}")
    scrollbit.scrollText("{Happy}")
    scrollbit.scrollText("{Sad}")
    scrollbit.scrollText("{Confused}")
    scrollbit.scrollText("{Angry}")
    scrollbit.scrollText("{Asleep}")
    scrollbit.scrollText("{Surprised}")
    scrollbit.scrollText("{Silly}")
    scrollbit.scrollText("{Fabulous}")
    scrollbit.scrollText("{Meh}")
    scrollbit.scrollText("{TShirt}")
    scrollbit.scrollText("{Rollerskate}")
    scrollbit.scrollText("{Duck}")
    scrollbit.scrollText("{House}")
    scrollbit.scrollText("{Tortoise}")
    scrollbit.scrollText("{Butterfly}")
    scrollbit.scrollText("{StickFigure}")
    scrollbit.scrollText("{Ghost}")
    scrollbit.scrollText("{Sword}")
    scrollbit.scrollText("{Giraffe}")
    scrollbit.scrollText("{Skull}")
    scrollbit.scrollText("{Umbrella}")
    scrollbit.scrollText("{Snake}")
    scrollbit.scrollText("{Rabbit}")
    scrollbit.scrollText("{Cow}")
    scrollbit.scrollText("{QuarterNote}")
    scrollbit.scrollText("{EightNote}")
    scrollbit.scrollText("{Pitchfork}")
    scrollbit.scrollText("{Target}")
    scrollbit.scrollText("{Triangle}")
    scrollbit.scrollText("{LeftTriangle}")
    scrollbit.scrollText("{Chessboard}")
    scrollbit.scrollText("{Diamond}")
    scrollbit.scrollText("{SmallDiamond}")
    scrollbit.scrollText("{Square}")
    scrollbit.scrollText("{SmallSquare}")
    scrollbit.scrollText("{Scissors}")
    scrollbit.scrollText("{North}")
    scrollbit.scrollText("{NorthEast}")
    scrollbit.scrollText("{East}")
    scrollbit.scrollText("{SouthEast}")
    scrollbit.scrollText("{South}")
    scrollbit.scrollText("{SouthWest}")
    scrollbit.scrollText("{West}")
    scrollbit.scrollText("{NorthW}")
})
*/

/*

basic.showIcon(IconNames.Heart)

let brightness: number = 128

for (let col: number = 0; col < scrollbit.cols(); col++){
    for (let row: number = 0; row < scrollbit.rows(); row++){
        let offset: number = (row * scrollbit.cols()) + col
        let br: number = (brightness + 25) - ((offset * brightness) / 119)
        br = Math.max(0, br)
        if (offset > 117) br = 0
        scrollbit.setPixel(col, row, br)
    }
}

scrollbit.show()
*/

/*
// Test Jig Code

basic.forever(function(){

    for (let col: number = 0; col < scrollbit.cols(); col++){
        for (let row: number = 0; row < scrollbit.rows(); row++){
            let offset: number = (col * scrollbit.cols()) + row
            scrollbit.setPixel(col, row, 64 * (offset % 2))
        }
    }
    scrollbit.show()
    control.waitMicros(1000000)
    for (let col: number = 0; col < scrollbit.cols(); col++){
        for (let row: number = 0; row < scrollbit.rows(); row++){
            let offset: number = (col * scrollbit.cols()) + row
            scrollbit.setPixel(col, row, 64 * ((offset + 1) % 2))
        }
    }
    scrollbit.show()
    control.waitMicros(1000000)
    for (let col: number = 0; col < scrollbit.cols(); col++){
        for (let row: number = 0; row < scrollbit.rows(); row++){
            let offset: number = (col * scrollbit.cols()) + row
            scrollbit.setPixel(col, row, 64)
        }
    }
    scrollbit.show()
    control.waitMicros(1000000)
    scrollbit.clear()    
    scrollbit.show()
    control.waitMicros(1000000)

})
*/

/*

scrollbit.scrollText("Yarrrrrrrrrrrrrrrrrr")
scrollbit.scrollText("The quick, brown fox jumped over the lazy dog! How slow does this get when displaying a really long sentence? I wonder. Let's see how far we can push this thing.", 128, 0)
scrollbit.scrollText("Hello World! How are you today?", 128)
scrollbit.scrollText("Super duper scrollalicious!", 128)
scrollbit.setPixel(0,0,128)
scrollbit.show()
*/