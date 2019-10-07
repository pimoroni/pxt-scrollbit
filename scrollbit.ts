//% weight=100 color=#000000 icon="\uf06e" block="Scroll:Bit"
namespace scrollbit {
    const I2C_ADDR: number = 0x74
    const REG_MODE: number = 0x00
    const REG_FRAME: number = 0x01
    const REG_AUDIOSYNC: number = 0x06
    const REG_SHUTDOWN: number = 0x0a

    const REG_COLOR: number = 0x24
    const REG_BLINK: number = 0x12
    const REG_ENABLE: number = 0x00

    const REG_BANK: number = 0xfd
    const BANK_CONFIG: number = 0x0b

    const COLS: number = 17
    const ROWS: number = 7

    let UPSIDE_DOWN: boolean = false

    const ARROWOFFSET: number = 40

    const ICONS: string[] = [
        "Heart",
        "SmallH",
        "Yes",
        "No",
        "Happy",
        "Sad",
        "Confus",
        "Angry",
        "Asleep",
        "Surpri",
        "Silly",
        "Fabulo",
        "Meh",
        "TShirt",
        "Roller",
        "Duck",
        "House",
        "Tortoi",
        "Butter",
        "StickF",
        "Ghost",
        "Sword",
        "Giraff",
        "Skull",
        "Umbrel",
        "Snake",
        "Rabbit",
        "Cow",
        "Quarte",
        "EigthN",
        "Pitchf",
        "Target",
        "Triang",
        "LeftTr",
        "Chessb",
        "Diamon",
        "SmallD",
        "Square",
        "SmallS",
        "Scisso",
    
        "North",
        "NorthE",
        "East",
        "SouthE",
        "South",
        "SouthW",
        "West",
        "NorthW"
    ]

    let buf: Buffer = pins.createBuffer(144)
    let frame: number = 0

    /**
     * Scroll text across scroll:bit
     * @param text - text to scroll
     * @param brightness - brightness to set (0-255)
     * @param delay - additional delay in milliseconds (0-100)
     */
    //% blockId=scrollbit_scroll_text 
    //% block="scroll %text| at brightness %brightness| with delay (ms) %delay"
    //% brightness.min=0 brightness.max=255 brightness.defl=128
    //% delay.min=0 delay.max=100 delay.defl=50
    export function scrollText(text: string, brightness: number = 128, delay: number = 50) {
        text = tokenize(text)
        let len: number = measureText(text)
        for (let col: number = 0; col < len + COLS; col++){
            clear()
            _drawText(text, -col + COLS, 1, brightness)
            show()
            if (delay > 0) {
                control.waitMicros(delay * 1000)
            }    
        }
    }

    function tokenize(text: string): string {
        let result: string = ""
        let icon: string = ""

        for (let x = 0; x < text.length; x++){
            let char: string = text.charAt(x)
            if (char == "}" && icon.length > 0) {
                let index: number = ICONS.indexOf(icon.substr(1,6))
                icon += char

                if (index > -1) {
                    icon = String.fromCharCode(DAL.MICROBIT_FONT_ASCII_END + 1 + index)
                }

                result += icon
                icon = ""
                continue
            }
            if (char == "{" || icon.length > 0) {
                icon += char
                continue
            }
            result += char
        }

        return result
    }

    /**
     * Draw an icon on scroll:bit
     * @param icon - icon to draw
     * @param col - column to set (0-16)
     * @param row - row to set (0-6)
     * @param brightness - brightness to set (0-255)
     */
    //% blockId=scrollbit_set_icon
    //% block="draw icon %icon| at col %col| row %row| with brightness %brightness"
    //% icon.fieldEditor="gridpicker"
    //% icon.fieldOptions.width="400" icon.fieldOptions.columns="5"
    //% icon.fieldOptions.itemColour="black" icon.fieldOptions.tooltips="true"
    //% col.min=0 col.max=16
    //% row.min=0 row.max=6
    //% brightness.min=0 brightness.max=255 brightness.defl=128
    export function setIcon(icon: IconNames, col: number, row: number, brightness: number = 128): void {
        let image: Image = images.iconImage(icon)
        setImage(image, col, row, brightness)
    }

    /**
     * Draw an arrow on scroll:bit
     * @param arrow - arrow to draw
     * @param col - column to set (0-16)
     * @param row - row to set (0-6)
     * @param brightness - brightness to set (0-255)
     */
    //% blockId=scrollbit_set_arrow
    //% block="draw arrow %arrow| at col %col| row %row| with brightness %brightness"
    //% col.min=0 col.max=16
    //% row.min=0 row.max=6
    //% brightness.min=0 brightness.max=255 brightness.defl=128
    export function setArrow(arrow: ArrowNames, col: number, row: number, brightness: number = 128): void {
        let image: Image = images.arrowImage(arrow)
        setImage(image, col, row, brightness)
    }

    /**
     * Draw an image on scroll:bit
     * @param image - image to draw
     * @param col - column to set (0-16)
     * @param row - row to set (0-6)
     * @param brightness - brightness to set (0-255)
     */
    //% blockId=scrollbit_set_image
    //% block="draw image %image| at col %col| row %row| with brightness %brightness"
    //% col.min=0 col.max=16
    //% row.min=0 row.max=6
    //% brightness.min=0 brightness.max=255 brightness.defl=128
    export function setImage(image: Image, col: number, row: number, brightness: number = 128): void {
        for (let c_row = 0; c_row < 5; c_row++) {
            for (let c_col = 0; c_col < image.width(); c_col++) {
                if (image.pixelBrightness(c_col, c_row)) {
                    setPixel(col + c_col, row + c_row, brightness)
                }
            }
        }
    }

    /**
     * Set a single pixel on scroll:bit
     * @param col - column to set (0-16)
     * @param row - row to set (0-6)
     * @param brightness - brightness to set (0-255)
     */
    //% blockId=scrollbit_set_pixel
    //% block="set pixel| at col %col| row %row| to %brightness"
    //% col.min=0 col.max=16
    //% row.min=0 row.max=6
    //% brightness.min=0 brightness.max=255 brightness.defl=128
    export function setPixel(col: number, row: number, brightness: number = 128): void {
        if(col < 0 || row < 0 || col >= COLS || row >= ROWS){return}
        if (UPSIDE_DOWN) {col = (COLS - 1) - col; row = (ROWS - 1) - row}
        buf[pixelAddr(col, row)] = Math.clamp(0, 255, brightness)
    }

    /**
     * Set the orientation of the scroll:bit
     * @param upside_down - is the scroll:bit upside down? (true/false)
     */
    //% blockId=scrollbit_upside_down
    //% block="turn the scroll:bit| upside down? %upside_down"
    //% upside_down.defl=false
    export function setUpsideDown(upside_down: boolean): void {
        UPSIDE_DOWN = upside_down
    }

    /**
     * Update scroll:bit,
     * update the display with your pretty pixels
     */
    //% blockId=scrollbit_show
    //% block="display your changes"
    export function show(): void {
        let corrected_buf: Buffer = pins.createBuffer(144)

        for (let x = 0; x < buf.length; x++) {
            corrected_buf[x] = correctGamma(buf[x])
        }

        smbus.writeByte(I2C_ADDR, REG_BANK, frame)
        smbus.writeBuffer(I2C_ADDR, REG_COLOR, corrected_buf)
        smbus.writeByte(I2C_ADDR, REG_BANK, BANK_CONFIG)
        smbus.writeByte(I2C_ADDR, REG_FRAME, frame)

        frame = frame == 0 ? 1 : 0
    }

    /**
     * Clear scroll:bit,
     * sets all pixels to 0, but does not update display
     */
    //% blockId=scrollbit_clear
    //% block="clear scroll:bit"
    //% icon=""
    export function clear(): void {
        buf.fill(0)
    }

    /**
     * Return the width (number of cols) of scroll:bit
     */
    //% blockId=scrollbit_cols
    //% block="number of columns"
    //% color=#444444
    //% icon=""
    export function cols(): number {
        return COLS
    }

    /**
     * Return the height (number of rows) of scroll:bit
     */
    //% blockId=scrollbit_rows
    //% block="number of rows"
    //% color=#444444
    //% icon=""
    export function rows(): number {
        return ROWS
    }

    /**
     * Get a single pixel on scroll:bit,
     * returns a brightness value (0-255)
     * @param col - column to get (0-16)
     * @param row - row to get (0-6)
     */
    //% blockId=scrollbit_get_pixel icon="\uf0eb"
    //% block="get pixel| at col %col| row %row"
    //% advanced color=#554444
    export function getPixel(col: number, row: number): number {
        return buf[pixelAddr(col, row)]
    }

    /**
     * Measure text, returns a length in pixels
     * @param text - text to measure
     */
    //% blockId=scrollbit_measure_text
    //% block="get length of %text in pixels"
    //% advanced color=#554444
    export function measureText(text: string): number {
        let len: number = 0
        for (let x: number = 0; x < text.length; x++){
            len += charWidth(text.charAt(x)) + 1
        }
        return len
    }

    /**
     * Draw a single alphanumeric character.
     * @param col - column position (0-16)
     * @param row - row position (0-6)
     * @param char - character to draw
     * @param brightness - brightness (0-255)
     */
    export function drawChar(char: string, col: number, row: number, brightness: number = 128): void {
        if (char.charCodeAt(0) > DAL.MICROBIT_FONT_ASCII_END + ARROWOFFSET) {
            setArrow(char.charCodeAt(0) - DAL.MICROBIT_FONT_ASCII_END - ARROWOFFSET - 1, col, row, brightness)
            return;
        }
        if (char.charCodeAt(0) > DAL.MICROBIT_FONT_ASCII_END) {
            setIcon(char.charCodeAt(0) - DAL.MICROBIT_FONT_ASCII_END - 1, col, row, brightness)
            return;
        }
        let data: Buffer = getChar(char)
        for (let c_row = 0; c_row < 5; c_row++) {
            for (let c_col = 0; c_col < 5; c_col++) {
                if ((data[c_row] & (1 << (4 - c_col))) > 0) {
                    setPixel(col + c_col, row + c_row, brightness)
                }
            }
        }
    }

    /**
     * Draw text on scroll:bit
     * @param col - column to set (0-16)
     * @param row - row to set (0-6)
     * @param text - text to show
     * @param brightness - brightness to set (0-255)
     */
    //% blockId=scrollbit_draw_text
    //% block="draw %text| at col %col| row %row| with brightness %brightness"
    //% advanced color=#220000
    //% col.min=0 col.max=16
    //% row.min=0 row.max=6
    //% brightness.min=0 brightness.max=255 brightness.defl=128
    export function drawText(text: string, col: number, row: number, brightness: number = 128): void {
        text = tokenize(text)
        _drawText(text, col, row, brightness)
    }
    export function _drawText(text: string, col: number, row: number, brightness: number = 128): void {
        let offset_col: number = 0
        for (let x: number = 0; x < text.length; x++){
            let width:  number = charWidth(text.charAt(x))
            if (col + offset_col >= COLS) {
                return
            }
            if (col + offset_col + width < 0) {
                offset_col += width + 1
                continue
            }
            drawChar(text.charAt(x), col + offset_col, row, brightness)
            offset_col += width + 1
        }
    }

    /**
     * TODO: Get some GUI/UX magic for this
     * Set all the pixels on scroll:bit using
     * a text string. Brightness = charCode.
     * eg ' ' = 32, 'z' = 122
     */
    //% blockId=scrollbit_show_leds
    //% block="display LEDs from text %text"
    //% advanced color=#220000
    export function showLeds(leds: string): void {
        leds = leds.substr(0, COLS * ROWS)
        for (let x = 0; x < leds.length; x++) {
            let brightness = leds.charCodeAt(x);
            let col = x % COLS
            let row = Math.idiv((x - col), COLS)
            setPixel(col, row, brightness)
        }
        show()
    }

    function pixelAddr(col: number, row: number): number {
        row = 7 - (row + 1)

        if (col > 8) {
            col = col - 8
            row = 6 - (row + 8)
        } else {
            col = 8 - col
        }

        return (col * 16) + row
    }

    //% shim=scrollbit::correctGamma
    function correctGamma(brightness: number): number {
        return 0
    }


    //% shim=scrollbit::getFontDataByte
    function getFontDataByte(index: number): number {
        return 0
    }

    //% shim=scrollbit::getFontData
    function getFontData(index: number): Buffer {
        return pins.createBuffer(5)
    }

    //% shim=scrollbit::getCharWidth
    function getCharWidth(char: number): number {
        return 5
    }

    function getChar(character: string): Buffer {
        return getFontData(character.charCodeAt(0))
    }

    function charWidth(character: string): number {
        let charcode: number = character.charCodeAt(0)
        if (charcode > DAL.MICROBIT_FONT_ASCII_END) {
            return 5
        }
        return getCharWidth(charcode)
    }

    /**
     * Setup scroll:bit,
     * must be called before using the display
     */
    export function setup(): void {
        clear()
        smbus.writeByte(I2C_ADDR, REG_BANK, BANK_CONFIG)

        control.waitMicros(1000)
        smbus.writeByte(I2C_ADDR, REG_SHUTDOWN, 0)
        control.waitMicros(1000)
        smbus.writeByte(I2C_ADDR, REG_SHUTDOWN, 1)
        control.waitMicros(1000)

        smbus.writeByte(I2C_ADDR, REG_MODE, 0)
        smbus.writeByte(I2C_ADDR, REG_AUDIOSYNC, 0)

        let enable = pins.createBuffer(17)
        enable.fill(255)
        smbus.writeByte(I2C_ADDR, REG_BANK, 0)
        smbus.writeBuffer(I2C_ADDR, 0, enable)
        smbus.writeByte(I2C_ADDR, REG_BANK, 1)
        smbus.writeBuffer(I2C_ADDR, 0, enable)
    }
}

namespace smbus {
    export function writeByte(addr: number, register: number, value: number): void {
        let temp = pins.createBuffer(2);
        temp[0] = register;
        temp[1] = value;
        pins.i2cWriteBuffer(addr, temp, false);
    }
    export function writeBuffer(addr: number, register: number, value: Buffer): void {
        let temp = pins.createBuffer(value.length + 1);
        temp[0] = register;
        for (let x = 0; x < value.length; x++) {
            temp[x + 1] = value[x];
        }
        pins.i2cWriteBuffer(addr, temp, false);
    }
    export function readBuffer(addr: number, register: number, len: number): Buffer {
        let temp = pins.createBuffer(1);
        temp[0] = register;
        pins.i2cWriteBuffer(addr, temp, false);
        return pins.i2cReadBuffer(addr, len, false);
    }
    function readNumber(addr: number, register: number, fmt: NumberFormat = NumberFormat.UInt8LE): number {
        let temp = pins.createBuffer(1);
        temp[0] = register;
        pins.i2cWriteBuffer(addr, temp, false);
        return pins.i2cReadNumber(addr, fmt, false);
    }
}

scrollbit.setup();
